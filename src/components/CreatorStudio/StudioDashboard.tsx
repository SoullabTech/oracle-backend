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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">📊 Creator Studio Dashboard</h2>

      <Card className="p-4">
        <h3 className="text-lg font-semibold">🧬 Agents</h3>
        <ul className="text-sm list-disc pl-5">
          {agents.map((a, i) => (
            <li key={i}>{a.name} — {a.element}, {a.tone}</li>
          ))}
        </ul>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold">🔮 Rituals</h3>
        <ul className="text-sm list-disc pl-5">
          {rituals.map((r, i) => (
            <li key={i}>{r.title} — {r.element}, {r.threshold}</li>
          ))}
        </ul>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold">📁 Prompts</h3>
        <ul className="text-sm list-disc pl-5">
          {prompts.map((p, i) => (
            <li key={i}>{p.title} — {p.persona} / {p.phase}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
