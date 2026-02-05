import React, { useState } from 'react';
import { Send } from 'lucide-react';
import AudioRecorder from './AudioRecorder';

export default function InputArea({ onSendMessage, onSendAudio, isSending, placeholder }) {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSendMessage(text);
        setText('');
    };

    return (
        <div className="bg-white border-t border-slate-200 p-4 sticky bottom-0 z-10 safe-area-bottom">
            <div className="max-w-4xl mx-auto flex items-end gap-3">

                {/* Audio Recorder */}
                <AudioRecorder onRecordingComplete={onSendAudio} isUploading={isSending} />

                {/* Text Input */}
                <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={placeholder || "Type a message..."}
                        className="flex-1 bg-slate-100 border-0 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                        disabled={isSending}
                    />
                    <button
                        type="submit"
                        disabled={!text.trim() || isSending}
                        className={`p-3 rounded-full flex items-center justify-center transition-all ${text.trim() && !isSending
                                ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:scale-105'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        <Send className="w-5 h-5 ml-0.5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
