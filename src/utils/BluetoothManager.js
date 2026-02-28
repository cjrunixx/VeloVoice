/**
 * BluetoothManager.js
 * Handles Web Bluetooth connection and ELM327 protocol communication.
 * PIDs (Parameter IDs) commonly used:
 * 010C: RPM
 * 010D: Speed
 * 0105: Coolant Temp
 * 012F: Fuel Level
 */

export class BluetoothManager {
    constructor() {
        this.device = null;
        this.server = null;
        this.service = null;
        this.characteristic = null;
        this.isConnected = false;

        // Common ELM327 UART Service UUIDs
        this.SERVICE_UUID = '0000fff0-0000-1000-8000-00805f9b34fb'; // Common for cheap ELM327
        this.CHAR_UUID = '0000fff1-0000-1000-8000-00805f9b34fb';
    }

    async connect() {
        try {
            console.log('Requesting Bluetooth Device...');
            this.device = await navigator.bluetooth.requestDevice({
                filters: [
                    { namePrefix: 'OBD' },
                    { namePrefix: 'ELM' },
                    { services: [this.SERVICE_UUID] }
                ],
                optionalServices: [this.SERVICE_UUID, 'heart_rate'] // Add others as needed
            });

            console.log('Connecting to GATT Server...');
            this.server = await this.device.gatt.connect();

            console.log('Getting Service...');
            this.service = await this.server.getPrimaryService(this.SERVICE_UUID);

            console.log('Getting Characteristic...');
            this.characteristic = await this.service.getCharacteristic(this.CHAR_UUID);

            this.isConnected = true;
            console.log('OBD-II Connected!');

            this.device.addEventListener('gattserverdisconnected', () => {
                this.isConnected = false;
                console.log('OBD-II Disconnected');
            });

            return true;
        } catch (error) {
            console.error('Bluetooth Connection Failed:', error);
            throw error;
        }
    }

    async sendCommand(cmd) {
        if (!this.isConnected || !this.characteristic) return null;

        const encoder = new TextEncoder();
        const data = encoder.encode(cmd + '\r');
        await this.characteristic.writeValue(data);

        // In a real app, you'd listen for notifications to get the response
        // For now, we simulate the 'write and wait' or just return success
        return true;
    }

    async disconnect() {
        if (this.device && this.device.gatt.connected) {
            this.device.gatt.disconnect();
        }
    }
}

export const bluetoothManager = new BluetoothManager();
