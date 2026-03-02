# 🏎️ VeloVoice: Premium AI Co-Pilot

VeloVoice is a state-of-the-art, proactive AI assistant designed for next-generation electric vehicles. Inspired by Apple CarPlay aesthetics, it blends real-time navigation, vehicle telemetry (OBD-II), and intelligent voice interaction into a seamless driving experience.

## ✨ Core Features
- **🧠 Proactive AI Brain**: High-fidelity conversation and tool-calling powered by Gemini.
- **🗺️ Real-Time Navigation**: Integrated MapLibre GL JS with traffic-aware routing and voice guidance.
- **🩺 OBD-II Telemetry**: Live vehicle monitoring with proactive safety alerts (RPM, Battery, Motor Temp).
- **🎙️ Hands-Free Activation**: Stable "Hey VeloVoice" wake-word detection with visual UI feedback.
- **🎵 Media Sync**: Bluetooth-synced media controller with real-time progress and phone integration.
- **🎨 Premium UX**: 60fps animations, semantic dark-mode design, and customizable AI personas.

## 🛠️ Getting Started
For detailed setup instructions and hardware list, please refer to:
👉 **[REQUIREMENTS.md](./REQUIREMENTS.md)**

## 🚀 Quick Start
1. **Setup Environment**: Add `GEMINI_API_KEY` to `backend/.env`.
2. **Launch Backend**: `cd backend && npm run dev`
3. **Launch Frontend**: `npm run dev` (from root)

## 🏗️ Architecture
- **Frontend**: React, Zustand (State Management), Framer Motion (Animations), MapLibre (GPS).
- **Backend**: Node.js, Express, WebSocket (Live Pipeline), Google GenAI (Gemini).

