/**
 * 🚗 VeloVoice Setup Wizard
 * First-launch experience: lets the user select their car brand and model.
 * Persists selection to localStorage — shown only once per device.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VEHICLE_PROFILES from '../data/vehicleProfiles';
import useVehicleStore from '../store/useVehicleStore';

const BRAND_KEYS = Object.keys(VEHICLE_PROFILES);

export default function SetupWizard() {
    const [step, setStep] = useState(1); // 1 = select brand, 2 = select model, 3 = confirm
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedModel, setSelectedModel] = useState(null);
    const { setVehicleProfile } = useVehicleStore();

    const profile = selectedBrand ? VEHICLE_PROFILES[selectedBrand] : null;
    const modelKeys = profile ? Object.keys(profile.models) : [];
    const modelData = selectedModel && profile ? profile.models[selectedModel] : null;

    const handleBrandSelect = (brandKey) => {
        setSelectedBrand(brandKey);
        setSelectedModel(null);
        setStep(2);
    };

    const handleModelSelect = (modelKey) => {
        setSelectedModel(modelKey);
        setStep(3);
    };

    const handleConfirm = () => {
        setVehicleProfile(selectedBrand, selectedModel);
    };

    const TypeBadge = ({ type }) => {
        const colors = { EV: '#34C759', Hybrid: '#FF9500', ICE: '#636366' };
        return (
            <span style={{
                background: colors[type] || '#636366',
                color: '#fff',
                fontSize: '10px',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '6px',
                letterSpacing: '1px'
            }}>
                {type}
            </span>
        );
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'radial-gradient(ellipse at 30% 50%, #0a0a20 0%, #000 70%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9998,
            padding: '32px',
            overflow: 'hidden'
        }}>
            {/* Background grid */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'linear-gradient(rgba(10,132,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(10,132,255,0.04) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                zIndex: 0
            }} />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ textAlign: 'center', marginBottom: '32px', zIndex: 1 }}
            >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏎️</div>
                <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>VeloVoice Setup</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '15px' }}>
                    {step === 1 && 'Select your car brand to get started'}
                    {step === 2 && `Select your ${profile?.brand} model`}
                    {step === 3 && 'Confirm your vehicle profile'}
                </p>

                {/* Step indicator */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '16px' }}>
                    {[1, 2, 3].map(s => (
                        <motion.div
                            key={s}
                            animate={{
                                width: s === step ? 24 : 8,
                                background: s <= step ? 'var(--accent-color)' : 'var(--surface-secondary)'
                            }}
                            transition={{ duration: 0.3 }}
                            style={{ height: '8px', borderRadius: '4px' }}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Content Panel */}
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '12px',
                            maxWidth: '720px',
                            width: '100%',
                            zIndex: 1
                        }}
                    >
                        {BRAND_KEYS.map(key => {
                            const b = VEHICLE_PROFILES[key];
                            return (
                                <motion.button
                                    key={key}
                                    onClick={() => handleBrandSelect(key)}
                                    whileHover={{ scale: 1.04, y: -2 }}
                                    whileTap={{ scale: 0.97 }}
                                    style={{
                                        background: 'var(--surface-primary)',
                                        border: `1px solid rgba(255,255,255,0.08)`,
                                        borderRadius: 'var(--border-radius-lg)',
                                        padding: '24px 16px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '10px',
                                        color: '#fff',
                                        transition: 'border-color 0.2s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = b.color}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                                >
                                    <span style={{ fontSize: '28px' }}>{b.logo}</span>
                                    <span style={{ fontSize: '13px', fontWeight: '600' }}>{b.brand}</span>
                                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                        {Object.keys(b.models).length} model{Object.keys(b.models).length > 1 ? 's' : ''}
                                    </span>
                                </motion.button>
                            );
                        })}
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '400px', zIndex: 1 }}
                    >
                        {modelKeys.map(key => {
                            const m = profile.models[key];
                            return (
                                <motion.button
                                    key={key}
                                    onClick={() => handleModelSelect(key)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{
                                        background: 'var(--surface-primary)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        borderRadius: 'var(--border-radius-md)',
                                        padding: '20px 24px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        color: '#fff',
                                        gap: '16px'
                                    }}
                                >
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ fontWeight: '700', fontSize: '17px', marginBottom: '4px' }}>
                                            {profile.brand} {m.name}
                                        </div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                            {m.year} · {m.seats} seats · {m.climateZones} climate zone{m.climateZones > 1 ? 's' : ''}
                                        </div>
                                    </div>
                                    <TypeBadge type={m.type} />
                                </motion.button>
                            );
                        })}

                        <button
                            onClick={() => setStep(1)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '14px', marginTop: '8px' }}
                        >
                            ← Back to brands
                        </button>
                    </motion.div>
                )}

                {step === 3 && modelData && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.35 }}
                        style={{
                            background: 'var(--surface-primary)',
                            borderRadius: 'var(--border-radius-xl)',
                            padding: '32px',
                            maxWidth: '440px',
                            width: '100%',
                            zIndex: 1,
                            border: `1px solid ${profile.color}44`
                        }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <div style={{ fontSize: '40px', marginBottom: '8px' }}>{profile.logo}</div>
                            <div style={{ fontSize: '22px', fontWeight: '800' }}>{profile.brand} {modelData.name}</div>
                            <div style={{ marginTop: '8px' }}><TypeBadge type={modelData.type} /></div>
                        </div>

                        {/* Profile details */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                            {[
                                ['🪑 Seats', modelData.seats],
                                ['🌡️ Climate Zones', modelData.climateZones],
                                ['📡 OBD Protocol', modelData.obdProtocol],
                                ['📟 Active PIDs', modelData.supportedPIDs.length],
                            ].map(([label, value]) => (
                                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{label}</span>
                                    <span style={{ fontWeight: '600', fontSize: '14px' }}>{value}</span>
                                </div>
                            ))}

                            {/* Supported Features */}
                            <div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Features Enabled</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {Object.entries(modelData.features)
                                        .filter(([, v]) => v === true)
                                        .map(([key]) => (
                                            <span key={key} style={{
                                                background: 'var(--surface-secondary)',
                                                padding: '4px 10px',
                                                borderRadius: '8px',
                                                fontSize: '12px',
                                                textTransform: 'capitalize'
                                            }}>
                                                {key.replace(/([A-Z])/g, ' $1')}
                                            </span>
                                        ))}
                                </div>
                            </div>
                        </div>

                        {modelData.note && (
                            <div style={{
                                background: 'rgba(255, 149, 0, 0.1)',
                                border: '1px solid rgba(255,149,0,0.3)',
                                borderRadius: 'var(--border-radius-sm)',
                                padding: '10px 14px',
                                fontSize: '12px',
                                color: '#FF9500',
                                marginBottom: '20px'
                            }}>
                                ⚠️ {modelData.note}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setStep(2)}
                                style={{ flex: 1, background: 'var(--surface-secondary)', border: 'none', borderRadius: 'var(--border-radius-md)', padding: '14px', color: '#fff', cursor: 'pointer', fontSize: '15px' }}
                            >
                                ← Change
                            </button>
                            <motion.button
                                onClick={handleConfirm}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                style={{ flex: 2, background: 'var(--accent-color)', border: 'none', borderRadius: 'var(--border-radius-md)', padding: '14px', color: '#fff', cursor: 'pointer', fontWeight: '700', fontSize: '15px' }}
                            >
                                Start VeloVoice →
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
