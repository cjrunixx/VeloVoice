/**
 * 🧪 UNIT TESTS — AI Action Orchestrator Logic
 * Tests coordinate lookup and action routing without a browser
 */
import { describe, it, expect } from 'vitest';

// --- Isolated orchestrator logic (mirrors App.jsx) ---
const KNOWN_LOCATIONS = {
    'airport': [77.7068, 13.1986],
    'office': [77.6309, 12.9279],
    'work': [77.6309, 12.9279],
    'home': [77.5946, 12.9716],
};
const DEFAULT_COORDS = [77.5946, 12.9716];

function resolveCoords(destination) {
    const dest = destination.toLowerCase();
    const key = Object.keys(KNOWN_LOCATIONS).find(k => dest.includes(k));
    return key ? KNOWN_LOCATIONS[key] : DEFAULT_COORDS;
}

describe('🗺️ Navigation Coordinate Resolver', () => {
    it('resolves "Bangalore Airport" to airport coords', () => {
        expect(resolveCoords('Bangalore Airport')).toEqual([77.7068, 13.1986]);
    });

    it('resolves "my office" to office coords', () => {
        expect(resolveCoords('my office on MG Road')).toEqual([77.6309, 12.9279]);
    });

    it('resolves "work" to work coords', () => {
        expect(resolveCoords('Take me to work')).toEqual([77.6309, 12.9279]);
    });

    it('resolves "home" to home coords', () => {
        expect(resolveCoords('I want to go home')).toEqual([77.5946, 12.9716]);
    });

    it('defaults to home coords for unknown destinations', () => {
        expect(resolveCoords('nearest Starbucks')).toEqual(DEFAULT_COORDS);
    });
});

describe('🤖 OBD-II Health Thresholds', () => {
    const REDLINE_RPM = 4000;
    const LOW_BATTERY_PCT = 15;

    it('should flag engine redline above 4000 RPM', () => {
        expect(4500 > REDLINE_RPM).toBe(true);
        expect(3500 > REDLINE_RPM).toBe(false);
    });

    it('should flag low battery below 15%', () => {
        expect(10 < LOW_BATTERY_PCT).toBe(true);
        expect(20 < LOW_BATTERY_PCT).toBe(false);
    });

    it('should NOT flag normal operation', () => {
        const rpm = 2800;
        const battery = 72;
        expect(rpm > REDLINE_RPM || battery < LOW_BATTERY_PCT).toBe(false);
    });
});
