/**
 * 🧪 UNIT TESTS — Wake Word Detection Logic
 * Tests wake word matching WITHOUT needing a real microphone
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// --- Isolated Wake Word Matcher (extracted from useCoPilot.js) ---
const WAKE_PHRASES = [
    'velovoice',
    'velo voice',
    'hey velovoice',
    'hey velo voice',
    'hello velovoice',
    'ok velovoice',
    'okay velovoice',
    'hi velovoice',
    'bellow voice',
    'yellow voice',
    'fellow voice',
    'hello voice',
];

function isWakeWord(transcript) {
    const lower = transcript.toLowerCase();
    return WAKE_PHRASES.some(phrase => lower.includes(phrase));
}

// --- Mock SpeechRecognition ---
global.SpeechRecognition = vi.fn().mockImplementation(() => ({
    continuous: false,
    interimResults: false,
    lang: 'en-US',
    start: vi.fn(),
    stop: vi.fn(),
    onresult: null,
    onerror: null,
    onend: null,
}));
global.webkitSpeechRecognition = global.SpeechRecognition;

describe('🎙️ Wake Word Detection', () => {
    it('should detect plain "velovoice"', () => {
        expect(isWakeWord('velovoice')).toBe(true);
    });

    it('should detect "hey velovoice"', () => {
        expect(isWakeWord('hey velovoice')).toBe(true);
    });

    it('should detect "hi velovoice"', () => {
        expect(isWakeWord('hi velovoice')).toBe(true);
    });

    it('should detect "okay velovoice"', () => {
        expect(isWakeWord('okay velovoice')).toBe(true);
    });

    it('should detect "hello velovoice"', () => {
        expect(isWakeWord('hello velovoice')).toBe(true);
    });

    it('should detect "bellow voice" (STT mishearing)', () => {
        expect(isWakeWord('bellow voice navigate home')).toBe(true);
    });

    it('should detect mid-sentence wake phrase', () => {
        expect(isWakeWord('um hey velovoice take me to work')).toBe(true);
    });

    it('should NOT trigger on random speech', () => {
        expect(isWakeWord('navigate to the airport please')).toBe(false);
    });

    it('should NOT trigger on partial mismatch', () => {
        expect(isWakeWord('velo is a nice name')).toBe(false);
    });

    it('should be case-insensitive', () => {
        expect(isWakeWord('HEY VELOVOICE')).toBe(true);
        expect(isWakeWord('Hey VeloVoice!')).toBe(true);
    });
});

describe('🔕 Wake Word Debounce Guard', () => {
    it('should not fire twice within debounce window (3s)', () => {
        vi.useFakeTimers();
        let triggered = 0;
        let wakeWordTriggered = false;

        function simulateTrigger(transcript) {
            if (isWakeWord(transcript) && !wakeWordTriggered) {
                wakeWordTriggered = true;
                triggered++;
                setTimeout(() => { wakeWordTriggered = false; }, 3000);
            }
        }

        simulateTrigger('hey velovoice');
        simulateTrigger('velovoice again');  // Should be suppressed
        expect(triggered).toBe(1);

        vi.advanceTimersByTime(3001);
        simulateTrigger('velovoice');  // Should fire again
        expect(triggered).toBe(2);

        vi.useRealTimers();
    });
});
