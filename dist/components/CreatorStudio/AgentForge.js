import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// File: /src/components/CreatorStudio/AgentForge.tsx
// Layer: 🧬 Frontend — Creator Studio (Symbolic Agent Builder)
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
const ELEMENTS = ['Fire', 'Water', 'Earth', 'Air', 'Aether'];
const TONES = ['Sage', 'Mystic', 'Healer', 'Playful', 'Shadow'];
export default function AgentForge() {
    const [agent, setAgent] = useState({
        name: '',
        element: 'Fire',
        tone: 'Sage',
        phaseStart: 1,
        phaseEnd: 3,
        promptTemplate: '',
        voiceProvider: '',
    });
    const handleChange = (field, value) => {
        setAgent({ ...agent, [field]: value });
    };
    const handleSave = async () => {
        try {
            const res = await fetch('/api/studio/agents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(agent),
            });
            const data = await res.json();
            alert('✅ Agent created: ' + data.name);
        }
        catch (err) {
            console.error('Agent save failed:', err);
            alert('Failed to save agent.');
        }
    };
    return (_jsxs(Card, { className: "p-6 space-y-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: "\uD83E\uDDEC Agent Forge" }), _jsx(Input, { placeholder: "Agent Name (e.g., Vision Seer)", value: agent.name, onChange: (e) => handleChange('name', e.target.value) }), _jsx("select", { value: agent.element, onChange: (e) => handleChange('element', e.target.value), className: "border rounded p-2 w-full", children: ELEMENTS.map((el) => (_jsx("option", { children: el }, el))) }), _jsx("select", { value: agent.tone, onChange: (e) => handleChange('tone', e.target.value), className: "border rounded p-2 w-full", children: TONES.map((t) => (_jsx("option", { children: t }, t))) }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Input, { type: "number", placeholder: "Start Phase", value: agent.phaseStart, onChange: (e) => handleChange('phaseStart', parseInt(e.target.value)) }), _jsx(Input, { type: "number", placeholder: "End Phase", value: agent.phaseEnd, onChange: (e) => handleChange('phaseEnd', parseInt(e.target.value)) })] }), _jsx(Textarea, { placeholder: "Guidance Prompt Template (e.g., 'As a {tone} of {element}, my advice is...')", value: agent.promptTemplate, onChange: (e) => handleChange('promptTemplate', e.target.value) }), _jsx(Input, { placeholder: "Voice Provider (e.g., ElevenLabs ID)", value: agent.voiceProvider, onChange: (e) => handleChange('voiceProvider', e.target.value) }), _jsx(Button, { onClick: handleSave, children: "\u2699\uFE0F Save Symbolic Agent" })] }));
}
