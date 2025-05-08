import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// File: /src/components/Sanctum/SanctumTimeline.tsx
// Layer: 🔐 Frontend — User View of Symbolic Insights & Journaled Oracle Threads
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
export default function SanctumTimeline() {
    const [entries, setEntries] = useState([]);
    useEffect(() => {
        async function fetchSanctum() {
            const res = await fetch('/api/sanctum/logs');
            const data = await res.json();
            setEntries(data);
        }
        fetchSanctum();
    }, []);
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: "\uD83D\uDD6F\uFE0F Sanctum Timeline" }), entries.map((entry, i) => (_jsxs(Card, { className: "p-4 border-l-4 shadow-sm", style: { borderColor: getColor(entry.element) }, children: [_jsx("div", { className: "text-xs text-gray-400", children: new Date(entry.createdAt).toLocaleString() }), _jsxs("div", { className: "font-semibold", children: ["\uD83D\uDD2E ", entry.symbol, " \u2014 ", entry.phase] }), _jsx("div", { className: "text-sm whitespace-pre-line", children: entry.insight }), _jsxs("div", { className: "text-sm italic text-muted-foreground", children: ["\uD83D\uDD6F\uFE0F ", entry.ritual] })] }, i)))] }));
}
function getColor(element) {
    switch (element) {
        case 'Fire': return '#f97316';
        case 'Water': return '#0ea5e9';
        case 'Earth': return '#65a30d';
        case 'Air': return '#eab308';
        case 'Aether': return '#a855f7';
        default: return '#ccc';
    }
}
