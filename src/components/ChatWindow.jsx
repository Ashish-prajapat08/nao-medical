import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

export default function ChatWindow({ messages, loading }) {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
            <div className="max-w-4xl mx-auto space-y-6">
                {messages.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50 space-y-4">
                        <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
                            <span className="text-3xl">👋</span>
                        </div>
                        <p className="text-slate-500 font-medium">Start the conversation...</p>
                    </div>
                )}

                {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}

                {loading && (
                    <div className="flex justify-center py-4">
                        <div className="animate-bounce bg-slate-200 w-2 h-2 rounded-full mx-1"></div>
                        <div className="animate-bounce bg-slate-200 w-2 h-2 rounded-full mx-1 delay-75"></div>
                        <div className="animate-bounce bg-slate-200 w-2 h-2 rounded-full mx-1 delay-150"></div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>
        </div>
    );
}
