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
    } catch (err) {
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

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-xl font-bold">📁 Prompt Library</h2>

      <Input
        placeholder="Prompt Title"
        value={promptSet.title}
        onChange={(e) => handleChange('title', e.target.value)}
      />

      <Input
        placeholder="Persona (e.g., Mystic, Builder)"
        value={promptSet.persona}
        onChange={(e) => handleChange('persona', e.target.value)}
      />

      <Input
        placeholder="Phase (e.g., Water2, Fire1)"
        value={promptSet.phase}
        onChange={(e) => handleChange('phase', e.target.value)}
      />

      <Textarea
        placeholder="Prompt Template (e.g., 'As a {persona} of {phase}, I suggest...')"
        value={promptSet.content}
        onChange={(e) => handleChange('content', e.target.value)}
        rows={4}
      />

      <Button onClick={savePrompt}>💾 Save Prompt</Button>

      <div className="pt-6">
        <h3 className="text-md font-semibold">📜 Existing Prompts</h3>
        <ul className="list-disc pl-5">
          {library.map((p, i) => (
            <li key={i} className="text-sm">{p.title} — {p.persona} / {p.phase}</li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
