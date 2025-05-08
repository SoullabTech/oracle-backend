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
    } catch (err) {
      console.error('Ritual save error:', err);
      alert('Failed to save ritual.');
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">🔮 Ritual Crafter</h2>

      <Input
        placeholder="Ritual Title (e.g., Water Mirror Release)"
        value={ritual.title}
        onChange={(e) => handleChange('title', e.target.value)}
      />

      <select
        value={ritual.element}
        onChange={(e) => handleChange('element', e.target.value)}
        className="border rounded p-2 w-full"
      >
        {ELEMENTS.map((el) => (
          <option key={el}>{el}</option>
        ))}
      </select>

      <Input
        placeholder="Threshold or Intention (e.g., Shadow Integration)"
        value={ritual.threshold}
        onChange={(e) => handleChange('threshold', e.target.value)}
      />

      <Input
        placeholder="Duration (e.g., 12m)"
        value={ritual.duration}
        onChange={(e) => handleChange('duration', e.target.value)}
      />

      <Textarea
        placeholder="Step-by-step Instructions"
        value={ritual.instructions}
        onChange={(e) => handleChange('instructions', e.target.value)}
        rows={6}
      />

      <Input
        placeholder="Tags (comma-separated, e.g., shadow, breathwork, full moon)"
        value={ritual.tags}
        onChange={(e) => handleChange('tags', e.target.value)}
      />

      <Button onClick={handleSave}>🕯️ Save Ritual</Button>
    </Card>
  );
}
