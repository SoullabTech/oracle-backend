import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
const PHASES = ["Initiation", "Grounding", "Collaboration", "Transformation", "Completion"];
export default function HealingMap({ data }) {
    const phaseData = PHASES.map((phase) => {
        const items = data.filter((d) => d.phase === phase);
        const avgDepth = items.length ? items.reduce((a, b) => a + b.depth, 0) / items.length : 0;
        return { phase, depth: avgDepth };
    });
    return (_jsxs("div", { className: "p-6", children: [_jsx("h2", { className: "text-xl font-bold mb-2", children: "\uD83E\uDDED Spiral Healing Map" }), _jsx("p", { className: "text-zinc-600 dark:text-zinc-400 mb-4", children: "Visualize your symbolic journey across the Spiralogic phases." }), _jsx(ResponsiveContainer, { width: "100%", height: 400, children: _jsxs(RadarChart, { cx: "50%", cy: "50%", outerRadius: "80%", data: phaseData, children: [_jsx(PolarAngleAxis, { dataKey: "phase" }), _jsx(PolarRadiusAxis, { angle: 30, domain: [0, 10] }), _jsx(Radar, { name: "Depth", dataKey: "depth", stroke: "#6366f1", fill: "#6366f1", fillOpacity: 0.6 }), _jsx(Tooltip, {})] }) })] }));
}
