import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, User, ArrowRight } from 'lucide-react';

const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
];

export default function Home() {
    const [role, setRole] = useState(null);
    const [language, setLanguage] = useState('en');
    const navigate = useNavigate();

    useEffect(() => {
        // Load saved preferences
        const savedRole = localStorage.getItem('userRole');
        const savedLang = localStorage.getItem('userLanguage');
        if (savedRole) setRole(savedRole);
        if (savedLang) setLanguage(savedLang);
    }, []);

    const handleStart = () => {
        if (!role) return;
        localStorage.setItem('userRole', role);
        localStorage.setItem('userLanguage', language);
        const newRoomId = crypto.randomUUID();
        navigate(`/chat/${newRoomId}`);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-8">

                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <Stethoscope className="w-5 h-5 text-white" />
                    </div>
                </div>

                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-slate-800">NAO Medical</h1>
                    <p className="text-slate-500">Welcome to AI Medical Consultation</p>
                </div>

                {/* Role Selection */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-slate-700">Select Your Role</label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setRole('DOCTOR')}
                            className={`p-6 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${role === 'DOCTOR'
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-slate-200 hover:border-blue-300 text-slate-600'
                                }`}
                        >
                            <Stethoscope className="w-8 h-8" />
                            <span className="font-semibold">Doctor</span>
                        </button>

                        <button
                            onClick={() => setRole('PATIENT')}
                            className={`p-6 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${role === 'PATIENT'
                                ? 'border-green-600 bg-green-50 text-green-700'
                                : 'border-slate-200 hover:border-green-300 text-slate-600'
                                }`}
                        >
                            <User className="w-8 h-8" />
                            <span className="font-semibold">Patient</span>
                        </button>
                    </div>
                </div>

                {/* Language Selection */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Preferred Language</label>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full p-3 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        translate="no"
                    >
                        {LANGUAGES.map((lang) => (
                            <option key={lang.code} value={lang.code}>
                                {lang.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Start Button */}
                <button
                    onClick={handleStart}
                    disabled={!role}
                    className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all ${role
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg transform hover:-translate-y-0.5'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                >
                    <span>Start Conversation</span>
                    <ArrowRight className="w-5 h-5" />
                </button>

            </div>

            <p className="mt-8 text-center text-slate-400 text-sm">
                Secure • Encrypted • HIPAA Compliant
            </p>
        </div>
    );
}
