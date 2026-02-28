import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NavigationBar from './components/NavigationBar';
import DashboardView from './views/DashboardView';
import ControlsView from './views/ControlsView';
import SettingsView from './views/SettingsView';
import PhoneView from './views/PhoneView';
import VehicleStatusView from './views/VehicleStatusView';
import StartupView from './views/StartupView';
import SetupWizard from './views/SetupWizard';
import Orb from './components/Orb';
import { useCoPilot } from './hooks/useCoPilot';

import useVehicleStore from './store/useVehicleStore';

export default function App() {
    // Industrial State Store
    const {
        isBooting, setIsBooting,
        activeView, setActiveView,
        accentColor,
        aiPersona,
        language,
        mapCenter, setMapCenter,
        setNavigation,
        carFeatures, updateCarFeature,
        telemetry,
        media, updateMedia,
        isSetupComplete
    } = useVehicleStore();

    // Connect to the Co-Pilot Backend
    const { status: copilotStatus, toggleListening, actions, clearActions, send } = useCoPilot(aiPersona, language);

    // --- 🎯 AI ACTION ORCHESTRATOR ---
    // Decodes co-pilot tool calls into frontend state transformations
    React.useEffect(() => {
        if (actions.length === 0) return;

        actions.forEach(action => {
            console.log(`🤖 Orchestrating: ${action.tool}`, action.args);

            switch (action.tool) {
                case 'navigate': {
                    const dest = action.args.destination.toLowerCase();
                    const locations = {
                        'airport': [77.7068, 13.1986],
                        'office': [77.6309, 12.9279],
                        'work': [77.6309, 12.9279],
                        'home': [77.5946, 12.9716]
                    };

                    const coords = locations[Object.keys(locations).find(k => dest.includes(k))] || [77.5946, 12.9716];

                    setMapCenter(coords);
                    setNavigation({ destination: action.args.destination, isNavigating: true });
                    setActiveView('home');
                    break;
                }

                case 'control_car': {
                    const { feature, action: stateAction } = action.args;
                    const valueMap = {
                        'on': true, 'off': false,
                        'open': true, 'close': false,
                        'lock': true, 'unlock': false
                    };

                    let finalValue = valueMap[stateAction];
                    if (feature === 'doors') finalValue = (stateAction === 'lock' || stateAction === 'close');

                    updateCarFeature(feature, finalValue);
                    setActiveView('controls');
                    break;
                }

                case 'nav_update': {
                    setNavigation({
                        nextStep: action.args.nextTurn,
                        lastAlert: action.args.text,
                        alertType: action.args.type
                    });
                    setActiveView('home');
                    break;
                }

                case 'call_contact':
                    setActiveView('phone');
                    break;

                case 'get_vehicle_status':
                    setActiveView('status');
                    break;

                default:
                    console.warn(`⚠️ Unknown AI tool: ${action.tool}`);
            }
        });

        clearActions();
    }, [actions, clearActions, setMapCenter, setNavigation, updateCarFeature, setActiveView]);

    // Handle Accent Theme
    React.useEffect(() => {
        document.documentElement.style.setProperty('--accent-color', accentColor);
        document.documentElement.style.setProperty(
            '--accent-color-glow',
            `color-mix(in srgb, ${accentColor} 40%, transparent)`
        );
    }, [accentColor]);

    // Telemetry Bridge: Respond to backend polling requests
    React.useEffect(() => {
        const handleSyncRequest = () => {
            console.log('📤 Syncing Telemetry to Backend');
            send({
                type: 'telemetry',
                data: telemetry
            });
        };
        window.addEventListener('request_telemetry_sync', handleSyncRequest);
        return () => window.removeEventListener('request_telemetry_sync', handleSyncRequest);
    }, [telemetry, send]);

    // Media Progress Simulator
    React.useEffect(() => {
        if (!media.isPlaying) return;
        const interval = setInterval(() => {
            if (media.progress < media.duration) {
                updateMedia({ progress: media.progress + 1 });
            } else {
                updateMedia({ progress: 0, isPlaying: false });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [media.isPlaying, media.progress, media.duration]);

    return (
        <>
            <AnimatePresence>
                {isBooting && <StartupView onFinish={() => setIsBooting(false)} />}
            </AnimatePresence>

            {/* Setup Wizard — shown after boot if first launch */}
            <AnimatePresence>
                {!isBooting && !isSetupComplete && <SetupWizard />}
            </AnimatePresence>

            <div className="app-container">
                {/* Left Edge CarPlay Dock */}
                <NavigationBar />

                {/* Main Content Area */}
                <main style={{
                    flex: 1,
                    position: 'relative',
                    padding: '16px 24px 16px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeView}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                style={{ height: '100%', width: '100%' }}
                            >
                                {activeView === 'home' && <DashboardView />}
                                {activeView === 'controls' && <ControlsView />}
                                {activeView === 'settings' && <SettingsView />}
                                {activeView === 'phone' && <PhoneView />}
                                {activeView === 'status' && <VehicleStatusView />}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <Orb
                        state={copilotStatus === 'disconnected' ? 'idle' : copilotStatus === 'connected' ? 'idle' : copilotStatus}
                        onClick={toggleListening}
                    />

                </main>
            </div>
        </>
    );
}
