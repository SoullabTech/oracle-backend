import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// File: /src/components/CreatorStudio/PromptLibrary.tsx
// Layer: 📁 Frontend — Prompt Manager for Agents, Phases, and Personas
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
export default function PromptLibrary() {
    const [promptSet, setPromptSet] = useState({
        title: '',
        persona: 'Mystic',
        phase: 'Water2',
        content: '',
    });
    const [library, setLibrary] = useState([]);
    const handleChange = (field, value) => {
        setPromptSet({ ...promptSet, [field]: value });
    };
    const savePrompt = async () => {
        try {
            const res = await fetch('/api/studio/prompts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(promptSet),
            });
            const data = await res.json();
            alert('🧠 Prompt saved: ' + data.title);
        }
        catch (err) {
            console.error('Prompt save error:', err);
            alert('Failed to save prompt.');
        }
    };
    const fetchPrompts = async () => {
        const res = await fetch('/api/studio/prompts');
        const data = await res.json();
        setLibrary(data);
    };
    useEffect(() => {
        fetchPrompts();
    }, []);
    return (_jsxs(Card, { className: "p-6 space-y-6", children: [_jsx("h2", { className: "text-xl font-bold", children: "\uD83D\uDCC1 Prompt Library" }), _jsx(Input, { placeholder: "Prompt Title", value: promptSet.title, onChange: (e) => handleChange('title', e.target.value) }), _jsx(Input, { placeholder: "Persona (e.g., Mystic, Builder)", value: promptSet.persona, onChange: (e) => handleChange('persona', e.target.value) }), _jsx(Input, { placeholder: "Phase (e.g., Water2, Fire1)", value: promptSet.phase, onChange: (e) => handleChange('phase', e.target.value) }), _jsx(Textarea, { placeholder: "Prompt Template (e.g., 'As a {persona} of {phase}, I suggest...')", value: promptSet.content, onChange: (e) => handleChange('content', e.target.value), rows: 4 }), _jsx(Button, { onClick: savePrompt, children: "\uD83D\uDCBE Save Prompt" }), _jsxs("div", { className: "pt-6", children: [_jsx("h3", { className: "text-md font-semibold", children: "\uD83D\uDCDC Existing Prompts" }), _jsx("ul", { className: "list-disc pl-5", children: library.map((p, i) => (_jsxs("li", { className: "text-sm", children: [p.title, " \u2014 ", p.persona, " / ", p.phase] }, i))) })] })] }));
}
