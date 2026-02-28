import { create } from 'zustand';
import VEHICLE_PROFILES from '../data/vehicleProfiles';

const useVehicleStore = create((set) => ({
    // UI State
    activeView: 'home',
    accentColor: '#0a84ff',
    aiPersona: 'Samantha',
    language: localStorage.getItem('vv_language') || 'en-US',
    isBooting: true,

    // 🚗 Vehicle Profile (persisted in localStorage)
    isSetupComplete: !!localStorage.getItem('vv_vehicle_brand'),
    vehicleProfile: {
        brand: localStorage.getItem('vv_vehicle_brand') || null,
        model: localStorage.getItem('vv_vehicle_model') || null,
        data: null // loaded dynamically when profile is selected
    },

    // Navigation State
    mapCenter: [77.5946, 12.9716], // Bangalore
    destination: null,
    nextStep: null,
    isNavigating: false,
    eta: null,

    // Vehicle Features (Relay/Control)
    carFeatures: {
        engine: false,
        doorsLocked: true,
        ac: false,
        sunroof: false,
        temp: 22
    },

    // Telemetry (Sensors)
    telemetry: {
        speed: 0,
        rpm: 0,
        battery: 88,
        tirePressure: { fl: 32, fr: 32, rl: 30, rr: 32 }, // Simulated low rl
        motorTemp: 45
    },

    // Media State (Bluetooth Sync)
    media: {
        track: 'VeloVoice Radio',
        artist: 'AI Discovery',
        albumArt: null,
        isPlaying: false,
        duration: 240,
        progress: 45
    },

    // Actions
    setActiveView: (view) => set({ activeView: view }),
    setAccentColor: (color) => set({ accentColor: color }),
    setAiPersona: (persona) => set({ aiPersona: persona }),
    setLanguage: (lang) => {
        localStorage.setItem('vv_language', lang);
        set({ language: lang });
    },
    setIsBooting: (isBooting) => set({ isBooting }),

    setMapCenter: (center) => set({ mapCenter: center }),
    setNavigation: (nav) => set((state) => ({ ...state, ...nav })),

    updateCarFeature: (feature, value) => set((state) => ({
        carFeatures: { ...state.carFeatures, [feature]: value }
    })),

    updateTelemetry: (data) => set((state) => ({
        telemetry: { ...state.telemetry, ...data }
    })),

    updateMedia: (data) => set((state) => ({
        media: { ...state.media, ...data }
    })),

    setVehicleProfile: (brand, model) => {
        const brandData = VEHICLE_PROFILES[brand];
        const modelData = brandData?.models?.[model];

        // Persist to localStorage for future sessions
        localStorage.setItem('vv_vehicle_brand', brand);
        localStorage.setItem('vv_vehicle_model', model);

        set({
            isSetupComplete: true,
            vehicleProfile: { brand, model, data: modelData },
            // Sync car features with what the vehicle actually supports
            carFeatures: modelData ? { ...modelData.features } : {
                engine: false, doorsLocked: true, ac: false, sunroof: false, temp: 22
            }
        });
    }
}));

export default useVehicleStore;
