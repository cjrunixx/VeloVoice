/**
 * 🧪 UNIT TESTS — Vehicle Store (Zustand)
 * Tests centralized state management for correctness
 */
import { describe, it, expect, beforeEach } from 'vitest';

// Helper: reset store between tests
let useVehicleStore;
beforeEach(async () => {
    // Dynamic import ensures fresh module state per test
    vi.resetModules();
    const mod = await import('../store/useVehicleStore');
    useVehicleStore = mod.default;
});

describe('🚗 Vehicle Store — Car Features', () => {
    it('should start with AC off', () => {
        const { carFeatures } = useVehicleStore.getState();
        expect(carFeatures.ac).toBe(false);
    });

    it('should toggle AC on via updateCarFeature', () => {
        const { updateCarFeature } = useVehicleStore.getState();
        updateCarFeature('ac', true);
        const { carFeatures } = useVehicleStore.getState();
        expect(carFeatures.ac).toBe(true);
    });

    it('should toggle sunroof via updateCarFeature', () => {
        const { updateCarFeature } = useVehicleStore.getState();
        updateCarFeature('sunroof', true);
        const { carFeatures } = useVehicleStore.getState();
        expect(carFeatures.sunroof).toBe(true);
    });

    it('should lock doors by default', () => {
        const { carFeatures } = useVehicleStore.getState();
        expect(carFeatures.doorsLocked).toBe(true);
    });
});

describe('🗺️ Vehicle Store — Navigation', () => {
    it('should start with no active navigation', () => {
        const { isNavigating, destination } = useVehicleStore.getState();
        expect(isNavigating).toBe(false);
        expect(destination).toBeNull();
    });

    it('should set destination and navigate flag via setNavigation', () => {
        const { setNavigation } = useVehicleStore.getState();
        setNavigation({ destination: 'Airport', isNavigating: true });
        const { isNavigating, destination } = useVehicleStore.getState();
        expect(isNavigating).toBe(true);
        expect(destination).toBe('Airport');
    });
});

describe('📻 Vehicle Store — Media', () => {
    it('should start with media not playing', () => {
        const { media } = useVehicleStore.getState();
        expect(media.isPlaying).toBe(false);
    });

    it('should update media track info via updateMedia', () => {
        const { updateMedia } = useVehicleStore.getState();
        updateMedia({ track: 'Dark Side of the Moon', artist: 'Pink Floyd' });
        const { media } = useVehicleStore.getState();
        expect(media.track).toBe('Dark Side of the Moon');
        expect(media.artist).toBe('Pink Floyd');
    });
});
