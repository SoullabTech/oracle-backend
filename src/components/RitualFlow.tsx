import React from "react";

export default function RitualFlow({ ritual }: { ritual: any }) {
  return (
    <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-2">🕊️ Personalized Ritual</h2>
      <p className="mb-4 text-zinc-500 dark:text-zinc-300">Element: <strong>{ritual.element}</strong> • Archetype: <strong>{ritual.archetype}</strong></p>

      <ul className="space-y-2 text-zinc-700 dark:text-zinc-100">
        <li>🫁 <strong>Breath:</strong> {ritual.breath}</li>
        <li>📓 <strong>Journal:</strong> {ritual.journal}</li>
        <li>💃 <strong>Movement:</strong> {ritual.movement}</li>
        <li>🎵 <strong>Sound:</strong> {ritual.sound}</li>
        <li>🕯️ <strong>Closing:</strong> {ritual.suggestion}</li>
      </ul>
    </div>
  );
}
