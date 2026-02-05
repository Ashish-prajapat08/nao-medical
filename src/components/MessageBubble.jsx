import React, { useState, useRef } from 'react';
import { Play, Pause, User, Stethoscope } from 'lucide-react';

export default function MessageBubble({ message }) {
    const isDoctor = message.senderRole === 'DOCTOR';
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const toggleAudio = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleAudioEnded = () => {
        setIsPlaying(false);
    };

    return (
        <div id={`msg-${message.id}`} className={`flex w-full mb-4 ${isDoctor ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] md:max-w-[70%] ${isDoctor ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>

                {/* Avatar Icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isDoctor ? 'bg-blue-600' : 'bg-green-600'
                    } text-white shadow-sm`}>
                    {isDoctor ? <Stethoscope size={16} /> : <User size={16} />}
                </div>

                {/* Bubble */}
                <div className={`p-4 rounded-2xl shadow-sm ${isDoctor
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-green-600 text-white rounded-bl-none'
                    }`}>
                    {/* Audio Player if present */}
                    {message.audioUrl && (
                        <div className="mb-3 bg-white/20 p-2 rounded-lg flex items-center gap-3 backdrop-blur-sm">
                            <button
                                onClick={toggleAudio}
                                className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-blue-600 hover:scale-105 transition-transform"
                            >
                                {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                            </button>
                            <div className="text-xs font-medium opacity-90">Audio Message</div>
                            <audio
                                ref={audioRef}
                                src={message.audioUrl}
                                onEnded={handleAudioEnded}
                                className="hidden"
                            />
                        </div>
                    )}

                    {/* Text Content */}
                    <div className="space-y-1.5">
                        {/* Original */}
                        <p className="text-sm leading-relaxed font-normal opacity-90">
                            {message.originalText}
                        </p>

                        {/* Translated - Divider */}
                        {message.translatedText && (
                            <>
                                <div className="h-px bg-white/20 my-2" />
                                <p className="text-base font-semibold leading-relaxed">
                                    {message.translatedText}
                                </p>
                            </>
                        )}
                    </div>

                    {/* Metadata */}
                    <div className={`mt-2 flex items-center gap-2 text-[10px] opacity-70 ${isDoctor ? 'justify-end' : 'justify-start'}`}>
                        <span className="uppercase tracking-wider font-bold">{message.senderRole}</span>
                        <span>•</span>
                        <span>{new Date(message.timestamp?.seconds * 1000 || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
