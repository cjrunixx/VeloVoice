import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import { processVoiceCommand } from './llm.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'VeloVoice Co-Pilot Brain is alive.' });
});

// Start Express Server
const server = app.listen(port, () => {
    console.log(`🧠 VeloVoice Backend listening on port ${port}`);
});

// Initialize WebSocket Server tightly coupled to Express
const wss = new WebSocketServer({ server });

// OBD-II Configuration
const POLL_INTERVAL_MS = 2000;
const REDLINE_RPM = 4000;
const LOW_BATTERY_PCT = 15;

let obdPollingSession = null;

function startOBDPolling(ws) {
    if (obdPollingSession) clearInterval(obdPollingSession);
    console.log('🔌 Starting Continuous OBD-II Polling...');

    obdPollingSession = setInterval(() => {
        if (ws.readyState !== ws.OPEN) {
            clearInterval(obdPollingSession);
            return;
        }

        ws.send(JSON.stringify({
            type: 'system_request',
            action: 'poll_obd'
        }));
    }, POLL_INTERVAL_MS);
}

// Proactive Health Monitor
function monitorVehicleHealth(ws, telemetry, personaSpeak) {
    if (ws.readyState !== ws.OPEN) return;

    if (telemetry.rpm > REDLINE_RPM) {
        ws.send(JSON.stringify({
            type: 'ai_response',
            text: personaSpeak(`engine RPM is critical at ${telemetry.rpm}. Easing off the throttle is advised to protect the motor.`),
            actions: [{ tool: 'get_vehicle_status', args: {} }]
        }));
    }

    if (telemetry.battery < LOW_BATTERY_PCT) {
        ws.send(JSON.stringify({
            type: 'ai_response',
            text: personaSpeak(`battery level is at ${telemetry.battery}%. Routing to the nearest charging station now.`),
            actions: [{ tool: 'navigate', args: { destination: 'nearest charging station' } }]
        }));
    }
}

wss.on('connection', (ws) => {
    console.log('⚡ Frontend connected to Brain via WebSocket');

    // Store persona per connection (updated when client sends it)
    let activePersona = 'Samantha';

    // Persona-aware message builder for proactive alerts
    function personaSpeak(text) {
        const intros = {
            'Samantha': ['Heads up — ', 'Just so you know — ', 'Pardon the interruption, but ', ''],
            'Jarvis': ['Alert: ', 'System notice — ', 'Attention — ', 'Data incoming: '],
            'KITT': ['Driver advisory: ', 'Safety notice — ', 'KITT reporting — ', 'Be advised — ']
        };
        const pool = intros[activePersona] || intros['Samantha'];
        const prefix = pool[Math.floor(Math.random() * pool.length)];
        return prefix + text;
    }

    startOBDPolling(ws);

    // Send initial greeting
    ws.send(JSON.stringify({
        type: 'system',
        message: 'Connected to Co-Pilot Brain'
    }));

    // --- PROACTIVE INTELLIGENCE: Low Tire Pressure Alert (15s after connect) ---
    setTimeout(() => {
        if (ws.readyState === ws.OPEN) {
            console.log('📢 Sending proactive alert: Low Tire Pressure');
            ws.send(JSON.stringify({
                type: 'ai_response',
                text: personaSpeak("your rear left tire pressure is reading lower than optimal. I recommend a quick inspection at the nearest station."),
                actions: [{ tool: 'get_vehicle_status', args: {} }]
            }));
        }
    }, 15000);

    // Dynamic Navigation Engine & Persona State
    let navigationSession = null;
    let activeLanguage = 'en-US';

    // Listen for messages from the frontend (Voice Transcripts)
    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message);
            console.log('Received from Frontend:', data);

            if (data.type === 'persona_sync') {
                // Client announcing their persona at connect time
                activePersona = data.persona || 'Samantha';
                activeLanguage = data.language || 'en-US';
                console.log(`🎭 Persona: ${activePersona} | 🌍 Lang: ${activeLanguage}`);

            } else if (data.type === 'transcript') {
                // Update persona and language for this connection if client sent one
                if (data.persona) activePersona = data.persona;
                if (data.language) activeLanguage = data.language;

                console.log(`💬 Voice Command [${activeLanguage}]: "${data.text}"`);
                const llmResult = await processVoiceCommand(data.text, activePersona, activeLanguage);

                // Start Nav Engine if 'navigate' tool was called
                if (llmResult.actions.some(a => a.tool === 'navigate')) {
                    const navAction = llmResult.actions.find(a => a.tool === 'navigate');
                    startNavigationEngine(ws, navAction.args.destination, navigationSession);
                }

                // Send response back to Frontend Over WebSocket
                ws.send(JSON.stringify({
                    type: 'ai_response',
                    text: llmResult.text,
                    actions: llmResult.actions // Array of tool calls (e.g. {tool: 'navigate', args: {destination: 'work'}})
                }));
            } else if (data.type === 'telemetry') {
                monitorVehicleHealth(ws, data.data, personaSpeak);
            }

        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    ws.on('close', () => {
        console.log('❌ Frontend disconnected');
    });
});

function startNavigationEngine(ws, destination, existingSession) {
    if (existingSession) clearInterval(existingSession);
    console.log(`🚀 Starting Navigation Engine for: ${destination}`);

    let step = 0;
    const milestones = [
        { type: 'info', text: `Routing to ${destination} complete. ETA: 14 mins.` },
        { type: 'traffic', text: "Alert: Heavy traffic ahead in 500 meters. Expected delay 4 minutes." },
        { type: 'guidance', text: "In 10 meters, take a sharp left turn toward the city center." },
        { type: 'info', text: "You have arrived at your destination." }
    ];

    const session = setInterval(() => {
        if (ws.readyState !== ws.OPEN) {
            clearInterval(session);
            return;
        }

        if (step < milestones.length) {
            const milestone = milestones[step];
            console.log(`📡 Pushing Nav Alert: ${milestone.text}`);

            ws.send(JSON.stringify({
                type: 'ai_response',
                text: milestone.text,
                actions: [{
                    tool: 'nav_update',
                    args: {
                        type: milestone.type,
                        text: milestone.text,
                        nextTurn: step === 2 ? 'Left in 10m' : null
                    }
                }]
            }));
            step++;
        } else {
            clearInterval(session);
        }
    }, 12000); // 12s per milestone for demo
}
