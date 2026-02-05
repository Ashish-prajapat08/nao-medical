import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import axios from 'axios';
import { db, storage } from '../utils/firebase';

import Header from '../components/Header';
import ChatWindow from '../components/ChatWindow';
import InputArea from '../components/InputArea';
import SummaryGenerator from '../components/SummaryGenerator';
import ConversationSidebar from '../components/ConversationSidebar';

export default function Chat() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [role] = useState(localStorage.getItem('userRole') || 'DOCTOR');
    const [language] = useState(localStorage.getItem('userLanguage') || 'en');
    const [isSending, setIsSending] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [otherUserLanguage, setOtherUserLanguage] = useState('en');

    // Listener for other user's language
    useEffect(() => {
        if (!roomId) return;

        const conversationRef = doc(db, 'conversations', roomId);
        const unsubscribe = onSnapshot(conversationRef, (snapshot) => {
            const data = snapshot.data();
            if (data) {
                const targetLang = role === 'DOCTOR'
                    ? data.patientLanguage
                    : data.doctorLanguage;
                // If the other person hasn't set a language yet, 
                // we'll wait for it or use a safer 'auto' or 'en' fallback
                // Removed the hardcoded 'hi'/'en' fallback that was confusing tests
                setOtherUserLanguage(targetLang || 'en');
                console.log(`Target language updated to: ${targetLang || 'en'}`);
            }
        });

        return () => unsubscribe();
    }, [roomId, role]);

    // Setup Listener
    useEffect(() => {
        if (!roomId) {
            // If no ID, create one instantly or go home. 
            // For UX, go to specific "Wait" or just create new.
            // Assuming Home handles generation usually.
            return;
        }

        // Upsert Conversation & Language Preference
        const now = new Date();
        const conversationName = `Consultation - ${now.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })}`;

        setDoc(doc(db, 'conversations', roomId), {
            lastActive: serverTimestamp(),
            conversationName: conversationName,
            [`${role.toLowerCase()}Language`]: language || 'en'
        }, { merge: true }).catch(console.error);

        const q = query(
            collection(db, 'conversations', roomId, 'messages'),
            orderBy('timestamp', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(msgs);
            setLoading(false);
            setIsSending(false); // Reset sending state on load/update
        });

        return () => {
            unsubscribe();
            setIsSending(false); // Reset sending state on cleanup
        };
    }, [roomId, role, language]);

    const handleSendMessage = async (text) => {
        if (!roomId) {
            alert("Please wait for the chat room to load before sending messages.");
            return;
        }

        setIsSending(true);
        try {
            // Ensure language has a value
            const userLanguage = language || 'en';

            // Determine target language dynamically from the conversation document
            const targetLang = otherUserLanguage;


            // 1. Translate
            let translatedText = '';
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/translate`, {
                    text,
                    sourceLanguage: userLanguage,
                    targetLanguage: targetLang
                });
                translatedText = response.data.translatedText;
            } catch (err) {
                console.error("Translation API failed, falling back to original", err);
                translatedText = "[Translation Failed]";
            }

            // 2. Save
            await addDoc(collection(db, 'conversations', roomId, 'messages'), {
                senderRole: role,
                originalText: text,
                translatedText: translatedText,
                language: userLanguage,
                timestamp: serverTimestamp(),
                type: 'text'
            });

            // Update Last Active
            setDoc(doc(db, 'conversations', roomId), {
                lastActive: serverTimestamp()
            }, { merge: true });

        } catch (error) {
            console.error("Sending failed", error);
            alert("Failed to send message: " + error.message);
        } finally {
            setIsSending(false);
        }
    };

    const handleSendAudio = async (audioBlob) => {
        if (!roomId) {
            alert("Please wait for the chat room to load before sending audio.");
            return;
        }

        setIsSending(true);

        // Add a safety timeout (15s to be safe for transcription + translation)
        const timeoutId = setTimeout(() => {
            if (isSending) {
                setIsSending(false);
                alert("Audio upload timed out. Please try again.");
            }
        }, 5000);

        try {
            // 1. Upload to Storage
            const audioRef = ref(storage, `audio/${roomId}/${Date.now()}.webm`);
            const snapshot = await uploadBytes(audioRef, audioBlob);
            const url = await getDownloadURL(snapshot.ref);

            // 2. Transcribe
            let transcribedText = "Audio Message";
            try {
                const formData = new FormData();
                formData.append('audio', audioBlob, 'recording.webm');
                const transcribeRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/transcribe`, formData);
                transcribedText = transcribeRes.data.text;
            } catch (err) {
                console.error("Transcription failed", err);
            }

            // 3. Translate the transcription
            let translatedText = "";
            if (transcribedText && transcribedText !== "Audio Message") {
                try {
                    const translateRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/translate`, {
                        text: transcribedText,
                        sourceLanguage: language,
                        targetLanguage: otherUserLanguage
                    });
                    translatedText = translateRes.data.translatedText;
                } catch (err) {
                    console.error("Translation of audio failed", err);
                }
            }

            // 4. Save to Firestore
            await addDoc(collection(db, 'conversations', roomId, 'messages'), {
                senderRole: role,
                audioUrl: url,
                originalText: transcribedText,
                translatedText: translatedText,
                language: language,
                timestamp: serverTimestamp(),
                type: 'audio'
            });

        } catch (error) {
            console.error("Audio processing failed", error);
            alert("Audio processing failed: " + error.message);
        } finally {
            clearTimeout(timeoutId);
            setIsSending(false);
        }
    };

    const startNewChat = () => {
        const newId = crypto.randomUUID();
        navigate(`/chat/${newId}`);
        setIsSidebarOpen(false); // Close on mobile
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
            <Header
                role={role}
                language={language}
                otherUserLanguage={otherUserLanguage}
                onNewChat={startNewChat}
                onGenerateSummary={() => setShowSummary(true)}
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <div className="flex flex-1 overflow-hidden relative">

                <ConversationSidebar
                    currentRoomId={roomId}
                    onSelectRoom={(id) => {
                        navigate(`/chat/${id}`);
                        setIsSidebarOpen(false);
                    }}
                    messages={messages} // Pass messages for local search context
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />

                {/* Backdrop for mobile sidebar */}
                {isSidebarOpen && (
                    <div
                        className="absolute inset-0 bg-black/50 z-10 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                <div className="flex-1 flex flex-col relative w-full min-w-0">
                    {/* Room Banner */}
                    <div className="bg-yellow-50 text-yellow-800 px-4 py-1 text-xs text-center border-b border-yellow-100 flex-shrink-0">
                        Room ID: <span className="font-mono font-bold select-all">{roomId}</span>
                    </div>

                    <ChatWindow messages={messages} loading={loading} />

                    <InputArea
                        onSendMessage={handleSendMessage}
                        onSendAudio={handleSendAudio}
                        isSending={isSending}
                        placeholder={`Type in ${language}...`}
                    />
                </div>
            </div>

            {showSummary && (
                <SummaryGenerator
                    roomId={roomId}
                    messages={messages}
                    onClose={() => setShowSummary(false)}
                />
            )}
        </div>
    );
}
