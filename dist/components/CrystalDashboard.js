import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// File: /src/components/CrystalDashboard.tsx
// Layer: 💠 Frontend — Visual Symbolic State of the Crystal Field
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
export default function CrystalDashboard() {
    const [crystal, setCrystal] = useState(null);
    useEffect(() => {
        async function fetchState() {
            try {
                const res = await fetch('/api/crystal/state');
                const data = await res.json();
                setCrystal(data);
            }
            catch (err) {
                console.error('Failed to load crystal state:', err);
            }
        }
        fetchState();
    }, []);
    if (!crystal)
        return _jsx("div", { className: "text-center py-10", children: "Loading crystal field\u2026" });
    return (_jsxs(Card, { className: "p-6 space-y-4", children: [_jsx("h2", { className: "text-2xl font-bold text-center", children: "\uD83D\uDCA0 Crystal Field Dashboard" }), _jsxs("div", { className: "text-center text-muted-foreground", children: ["Pulse taken: ", new Date(crystal.timestamp).toLocaleString()] }), _jsxs("div", { className: "text-lg", children: [_jsx("strong", { children: "\uD83D\uDD2E Dominant Phase:" }), " ", crystal.dominantPhase] }), _jsxs("div", { children: [_jsx("strong", { children: "\uD83D\uDCC8 Top Symbols:" }), _jsx("ul", { className: "list-disc pl-5 mt-2", children: crystal.topSymbols.map(({ key, count }) => (_jsxs("li", { children: [key, " \u2014 ", count, " entries"] }, key))) })] }), _jsxs("div", { className: "text-sm text-muted-foreground", children: ["Total Entries in Field: ", crystal.totalEntries] })] }));
}
