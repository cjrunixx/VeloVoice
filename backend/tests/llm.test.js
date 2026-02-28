/**
 * 🧪 BACKEND UNIT TESTS — LLM Tool Parser & OBD Health Monitor
 * Tests backend logic in isolation without making real API calls.
 * Run with: npm test (in /backend)
 */

// --- Mock LLM response parser ---
function parseLLMResponse(raw) {
    try {
        const json = typeof raw === 'string' ? JSON.parse(raw) : raw;
        return {
            text: json.text || '',
            actions: Array.isArray(json.actions) ? json.actions : []
        };
    } catch {
        return { text: raw, actions: [] };
    }
}

// --- OBD health monitor logic ---
const REDLINE_RPM = 4000;
const LOW_BATTERY_PCT = 15;

function checkVehicleHealth(telemetry) {
    const alerts = [];
    if (telemetry.rpm > REDLINE_RPM) {
        alerts.push({ type: 'redline', message: 'Engine RPM critical' });
    }
    if (telemetry.battery < LOW_BATTERY_PCT) {
        alerts.push({ type: 'battery', message: 'Battery critically low' });
    }
    return alerts;
}

// -----------------------------------------------------------------
// TESTS
// -----------------------------------------------------------------
describe('🧩 LLM Response Parser', () => {
    test('should parse valid JSON with text and actions', () => {
        const raw = JSON.stringify({
            text: 'Navigating to the airport.',
            actions: [{ tool: 'navigate', args: { destination: 'airport' } }]
        });
        const result = parseLLMResponse(raw);
        expect(result.text).toBe('Navigating to the airport.');
        expect(result.actions).toHaveLength(1);
        expect(result.actions[0].tool).toBe('navigate');
    });

    test('should handle response with no actions', () => {
        const raw = JSON.stringify({ text: 'The weather is great today.', actions: [] });
        const result = parseLLMResponse(raw);
        expect(result.actions).toHaveLength(0);
    });

    test('should fallback gracefully on malformed JSON', () => {
        const result = parseLLMResponse('This is not JSON');
        expect(result.text).toBe('This is not JSON');
        expect(result.actions).toHaveLength(0);
    });

    test('should handle multiple actions', () => {
        const raw = JSON.stringify({
            text: 'Enabling AC and starting navigation.',
            actions: [
                { tool: 'control_car', args: { feature: 'ac', action: 'on' } },
                { tool: 'navigate', args: { destination: 'home' } }
            ]
        });
        const result = parseLLMResponse(raw);
        expect(result.actions).toHaveLength(2);
    });
});

describe('🚗 OBD-II Health Monitor', () => {
    test('should return empty alerts for normal telemetry', () => {
        const alerts = checkVehicleHealth({ rpm: 2500, battery: 72 });
        expect(alerts).toHaveLength(0);
    });

    test('should alert on engine redline', () => {
        const alerts = checkVehicleHealth({ rpm: 5000, battery: 72 });
        expect(alerts.some(a => a.type === 'redline')).toBe(true);
    });

    test('should alert on low battery', () => {
        const alerts = checkVehicleHealth({ rpm: 2500, battery: 8 });
        expect(alerts.some(a => a.type === 'battery')).toBe(true);
    });

    test('should alert on both issues simultaneously', () => {
        const alerts = checkVehicleHealth({ rpm: 6000, battery: 5 });
        expect(alerts).toHaveLength(2);
    });

    test('should not alert at exact boundary values', () => {
        // 4000 RPM and 15% battery are AT (not over/under) the threshold
        const alerts = checkVehicleHealth({ rpm: 4000, battery: 15 });
        expect(alerts).toHaveLength(0);
    });
});
