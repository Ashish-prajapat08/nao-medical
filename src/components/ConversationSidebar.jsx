import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { MessageSquare, Clock, ArrowRight, Stethoscope } from 'lucide-react';
import SearchBar from './SearchBar';

export default function ConversationSidebar({
    currentRoomId,
    onSelectRoom,
    messages = [],
    isOpen,
    onClose
}) {
    const [conversations, setConversations] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    // Fetch Conversation List
    useEffect(() => {
        const q = query(
            collection(db, 'conversations'),
            orderBy('lastActive', 'desc'),
            limit(20)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const convs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setConversations(convs);
        });

        return () => unsubscribe();
    }, []);

    // Handle Search
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const lowerQ = searchQuery.toLowerCase();
        const hits = messages.filter((m, idx) => {
            const original = m.originalText?.toLowerCase() || '';
            const translated = m.translatedText?.toLowerCase() || '';
            return original.includes(lowerQ) || translated.includes(lowerQ);
        }).map(m => {
            const index = messages.findIndex(x => x.id === m.id);
            return { ...m, index };
        });
        setSearchResults(hits);
    }, [searchQuery, messages]);

    const formatDate = (ts) => {
        if (!ts) return '';
        return new Date(ts.seconds * 1000).toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    const handleSearchResultClick = (msgId) => {
        const el = document.getElementById(`msg-${msgId}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Highlight effect?
            el.classList.add('ring-2', 'ring-yellow-400');
            setTimeout(() => el.classList.remove('ring-2', 'ring-yellow-400'), 2000);
        }
        if (window.innerWidth < 768) {
            onClose(); // Close sidebar on mobile
        }
    };

    return (
        <aside className={`
      fixed inset-y-0 left-0 z-20 w-80 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      md:relative md:translate-x-0
    `}>
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <h2 className="font-bold text-slate-700 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Conversations
                    </h2>
                    <button onClick={onClose} className="md:hidden p-1 text-slate-400">
                        <ArrowRight className="w-5 h-5 rotate-180" />
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-slate-100">
                    <SearchBar
                        onSearch={setSearchQuery}
                        onClear={() => setSearchQuery('')}
                        isActive={!!searchQuery}
                    />
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {searchQuery ? (
                        <div className="p-2 space-y-2">
                            <h3 className="px-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Search Results ({searchResults.length})
                            </h3>
                            {searchResults.length === 0 ? (
                                <p className="text-center text-slate-400 text-sm py-4">No matches found.</p>
                            ) : (
                                searchResults.map((hit) => (
                                    <div
                                        key={hit.id}
                                        onClick={() => handleSearchResultClick(hit.id)}
                                        className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-sm cursor-pointer hover:bg-yellow-100 transition-colors"
                                    >
                                        <div className="font-bold text-yellow-800 text-xs mb-1 uppercase">{hit.senderRole}</div>
                                        <div className="text-slate-700 line-clamp-2" dangerouslySetInnerHTML={{
                                            __html: hit.originalText?.replace(new RegExp(`(${searchQuery})`, 'gi'), '<mark>$1</mark>')
                                        }} />
                                        <div className="text-slate-500 text-xs mt-1 text-right">
                                            {new Date(hit.timestamp?.seconds * 1000).toLocaleTimeString()}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        // Conversation List
                        <div className="p-2 space-y-1">
                            {conversations.map(conv => (
                                <button
                                    key={conv.id}
                                    onClick={() => onSelectRoom(conv.id)}
                                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 ${conv.id === currentRoomId
                                        ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-100'
                                        : 'hover:bg-slate-50 border-transparent border'
                                        }`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                        <Stethoscope className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-slate-800 truncate">
                                            {conv.conversationName || `Consultation ${conv.id.slice(0, 4)}`}
                                        </div>
                                        <div className="text-xs text-slate-500 flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                            <span>Active {formatDate(conv.lastActive)}</span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
