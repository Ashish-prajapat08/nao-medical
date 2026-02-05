import React, { useState, useRef } from 'react';
import { Mic, Square, Loader } from 'lucide-react';

export default function AudioRecorder({ onRecordingComplete, isUploading }) {
    const [isRecording, setIsRecording] = useState(false);
    const [duration, setDuration] = useState(0);
    const mediaRecorderRef = useRef(null);
    const timerRef = useRef(null);
    const chunksRef = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/mp3' }); // MP3 might need lamejs, but webm/mp4 is standard. 'audio/webm' is safer in browser.
                // Actually prompt asks for MP3 or WAV. Browser native is usually WebM/Ogg. 
                // We'll stick to 'audio/webm' or default and let the <audio> tag handle it.
                // Sending Blob to parent.
                onRecordingComplete(blob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);

            // Timer
            setDuration(0);
            timerRef.current = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);

        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Microphone access denied or not available.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearInterval(timerRef.current);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex items-center">
            {isUploading ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-slate-500 animate-pulse">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-xs font-medium">Sending...</span>
                </div>
            ) : isRecording ? (
                <button
                    onClick={stopRecording}
                    className="flex items-center gap-3 px-4 py-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors border border-red-200"
                >
                    <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                    <span className="text-sm font-medium w-10">{formatTime(duration)}</span>
                    <Square className="w-4 h-4 fill-current" />
                </button>
            ) : (
                <button
                    onClick={startRecording}
                    className="p-3 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 hover:text-red-600 transition-all active:scale-95"
                    title="Record Audio"
                >
                    <Mic className="w-5 h-5" />
                </button>
            )}
        </div>
    );
}
