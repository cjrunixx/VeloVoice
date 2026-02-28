/**
 * 🚗 VeloVoice Vehicle Profile Database
 * Each profile defines brand/model metadata, supported OBD-II PIDs,
 * car features available, climate zones, seat layout, and fuel type.
 *
 * OBD-II PIDs are standard hex codes (SAE J1979) universally supported
 * on all OBD-II compliant vehicles (1996+).
 */

export const OBD_PIDS = {
    // ── Universal Standard PIDs (ALL cars 1996+) ──
    VEHICLE_SPEED: { pid: '0D', name: 'Speed', unit: 'km/h', bytes: 1 },
    ENGINE_RPM: { pid: '0C', name: 'RPM', unit: 'rpm', bytes: 2, formula: 'A*256+B)/4' },
    COOLANT_TEMP: { pid: '05', name: 'Coolant Temp', unit: '°C', bytes: 1, formula: 'A-40' },
    THROTTLE_POS: { pid: '11', name: 'Throttle', unit: '%', bytes: 1, formula: 'A*100/255' },
    ENGINE_LOAD: { pid: '04', name: 'Engine Load', unit: '%', bytes: 1, formula: 'A*100/255' },
    FUEL_LEVEL: { pid: '2F', name: 'Fuel Level', unit: '%', bytes: 1, formula: 'A*100/255' },
    INTAKE_AIR_TEMP: { pid: '0F', name: 'Intake Temp', unit: '°C', bytes: 1, formula: 'A-40' },
    RUNTIME: { pid: '1F', name: 'Run Time', unit: 's', bytes: 2 },
    FUEL_PRESSURE: { pid: '0A', name: 'Fuel Pressure', unit: 'kPa', bytes: 1 },
    OBD_STANDARD: { pid: '1C', name: 'OBD Standard', unit: '', bytes: 1 },
    // ── EV-Specific PIDs ──
    HV_BATTERY_SOC: { pid: '5B', name: 'HV Battery', unit: '%', bytes: 1, evOnly: true },
    MOTOR_TORQUE: { pid: '98', name: 'Motor Torque', unit: 'Nm', bytes: 2, evOnly: true },
};

