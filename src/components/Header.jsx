// this is header component
import React from 'react';
import { Stethoscope, FileText, PlusCircle, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header({ role, language, otherUserLanguage, onNewChat, onGenerateSummary, onToggleSidebar }) {
    const navigate = useNavigate();

    const handleExit = () => {
        navigate('/');
    };

    return (
        <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm flex-shrink-0">
            <div className="flex items-center gap-3">
                {/* Mobile Menu */}
                <button
                    className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-lg"
                    onClick={onToggleSidebar}
                >
                    <Menu className="w-6 h-6" />
                </button>

                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 p-2 rounded-lg hidden sm:block">
                        <Stethoscope className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-slate-800 text-lg leading-tight hidden sm:block">NAO Medical</h1>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                                <span className={`px-2 py-0.5 rounded-full font-medium ${role === 'DOCTOR' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                    {role}
                                </span>
                                <span>•</span>
                                <span className="uppercase font-medium" translate="no">{language} ➔ {otherUserLanguage || '...'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
                <button
                    onClick={onGenerateSummary}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-xs md:text-sm"
                >
                    <FileText className="w-4 h-4" />
                    <span className="hidden sm:inline">Summary</span>
                </button>

                <button
                    onClick={onNewChat}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-xs md:text-sm"
                >
                    <PlusCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">New Chat</span>
                </button>
            </div>
        </header>
    );
}
