import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ onSearch, onClear, isActive }) {
    const [query, setQuery] = useState('');

    const handleChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        if (!val) {
            onClear();
        } else {
            onSearch(val);
        }
    };

    const handleClear = () => {
        setQuery('');
        onClear();
    };

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Search conversation..."
                className={`w-full bg-slate-100 border-0 rounded-lg pl-9 pr-8 py-2 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none ${isActive ? 'ring-2 ring-blue-500 bg-white' : ''}`}
            />
            {query && (
                <button
                    onClick={handleClear}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                    <X className="w-3 h-3" />
                </button>
            )}
        </div>
    );
}
