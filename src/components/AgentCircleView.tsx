import React from "react";
import { Sparkles } from "lucide-react";

export default function AgentCircleView({ dialogues }: { dialogues: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
      {dialogues.map((d, i) => (
        <div key={i} className="p-4 bg-white dark:bg-zinc-800 rounded-xl shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold text-indigo-600 dark:text-indigo-300">{d.name.replace("Agent", "")}</div>
            <div className="text-sm text-zinc-400">{d.element}</div>
          </div>
          <p className="text-zinc-800 dark:text-zinc-200 whitespace-pre-line">{d.content}</p>
          <div className="mt-2 text-xs italic text-zinc-500 dark:text-zinc-400">
            Archetype: {d.archetype || "Unspecified"}
          </div>
        </div>
      ))}
    </div>
  );
}
