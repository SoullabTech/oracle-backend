import React from "react";
import { PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";

const PHASES = ["Initiation", "Grounding", "Collaboration", "Transformation", "Completion"];

export default function HealingMap({ data }: { data: any[] }) {
  const phaseData = PHASES.map((phase) => {
    const items = data.filter((d) => d.phase === phase);
    const avgDepth = items.length ? items.reduce((a, b) => a + b.depth, 0) / items.length : 0;
    return { phase, depth: avgDepth };
  });

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-2">🧭 Spiral Healing Map</h2>
      <p className="text-zinc-600 dark:text-zinc-400 mb-4">
        Visualize your symbolic journey across the Spiralogic phases.
      </p>

      <ResponsiveContainer width="100%" height={400}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={phaseData}>
          <PolarAngleAxis dataKey="phase" />
          <PolarRadiusAxis angle={30} domain={[0, 10]} />
          <Radar name="Depth" dataKey="depth" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
