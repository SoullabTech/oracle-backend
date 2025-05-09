import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// File: /src/components/CreatorStudio/StudioDashboard.tsx
// Layer: 📊 Frontend — Overview of Created Agents, Rituals, and Prompts
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
export default function StudioDashboard() {
    const [agents, setAgents] = useState([]);
    const [rituals, setRituals] = useState([]);
    const [prompts, setPrompts] = useState([]);
    useEffect(() => {
        async function fetchAll() {
            const a = await fetch('/api/studio/agents').then((res) => res.json());
            const r = await fetch('/api/studio/rituals').then((res) => res.json());
            const p = await fetch('/api/studio/prompts').then((res) => res.json());
            setAgents(a);
            setRituals(r);
            setPrompts(p);
        }
        fetchAll();
    }, []);
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("h2", { className: "text-2xl font-bold", children: "\uD83D\uDCCA Creator Studio Dashboard" }), _jsxs(Card, { className: "p-4", children: [_jsx("h3", { className: "text-lg font-semibold", children: "\uD83E\uDDEC Agents" }), _jsx("ul", { className: "text-sm list-disc pl-5", children: agents.map((a, i) => (_jsxs("li", { children: [a.name, " \u2014 ", a.element, ", ", a.tone] }, i))) })] }), _jsxs(Card, { className: "p-4", children: [_jsx("h3", { className: "text-lg font-semibold", children: "\uD83D\uDD2E Rituals" }), _jsx("ul", { className: "text-sm list-disc pl-5", children: rituals.map((r, i) => (_jsxs("li", { children: [r.title, " \u2014 ", r.element, ", ", r.threshold] }, i))) })] }), _jsxs(Card, { className: "p-4", children: [_jsx("h3", { className: "text-lg font-semibold", children: "\uD83D\uDCC1 Prompts" }), _jsx("ul", { className: "text-sm list-disc pl-5", children: prompts.map((p, i) => (_jsxs("li", { children: [p.title, " \u2014 ", p.persona, " / ", p.phase] }, i))) })] })] }));
}