const VEHICLE_PROFILES = {
    // ──────────────────────────────────────────────────────────
    // BMW
    // ──────────────────────────────────────────────────────────
    bmw: {
        brand: 'BMW',
        logo: '🇩🇪',
        color: '#0166B1',
        models: {
            i4: {
                name: 'i4',
                year: '2021-present',
                type: 'EV',
                seats: 5,
                climateZones: 4,
                supportedPIDs: ['VEHICLE_SPEED', 'ENGINE_RPM', 'COOLANT_TEMP', 'THROTTLE_POS', 'HV_BATTERY_SOC', 'MOTOR_TORQUE'],
                features: { ac: true, sunroof: true, seatHeating: true, ventilationSeats: true, ambientLighting: true, doorsLocked: true, engine: true },
                obdProtocol: 'ISO 15765-4 CAN',
            },
            '3-series': {
                name: '3 Series',
                year: '2019-present',
                type: 'ICE',
                seats: 5,
                climateZones: 2,
                supportedPIDs: ['VEHICLE_SPEED', 'ENGINE_RPM', 'COOLANT_TEMP', 'THROTTLE_POS', 'FUEL_LEVEL', 'ENGINE_LOAD'],
                features: { ac: true, sunroof: true, seatHeating: true, ventilationSeats: false, doorsLocked: true, engine: true },
                obdProtocol: 'ISO 15765-4 CAN',
            }
        }
    },

    // ──────────────────────────────────────────────────────────
    // Tesla
    // ──────────────────────────────────────────────────────────
    tesla: {
        brand: 'Tesla',
        logo: '⚡',
        color: '#E31937',
        models: {
            'model-3': {
                name: 'Model 3',
                year: '2017-present',
                type: 'EV',
                seats: 5,
                climateZones: 2,
                supportedPIDs: ['VEHICLE_SPEED', 'HV_BATTERY_SOC', 'MOTOR_TORQUE', 'THROTTLE_POS'],
                features: { ac: true, sunroof: true, seatHeating: true, ventilationSeats: true, doorsLocked: true, engine: true },
                obdProtocol: 'ISO 15765-4 CAN',
                note: 'Tesla uses a proprietary CAN bus. Some PIDs require 3rd party adapters.'
            },
            'model-s': {
                name: 'Model S',
                year: '2012-present',
                type: 'EV',
                seats: 5,
                climateZones: 4,
                supportedPIDs: ['VEHICLE_SPEED', 'HV_BATTERY_SOC', 'MOTOR_TORQUE'],
                features: { ac: true, sunroof: false, seatHeating: true, ventilationSeats: true, doorsLocked: true, engine: true },
                obdProtocol: 'ISO 15765-4 CAN',
            }
        }
    },

    // ──────────────────────────────────────────────────────────
    // Tata Motors
    // ──────────────────────────────────────────────────────────
    'Tata': {
        brand: 'Tata',
        logo: '🦁',
        color: '#1A1A1A',
        models: {
            'Nexon EV': {
                name: 'Nexon EV', year: 2024, type: 'EV', seats: 5, climateZones: 1,
                obdProtocol: 'ISO 15765-4 CAN',
                supportedPIDs: ['SPEED', 'RPM', 'BATTERY_SOC', 'MOTOR_TEMP'],
                features: { engine: true, doorsLocked: true, ac: true, sunroof: true, temp: 22 }
            },
            'Punch EV': {
                name: 'Punch EV', year: 2024, type: 'EV', seats: 5, climateZones: 1,
                obdProtocol: 'ISO 15765-4 CAN',
                supportedPIDs: ['SPEED', 'RPM', 'BATTERY_SOC', 'MOTOR_TEMP'],
                features: { engine: true, doorsLocked: true, ac: true, sunroof: true, temp: 22 }
            },
            'Tiago EV': {
                name: 'Tiago EV', year: 2023, type: 'EV', seats: 5, climateZones: 1,
                obdProtocol: 'ISO 15765-4 CAN',
                supportedPIDs: ['SPEED', 'RPM', 'BATTERY_SOC'],
                features: { engine: true, doorsLocked: true, ac: true, sunroof: false, temp: 22 }
            },
            'Harrier': {
                name: 'Harrier', year: 2024, type: 'Diesel', seats: 5, climateZones: 2,
                obdProtocol: 'ISO 15765-4 CAN',
                supportedPIDs: ['SPEED', 'RPM', 'ENG_TEMP', 'FUEL_LEVEL'],
                features: { engine: true, doorsLocked: true, ac: true, sunroof: true, temp: 22, seatHeating: true }
            },
            'Safari': {
                name: 'Safari', year: 2024, type: 'Diesel', seats: 7, climateZones: 2,
                obdProtocol: 'ISO 15765-4 CAN',
                supportedPIDs: ['SPEED', 'RPM', 'ENG_TEMP', 'FUEL_LEVEL'],
                features: { engine: true, doorsLocked: true, ac: true, sunroof: true, temp: 22, seatHeating: true, ventilationSeats: true }
            },
            'Altroz': {
                name: 'Altroz', year: 2023, type: 'ICE', seats: 5, climateZones: 1,
                obdProtocol: 'ISO 15765-4 CAN',
                supportedPIDs: ['SPEED', 'RPM', 'ENG_TEMP', 'FUEL_LEVEL'],
                features: { engine: true, doorsLocked: true, ac: true, sunroof: true, temp: 22 }
            }
        }
    },

    // ──────────────────────────────────────────────────────────
    // Toyota
    // ──────────────────────────────────────────────────────────
    toyota: {
        brand: 'Toyota',
        logo: '🇯🇵',
        color: '#EB0A1E',
        models: {
            camry: {
                name: 'Camry (Hybrid)',
                year: '2018-present',
                type: 'Hybrid',
                seats: 5,
                climateZones: 2,
                supportedPIDs: ['VEHICLE_SPEED', 'ENGINE_RPM', 'COOLANT_TEMP', 'FUEL_LEVEL', 'ENGINE_LOAD', 'HV_BATTERY_SOC'],
                features: { ac: true, sunroof: false, seatHeating: true, ventilationSeats: false, doorsLocked: true, engine: true },
                obdProtocol: 'ISO 15765-4 CAN',
            },
            fortuner: {
                name: 'Fortuner',
                year: '2016-present',
                type: 'ICE',
                seats: 7,
                climateZones: 2,
                supportedPIDs: ['VEHICLE_SPEED', 'ENGINE_RPM', 'COOLANT_TEMP', 'FUEL_LEVEL', 'ENGINE_LOAD', 'THROTTLE_POS'],
                features: { ac: true, sunroof: false, seatHeating: false, ventilationSeats: false, doorsLocked: true, engine: true },
                obdProtocol: 'ISO 15765-4 CAN',
            }
        }
    },

    // ──────────────────────────────────────────────────────────
    // Mercedes-Benz
    // ──────────────────────────────────────────────────────────
    mercedes: {
        brand: 'Mercedes-Benz',
        logo: '⭐',
        color: '#444444',
        models: {
            'eqc': {
                name: 'EQC',
                year: '2019-present',
                type: 'EV',
                seats: 5,
                climateZones: 4,
                supportedPIDs: ['VEHICLE_SPEED', 'HV_BATTERY_SOC', 'MOTOR_TORQUE', 'COOLANT_TEMP', 'THROTTLE_POS'],
                features: { ac: true, sunroof: true, seatHeating: true, ventilationSeats: true, ambientLighting: true, doorsLocked: true, engine: true },
                obdProtocol: 'ISO 15765-4 CAN',
            },
            'c-class': {
                name: 'C-Class',
                year: '2021-present',
                type: 'ICE',
                seats: 5,
                climateZones: 2,
                supportedPIDs: ['VEHICLE_SPEED', 'ENGINE_RPM', 'COOLANT_TEMP', 'THROTTLE_POS', 'FUEL_LEVEL'],
                features: { ac: true, sunroof: true, seatHeating: true, ventilationSeats: false, doorsLocked: true, engine: true },
                obdProtocol: 'ISO 15765-4 CAN',
            }
        }
    },

    // ──────────────────────────────────────────────────────────
    // Hyundai
    // ──────────────────────────────────────────────────────────
    'Hyundai': {
        brand: 'Hyundai',
        logo: '⚪',
        color: '#002C5F',
        models: {
            'Ioniq 5': {
                name: 'Ioniq 5', year: 2024, type: 'EV', seats: 5, climateZones: 2,
                obdProtocol: 'ISO 15765-4 CAN',
                supportedPIDs: ['SPEED', 'RPM', 'BATTERY_SOC', 'MOTOR_TEMP'],
                features: { engine: true, doorsLocked: true, ac: true, sunroof: true, temp: 22, seatHeating: true, ventilationSeats: true }
            },
            'Creta': {
                name: 'Creta', year: 2024, type: 'ICE', seats: 5, climateZones: 2,
                obdProtocol: 'ISO 15765-4 CAN',
                supportedPIDs: ['SPEED', 'RPM', 'ENG_TEMP', 'FUEL_LEVEL'],
                features: { engine: true, doorsLocked: true, ac: true, sunroof: true, temp: 22, ventilationSeats: true }
            },
            'Venue': {
                name: 'Venue', year: 2024, type: 'ICE', seats: 5, climateZones: 1,
                obdProtocol: 'ISO 15765-4 CAN',
                supportedPIDs: ['SPEED', 'RPM', 'ENG_TEMP', 'FUEL_LEVEL'],
                features: { engine: true, doorsLocked: true, ac: true, sunroof: true, temp: 22 }
            },
            'Verna': {
                name: 'Verna', year: 2024, type: 'ICE', seats: 5, climateZones: 1,
                obdProtocol: 'ISO 15765-4 CAN',
                supportedPIDs: ['SPEED', 'RPM', 'ENG_TEMP', 'FUEL_LEVEL'],
                features: { engine: true, doorsLocked: true, ac: true, sunroof: true, temp: 22, seatHeating: true, ventilationSeats: true }
            },
            'Tucson': {
                name: 'Tucson', year: 2024, type: 'ICE', seats: 5, climateZones: 2,
                obdProtocol: 'ISO 15765-4 CAN',
                supportedPIDs: ['SPEED', 'RPM', 'ENG_TEMP', 'FUEL_LEVEL'],
                features: { engine: true, doorsLocked: true, ac: true, sunroof: true, temp: 22, seatHeating: true, ventilationSeats: true }
            },
            'Alcazar': {
                name: 'Alcazar', year: 2024, type: 'ICE', seats: 7, climateZones: 2,
                obdProtocol: 'ISO 15765-4 CAN',
                supportedPIDs: ['SPEED', 'RPM', 'ENG_TEMP', 'FUEL_LEVEL'],
                features: { engine: true, doorsLocked: true, ac: true, sunroof: true, temp: 22, ventilationSeats: true }
            },
            'Exter': {
                name: 'Exter', year: 2024, type: 'ICE', seats: 5, climateZones: 1,
                obdProtocol: 'ISO 15765-4 CAN',
                supportedPIDs: ['SPEED', 'RPM', 'ENG_TEMP', 'FUEL_LEVEL'],
                features: { engine: true, doorsLocked: true, ac: true, sunroof: true, temp: 22 }
            }
        }
    },

    // ──────────────────────────────────────────────────────────
    // Maruti Suzuki
    // ──────────────────────────────────────────────────────────
    maruti: {
        brand: 'Maruti Suzuki',
        logo: '🇮🇳',
        color: '#0063A6',
        models: {
            'grand-vitara': {
                name: 'Grand Vitara (Hybrid)',
                year: '2022-present',
                type: 'Hybrid',
                seats: 5,
                climateZones: 1,
                supportedPIDs: ['VEHICLE_SPEED', 'ENGINE_RPM', 'COOLANT_TEMP', 'FUEL_LEVEL', 'ENGINE_LOAD'],
                features: { ac: true, sunroof: true, seatHeating: false, ventilationSeats: false, doorsLocked: true, engine: true },
                obdProtocol: 'ISO 15765-4 CAN',
            },
            swift: {
                name: 'Swift',
                year: '2017-present',
                type: 'ICE',
                seats: 5,
                climateZones: 1,
                supportedPIDs: ['VEHICLE_SPEED', 'ENGINE_RPM', 'COOLANT_TEMP', 'FUEL_LEVEL'],
                features: { ac: true, sunroof: false, seatHeating: false, ventilationSeats: false, doorsLocked: true, engine: true },
                obdProtocol: 'ISO 15765-4 CAN',
            }
        }
    },

    // ──────────────────────────────────────────────────────────
    // Generic / Other
    // ──────────────────────────────────────────────────────────
    other: {
        brand: 'Other / Generic',
        logo: '🚗',
        color: '#555555',
        models: {
            obd2: {
                name: 'OBD-II Compatible (1996+)',
                year: '1996-present',
                type: 'ICE',
                seats: 5,
                climateZones: 1,
                supportedPIDs: ['VEHICLE_SPEED', 'ENGINE_RPM', 'COOLANT_TEMP', 'THROTTLE_POS', 'FUEL_LEVEL', 'ENGINE_LOAD'],
                features: { ac: true, sunroof: false, seatHeating: false, ventilationSeats: false, doorsLocked: true, engine: true },
                obdProtocol: 'Any OBD-II',
            }
        }
    }
};

export default VEHICLE_PROFILES;
