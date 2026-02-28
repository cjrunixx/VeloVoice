# 📑 VeloVoice System Requirements

To ensure the VeloVoice AI Co-Pilot runs at "Industry Grade" performance, the following environment is required:

## 💻 Software Prerequisites
- **Node.js**: version 18.x or higher (LTS recommended)
- **npm**: version 9.x or higher
- **Modern Web Browser**: Google Chrome or Microsoft Edge (Required for **Web Speech API** and **Web Bluetooth** support).
- **Git**: For version control.

## 🔑 API Dependencies
- **Google Gemini API Key**: Required for the AI Brain.
  - Place this in `backend/.env` as `GEMINI_API_KEY=your_key_here`.
- **MapLibre GL JS**: The project uses the standard MapLibre demographic tiles; no key is required for basic demo, but Mapbox/Maptiler keys can be added for high-res maps.

## 🏎️ Hardware Requirements (Optional for Simulation)
- **Bluetooth Adapter**: Required on the host PC to use the OBD-II connection feature.
- **OBD-II ELM327 Adapter**: For real-world vehicle telemetry integration.
- **Microphone & Speakers**: High-quality hardware recommended for clear AI conversation.

## 🚀 Installation & Launch
### 1. Backend (The Brain)
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend (The Dashboard)
```bash
npm install
npm run dev
```

## 🏗️ Project Architecture
The project follows a clean separation of concerns:
```text
VeloVoice/
├── backend/                # Node.js/Express WebSocket Server
│   ├── .env                # API Keys
│   ├── index.js            # WebSocket & HTTP Server
│   └── llm.js              # Gemini AI Integration & Prompts
├── src/                    # React Frontend
│   ├── components/         # Reusable UI (Orb, Map, Media)
│   ├── views/              # Main Screens (Dashboard, Phone, Controls)
│   ├── store/              # Zustand Global State
│   ├── hooks/              # Custom React Hooks (Speech, Bluetooth)
│   ├── data/               # Static Data (Vehicle Profiles)
│   └── utils/              # Helper Logic
├── package.json            # Frontend Dependencies
└── REQUIREMENTS.md         # Setup & Architecture Guide
```
### 1. Backend (The Brain)
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend (The Dashboard)
```bash
npm install
npm run dev
```

### 🌐 Default Access
- **Frontend**: http://localhost:5173
- **Backend WS**: ws://localhost:3001
