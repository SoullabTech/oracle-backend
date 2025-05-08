import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/MemoryList.tsx
import { useEffect, useState } from 'react';
export default function MemoryList() {
    const [memories, setMemories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchMemories = async () => {
            try {
                const res = await fetch('/api/oracle/memory', { credentials: 'include' });
                if (!res.ok)
                    throw new Error(`Status ${res.status}`);
                const data = await res.json();
                setMemories(data);
            }
            catch (err) {
                console.error(err);
                setError('Failed to load memories');
            }
            finally {
                setLoading(false);
            }
        };
        fetchMemories();
    }, []);
    if (loading)
        return _jsx("p", { children: "Loading insights\u2026" });
    if (error)
        return _jsx("p", { className: "text-red-600", children: error });
    if (memories.length === 0) {
        return _jsx("p", { className: "text-gray-600", children: "No insights saved yet." });
    }
    return (_jsx("ul", { className: "space-y-4", children: memories.map(mem => (_jsxs("li", { className: "p-4 border rounded bg-white", children: [_jsx("p", { className: "text-sm text-gray-500", children: new Date(mem.created_at).toLocaleString() }), _jsxs("p", { className: "mt-1", children: [_jsx("strong", { children: "Q:" }), " ", mem.input] }), _jsxs("p", { className: "mt-1", children: [_jsx("strong", { children: "A:" }), " ", mem.insight] })] }, mem.id))) }));
}
