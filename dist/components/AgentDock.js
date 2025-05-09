import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
const agents = [
    { name: 'ShadowAgent', route: '/shadow' },
    { name: 'DreamAgent', route: '/dream' },
    { name: 'GaiaAgent', route: '/gaia' },
    { name: 'AstrologyAgent', route: '/astro' },
    { name: 'PTSDAgent', route: '/ptsd' }
];
export default function AgentDock() {
    return (_jsxs("div", { className: "p-4 bg-zinc-100 rounded shadow space-y-2", children: [_jsx("h2", { className: "text-lg font-semibold", children: "\uD83E\uDDD9 Agent Dock" }), _jsx("ul", { className: "space-y-1", children: agents.map((agent) => (_jsx("li", { children: _jsxs(Link, { to: agent.route, className: "text-indigo-700 hover:underline", children: ["\uD83D\uDD39 ", agent.name] }) }, agent.name))) })] }));
}
