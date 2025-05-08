import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// File: /src/components/CreatorStudio/RitualCrafter.tsx
// Layer: 🔮 Frontend — Creator Studio (Ritual Design & Publishing)
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
const ELEMENTS = ['Fire', 'Water', 'Earth', 'Air', 'Aether'];
export default function RitualCrafter() {
    const [ritual, setRitual] = useState({
        title: '',
        element: 'Water',
        threshold: 'emotional release',
        duration: '10m',
        instructions: '',
        tags: '',
    });
    const handleChange = (field, value) => {
        setRitual({ ...ritual, [field]: value });
    };
    const handleSave = async () => {
        try {
            const res = await fetch('/api/studio/rituals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ritual),
            });
            const data = await res.json();
            alert('🕯️ Ritual saved: ' + data.title);
        }
        catch (err) {
            console.error('Ritual save error:', err);
            alert('Failed to save ritual.');
        }
    };
    return (_jsxs(Card, { className: "p-6 space-y-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: "\uD83D\uDD2E Ritual Crafter" }), _jsx(Input, { placeholder: "Ritual Title (e.g., Water Mirror Release)", value: ritual.title, onChange: (e) => handleChange('title', e.target.value) }), _jsx("select", { value: ritual.element, onChange: (e) => handleChange('element', e.target.value), className: "border rounded p-2 w-full", children: ELEMENTS.map((el) => (_jsx("option", { children: el }, el))) }), _jsx(Input, { placeholder: "Threshold or Intention (e.g., Shadow Integration)", value: ritual.threshold, onChange: (e) => handleChange('threshold', e.target.value) }), _jsx(Input, { placeholder: "Duration (e.g., 12m)", value: ritual.duration, onChange: (e) => handleChange('duration', e.target.value) }), _jsx(Textarea, { placeholder: "Step-by-step Instructions", value: ritual.instructions, onChange: (e) => handleChange('instructions', e.target.value), rows: 6 }), _jsx(Input, { placeholder: "Tags (comma-separated, e.g., shadow, breathwork, full moon)", value: ritual.tags, onChange: (e) => handleChange('tags', e.target.value) }), _jsx(Button, { onClick: handleSave, children: "\uD83D\uDD6F\uFE0F Save Ritual" })] }));
}
