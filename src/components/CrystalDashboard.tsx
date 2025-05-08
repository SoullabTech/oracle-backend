// File: /src/components/CrystalDashboard.tsx
// Layer: 💠 Frontend — Visual Symbolic State of the Crystal Field

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function CrystalDashboard() {
  const [crystal, setCrystal] = useState(null);

  useEffect(() => {
    async function fetchState() {
      try {
        const res = await fetch('/api/crystal/state');
        const data = await res.json();
        setCrystal(data);
      } catch (err) {
        console.error('Failed to load crystal state:', err);
      }
    }
    fetchState();
  }, []);

  if (!crystal) return <div className="text-center py-10">Loading crystal field…</div>;

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-2xl font-bold text-center">💠 Crystal Field Dashboard</h2>

      <div className="text-center text-muted-foreground">
        Pulse taken: {new Date(crystal.timestamp).toLocaleString()}
      </div>

      <div className="text-lg">
        <strong>🔮 Dominant Phase:</strong> {crystal.dominantPhase}
      </div>

      <div>
        <strong>📈 Top Symbols:</strong>
        <ul className="list-disc pl-5 mt-2">
          {crystal.topSymbols.map(({ key, count }) => (
            <li key={key}>{key} — {count} entries</li>
          ))}
        </ul>
      </div>

      <div className="text-sm text-muted-foreground">
        Total Entries in Field: {crystal.totalEntries}
      </div>
    </Card>
  );
}
