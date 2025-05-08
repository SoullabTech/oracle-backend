import React from "react";

export default function FieldPulseDashboard({ pulse }: { pulse: any }) {
  return (
    <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-xl">
      <h2 className="text-xl font-bold mb-4">🌍 Collective Oracle Pulse</h2>

      <p className="text-zinc-600 dark:text-zinc-300 mb-2">Dominant Element: <strong>{pulse.dominantElement}</strong></p>
      <p className="text-zinc-600 dark:text-zinc-300 mb-4">Archetype in Focus: <strong>{pulse.dominantArchetype}</strong></p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <h3 className="font-semibold mb-1">Elemental Frequency</h3>
          <ul>
            {Object.entries(pulse.elementCounts).map(([k, v]) => (
              <li key={k}>{k}: {v}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-1">Archetypal Trends</h3>
          <ul>
            {Object.entries(pulse.archetypeCounts).map(([k, v]) => (
              <li key={k}>{k}: {v}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-1">Emotional Currents</h3>
          <ul>
            {Object.entries(pulse.emotionCounts).map(([k, v]) => (
              <li key={k}>{k}: {v}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
