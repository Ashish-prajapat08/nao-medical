import React, { useState } from 'react';
import axios from 'axios';
import { X, Copy, Check, FileText, Loader2 } from 'lucide-react';

export default function SummaryGenerator({ roomId, messages, onClose }) {
    const [loading, setLoading] = useState(false);
    const [summaryData, setSummaryData] = useState(null);
    const [copied, setCopied] = useState(false);

    const generateSummary = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/summarize`, {
                messages: messages.map(m => ({
                    senderRole: m.senderRole,
                    originalText: m.originalText
                }))
            });
            setSummaryData(response.data);
        } catch (error) {
            console.error("Summary failed", error);
            alert("Failed to generate summary");
        } finally {
            setLoading(false);
        }
    };

    // Auto-generate on open if not already (optional, but convenient)
    React.useEffect(() => {
        if (!summaryData && !loading) {
            generateSummary();
        }
    }, []);

    const handleCopy = () => {
        if (!summaryData) return;
        const text = `
MEDICAL SUMMARY
Date: ${new Date().toLocaleDateString()}

SUMMARY:
${summaryData.summary}

SYMPTOMS:
- ${summaryData.symptoms?.join('\n- ') || 'None'}

DIAGNOSES:
- ${summaryData.diagnoses?.join('\n- ') || 'None'}

MEDICATIONS:
- ${summaryData.medications?.join('\n- ') || 'None'}

FOLLOW-UP:
- ${summaryData.followups?.join('\n- ') || 'None'}
    `.trim();

        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-2 text-blue-800">
                        <FileText className="w-5 h-5" />
                        <h2 className="font-bold text-lg">Medical Encouter Summary</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                            <p className="text-slate-500 font-medium">Analyzing conversation with AI...</p>
                        </div>
                    ) : summaryData ? (
                        <div className="space-y-6">

                            <section>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Clinical Narrative</h3>
                                <div className="bg-blue-50 p-4 rounded-xl text-slate-700 leading-relaxed border border-blue-100">
                                    {summaryData.summary}
                                </div>
                            </section>

                            <div className="grid md:grid-cols-2 gap-6">
                                <section>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Symptoms</h3>
                                    <ul className="list-disc list-inside space-y-1 text-slate-700">
                                        {summaryData.symptoms?.length ? summaryData.symptoms.map((s, i) => (
                                            <li key={i}>{s}</li>
                                        )) : <li className="text-slate-400 italic">No symptoms detected</li>}
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Diagnoses</h3>
                                    <ul className="list-disc list-inside space-y-1 text-slate-700">
                                        {summaryData.diagnoses?.length ? summaryData.diagnoses.map((s, i) => (
                                            <li key={i}>{s}</li>
                                        )) : <li className="text-slate-400 italic">No diagnoses detected</li>}
                                    </ul>
                                </section>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <section>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Medications</h3>
                                    <ul className="list-disc list-inside space-y-1 text-slate-700">
                                        {summaryData.medications?.length ? summaryData.medications.map((s, i) => (
                                            <li key={i}>{s}</li>
                                        )) : <li className="text-slate-400 italic">No medications detected</li>}
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Plan / Follow-up</h3>
                                    <ul className="list-disc list-inside space-y-1 text-slate-700">
                                        {summaryData.followups?.length ? summaryData.followups.map((s, i) => (
                                            <li key={i}>{s}</li>
                                        )) : <li className="text-slate-400 italic">No follow-up detected</li>}
                                    </ul>
                                </section>
                            </div>

                        </div>
                    ) : (
                        <div className="text-center text-red-500 py-10">
                            Failed to load summary. Try again.
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-600 font-medium hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
                    >
                        Close
                    </button>

                    <button
                        onClick={handleCopy}
                        disabled={!summaryData}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium flex items-center gap-2 shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? "Copied!" : "Copy Summary"}
                    </button>
                </div>

            </div>
        </div>
    );
}
