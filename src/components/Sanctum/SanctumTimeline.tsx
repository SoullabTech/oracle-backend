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

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">🕯️ Sanctum Timeline</h2>
      {entries.map((entry, i) => (
        <Card key={i} className="p-4 border-l-4 shadow-sm" style={{ borderColor: getColor(entry.element) }}>
          <div className="text-xs text-gray-400">{new Date(entry.createdAt).toLocaleString()}</div>
          <div className="font-semibold">🔮 {entry.symbol} — {entry.phase}</div>
          <div className="text-sm whitespace-pre-line">{entry.insight}</div>
          <div className="text-sm italic text-muted-foreground">🕯️ {entry.ritual}</div>
        </Card>
      ))}
    </div>
  );
}

function getColor(element: string) {
  switch (element) {
    case 'Fire': return '#f97316';
    case 'Water': return '#0ea5e9';
    case 'Earth': return '#65a30d';
    case 'Air': return '#eab308';
    case 'Aether': return '#a855f7';
    default: return '#ccc';
  }
}
