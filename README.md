# NAO Medical - Doctor-Patient Translation Web App

## Overview
A real-time translation application designed to bridge the communication gap between healthcare professionals and patients who speak different languages. The app provides instant bidirectional translation, audio recording, conversation logging, and AI-powered medical summarization.

### Main Entry Points
- **Frontend**: `src/main.jsx` (Mounts the React application)
- **Backend**: `server/index.js` (Express server handling AI requests via OpenAI)
- **Firebase**: `src/utils/firebase.js` (Configuration and initialization)

### Folder Structure
```text
mediwebapp/
├── server/
│   └── index.js          # Node/Express backend (AI Proxy)
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── AudioRecorder.jsx
│   │   ├── ChatWindow.jsx
│   │   ├── SearchBar.jsx
│   │   └── ... 
│   ├── pages/            # Application views (Home, Chat)
│   ├── utils/            # Firebase and API configuration
│   ├── App.jsx           # Main React component & Routing
│   └── main.jsx          # Frontend entry point
├── public/               # Static assets
├── .env                  # Environment variables
└── tailwind.config.js    # Styling configuration
```

## Features Implemented
- ✅ **Secure Authentication**: Full Login/Signup flow using Firebase Auth.
- ✅ **Real-time Translation**: Automatic bidirectional translation using OpenAI GPT-3.5.
- ✅ **Dynamic Language Detection**: Translations targeted specifically to the recipient's chosen language.
- ✅ **Voice Transcription**: Spoken messages are transcribed and translated using **OpenAI Whisper**.
- ✅ **Role-Based Interface**: Distinct UI layouts and themes for Doctors and Patients.
- ✅ **Audio Support**: Record, send, and play audio messages with high-quality playback.
- ✅ **Smart Search**: Contextual search across original and translated text history.
- ✅ **Medical Summarization**: structured AI summaries (Symptoms, Diagnoses, Medications, Follow-ups).
- ✅ **Persistence**: All data stored securely in Firebase Firestore.

## Tech Stack
- **Frontend**: React 18 (Vite), Tailwind CSS, Lucide React, Axios
- **Backend**: Node.js/Express
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage (for Audio files)
- **AI**: OpenAI GPT-3.5-turbo (Text) & Whisper-1 (Audio Transcription)

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd mediwebapp
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
    VITE_FIREBASE_API_KEY=your_firebase_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    OPENAI_API_KEY=your_openai_key
    VITE_API_URL=http://localhost:3000
   ```

4. **Start the Development Server**
   Start the Backend:
   ```bash
   node server/index.js
   ```
   Start the Frontend (in a new terminal):
   ```bash
   npm run dev
   ```

5. **Access the App**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## How to Use
1. **Landing**: Select your Role (Doctor or Patient) and preferred Language.
2. **Chat**: 
   - Type messages or use the **Mic** button to record.
   - Wait for the real-time translation to appear on the recipient's screen.
   - Share the **Room ID** (top banner) to invite the other participant.
3. **Search**: Use the sidebar search to find specific medical mentions in history.
4. **Summary**: Click "Summary" at any time to generate a clinical snapshot.

## Live Demo
[Link to Deployed App]

## Known Limitations & Trade-offs
- **Backend Hosting**: The current setup assumes a local Node.js backend. For production, the backend should be deployed to a service like Render or Heroku.
- **Audio Cleanup**: Audio recordings are uploaded to Firebase Storage but currently lack an automated TTL (Time To Live) cleanup process.

## Future Improvements
- **HIPAA Compliance Encryption**: Implementing end-to-end encryption for all message payloads at the application level.
- **Video Consultation**: Integrating WebRTC (e.g., via Daily.co or Twilio) for integrated video/audio calls alongside the chat.
- **ICD-10 Coding**: Enhancing the summarization feature to automatically Map diagnoses to ICD-10 medical codes.
- **Integration with EHR**: Building FHIR-compliant connectors to push conversation summaries directly into patient electronic health records.
- **Offline Support**: Implementing PWA capabilities with IndexedDB to allow viewing conversation history without an active internet connection.
