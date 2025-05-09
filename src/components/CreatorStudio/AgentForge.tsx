// File: /src/components/CreatorStudio/AgentForge.tsx
// Layer: 🧬 Frontend — Creator Studio (Symbolic Agent Builder)

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
    } catch (err) {
      console.error('Agent save failed:', err);
      alert('Failed to save agent.');
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">🧬 Agent Forge</h2>

      <Input
        placeholder="Agent Name (e.g., Vision Seer)"
        value={agent.name}
        onChange={(e) => handleChange('name', e.target.value)}
      />

      <select
        value={agent.element}
        onChange={(e) => handleChange('element', e.target.value)}
        className="border rounded p-2 w-full"
      >
        {ELEMENTS.map((el) => (
          <option key={el}>{el}</option>
        ))}
      </select>

      <select
        value={agent.tone}
        onChange={(e) => handleChange('tone', e.target.value)}
        className="border rounded p-2 w-full"
      >
        {TONES.map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>

      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Start Phase"
          value={agent.phaseStart}
          onChange={(e) => handleChange('phaseStart', parseInt(e.target.value))}
        />
        <Input
          type="number"
          placeholder="End Phase"
          value={agent.phaseEnd}
          onChange={(e) => handleChange('phaseEnd', parseInt(e.target.value))}
        />
      </div>

      <Textarea
        placeholder="Guidance Prompt Template (e.g., 'As a {tone} of {element}, my advice is...')"
        value={agent.promptTemplate}
        onChange={(e) => handleChange('promptTemplate', e.target.value)}
      />

      <Input
        placeholder="Voice Provider (e.g., ElevenLabs ID)"
        value={agent.voiceProvider}
        onChange={(e) => handleChange('voiceProvider', e.target.value)}
      />

      <Button onClick={handleSave}>⚙️ Save Symbolic Agent</Button>
    </Card>
  );
}
