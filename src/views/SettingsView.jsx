import React, { useState } from 'react';
import { User, Globe, Shield, ChevronRight, Check, Bluetooth, Activity, Car } from 'lucide-react';
import { bluetoothManager } from '../utils/BluetoothManager';
import useVehicleStore from '../store/useVehicleStore';
import VEHICLE_PROFILES from '../data/vehicleProfiles';

export default function SettingsView() {
    const {
        accentColor, setAccentColor,
        aiPersona, setAiPersona,
        language, setLanguage,
        vehicleProfile
    } = useVehicleStore();
    const [obdStatus, setObdStatus] = useState('disconnected');

    const handleChangeVehicle = () => {
        localStorage.removeItem('vv_vehicle_brand');
        localStorage.removeItem('vv_vehicle_model');
        window.location.reload(); // triggers wizard on next boot
    };

    const profileBrand = vehicleProfile?.brand ? VEHICLE_PROFILES[vehicleProfile.brand] : null;

    const colors = ['#0a84ff', '#34C759', '#FF9500', '#FF2D55', '#AF52DE', '#5AC8FA'];

    const personas = [
        { id: 'Samantha', name: 'Samantha', desc: 'Warm & Professional (Default)' },
        { id: 'Jarvis', name: 'Jarvis', desc: 'Efficient & Futuristic' },
        { id: 'KITT', name: 'KITT', desc: 'Classic & Reliable' }
    ];

    const languages = [
        { code: 'en-US', name: 'English', desc: 'US English' },
        { code: 'hi-IN', name: 'Hindi (हिन्दी)', desc: 'Indian Hindi' },
        { code: 'es-ES', name: 'Spanish (Español)', desc: 'Spain Spanish' },
        { code: 'fr-FR', name: 'French (Français)', desc: 'France French' },
        { code: 'de-DE', name: 'German (Deutsch)', desc: 'Germany German' }
    ];

    const handleConnectOBD = async () => {
        setObdStatus('connecting');
        try {
            const success = await bluetoothManager.connect();
            if (success) setObdStatus('connected');
        } catch (e) {
            setObdStatus('disconnected');
            alert("Bluetooth connection failed. Ensure your ELM327 device is nearby and discoverable.");
        }
    };

    const SettingItem = ({ icon: Icon, label, value, onClick, active, isListItem, isLast }) => (
        <div
            onClick={onClick}
            style={{
                background: isListItem ? (active ? `${accentColor}22` : 'transparent') : '#1C1C1E',
                padding: '16px 20px',
                borderRadius: isListItem ? '0' : '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'background 0.2s',
                marginBottom: isListItem ? '0' : '8px',
                border: isListItem ? 'none' : (active ? `1px solid ${accentColor}` : '1px solid #2C2C2E'),
                borderBottom: isListItem && !isLast ? '1px solid #2C2C2E' : (isListItem ? 'none' : undefined)
            }}
            onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = isListItem ? 'rgba(255,255,255,0.05)' : '#2C2C2E';
            }}
            onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = isListItem ? 'transparent' : '#1C1C1E';
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ color: accentColor }}>
                    <Icon size={22} />
                </div>
                <div>
                    <div style={{ fontSize: '17px', fontWeight: '500' }}>{label}</div>
                    {value && <div style={{ fontSize: '13px', color: '#8E8E93' }}>{value}</div>}
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {active ? <Check size={20} color={accentColor} /> : <ChevronRight size={20} color="#3A3A3C" />}
            </div>
        </div>
    );

    const DropdownSettingItem = ({ icon: Icon, label, value, options, onChange }) => {
        const [isOpen, setIsOpen] = useState(false);
        const selectedOption = options.find(o => o.value === value) || options[0];

        return (
            <div style={{
                background: '#1C1C1E',
                padding: '16px 20px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
                border: '1px solid #2C2C2E',
                position: 'relative'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ color: accentColor }}>
                        <Icon size={22} />
                    </div>
                    <div style={{ fontSize: '17px', fontWeight: '500' }}>{label}</div>
                </div>

                <div style={{ position: 'relative' }}>
                    <div
                        onClick={() => setIsOpen(!isOpen)}
                        style={{
                            background: '#2C2C2E',
                            color: '#fff',
                            border: '1px solid #3A3A3C',
                            padding: '10px 16px',
                            borderRadius: '12px',
                            fontSize: '15px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#3A3A3C'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#2C2C2E'}
                    >
                        {selectedOption.label}
                        <ChevronRight size={16} color="#8E8E93" style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                    </div>

                    {isOpen && (
                        <>
                            <div
                                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99 }}
                                onClick={() => setIsOpen(false)}
                            />
                            <div style={{
                                position: 'absolute',
                                top: 'calc(100% + 8px)',
                                right: 0,
                                width: '240px',
                                background: 'rgba(28, 28, 30, 0.85)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '16px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                overflow: 'hidden',
                                zIndex: 100,
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                {options.map((opt, i) => (
                                    <div
                                        key={opt.value}
                                        onClick={() => {
                                            onChange(opt.value);
                                            setIsOpen(false);
                                        }}
                                        style={{
                                            padding: '12px 16px',
                                            cursor: 'pointer',
                                            background: value === opt.value ? 'rgba(255,255,255,0.08)' : 'transparent',
                                            color: value === opt.value ? accentColor : '#fff',
                                            fontSize: '15px',
                                            borderBottom: i < options.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (value !== opt.value) e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                                        }}
                                        onMouseLeave={(e) => {
                                            if (value !== opt.value) e.currentTarget.style.background = 'transparent';
                                        }}
                                    >
                                        {opt.label}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '32px', overflowY: 'auto', paddingRight: '12px' }}>
            <h2 style={{ fontSize: '34px', margin: 0, fontWeight: '700' }}>Settings</h2>

            {/* Vehicle Profile Section */}
            <section>
                <div style={{ fontSize: '13px', color: '#8E8E93', textTransform: 'uppercase', marginBottom: '8px', marginLeft: '16px' }}>Vehicle Profile</div>
                <div style={{
                    background: 'var(--surface-primary)',
                    padding: '16px 20px',
                    borderRadius: 'var(--border-radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '1px solid rgba(255,255,255,0.06)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span style={{ fontSize: '28px' }}>{profileBrand?.logo || '🚗'}</span>
                        <div>
                            <div style={{ fontWeight: '600', fontSize: '16px' }}>
                                {vehicleProfile?.data
                                    ? `${profileBrand?.brand} ${vehicleProfile.data.name}`
                                    : 'No Vehicle Selected'}
                            </div>
                            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                {vehicleProfile?.data
                                    ? `${vehicleProfile.data.type} · ${vehicleProfile.data.supportedPIDs?.length} OBD PIDs active`
                                    : 'Run setup wizard to configure'}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleChangeVehicle}
                        style={{
                            background: 'var(--surface-secondary)',
                            border: 'none',
                            borderRadius: 'var(--border-radius-sm)',
                            padding: '8px 16px',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '500'
                        }}
                    >
                        Change ↗
                    </button>
                </div>
            </section>

            {/* Appearance Section */}
            <section>
                <div style={{ fontSize: '13px', color: '#8E8E93', textTransform: 'uppercase', marginBottom: '8px', marginLeft: '16px' }}>Appearance</div>
                <div style={{ background: '#1C1C1E', padding: '16px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #2C2C2E' }}>
                    <div style={{ fontSize: '17px' }}>Accent Color</div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {colors.map(color => (
                            <div
                                key={color}
                                onClick={() => setAccentColor(color)}
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: color,
                                    cursor: 'pointer',
                                    border: accentColor === color ? '3px solid #fff' : 'none',
                                    boxShadow: accentColor === color ? `0 0 10px ${color}` : 'none',
                                    transition: 'transform 0.2s'
                                }}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Language Section */}
            <section>
                <div style={{ fontSize: '13px', color: '#8E8E93', textTransform: 'uppercase', marginBottom: '8px', marginLeft: '16px' }}>Language & Region</div>
                <DropdownSettingItem
                    icon={Globe}
                    label="Language"
                    value={language}
                    onChange={setLanguage}
                    options={languages.map(l => ({ value: l.code, label: l.name }))}
                />
            </section>

            {/* AI Persona Section */}
            <section>
                <div style={{ fontSize: '13px', color: '#8E8E93', textTransform: 'uppercase', marginBottom: '8px', marginLeft: '16px' }}>AI Persona</div>
                <DropdownSettingItem
                    icon={User}
                    label="Voice Persona"
                    value={aiPersona}
                    onChange={setAiPersona}
                    options={personas.map(p => ({ value: p.id, label: p.name }))}
                />
            </section>

            {/* Car Hardware Section */}
            <section>
                <div style={{ fontSize: '13px', color: '#8E8E93', textTransform: 'uppercase', marginBottom: '8px', marginLeft: '16px' }}>Car Hardware</div>
                <SettingItem
                    icon={Bluetooth}
                    label="OBD-II Bluetooth"
                    value={obdStatus === 'connected' ? 'Connected to VeloVoice Link' : obdStatus === 'connecting' ? 'Searching...' : 'Not Connected'}
                    active={obdStatus === 'connected'}
                    onClick={handleConnectOBD}
                />
            </section>

            {/* General Section */}
            <section style={{ paddingBottom: '40px' }}>
                <div style={{ fontSize: '13px', color: '#8E8E93', textTransform: 'uppercase', marginBottom: '8px', marginLeft: '16px' }}>System</div>
                <SettingItem icon={Globe} label="Language" value="English (US)" />
                <SettingItem icon={Shield} label="Privacy & Security" />
            </section>
        </div>
    );
}
