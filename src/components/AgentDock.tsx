// src/components/AgentDock.tsx

import React from 'react';
import { Link } from 'react-router-dom';

const agents = [
  { name: 'ShadowAgent', route: '/shadow' },
  { name: 'DreamAgent', route: '/dream' },
  { name: 'GaiaAgent', route: '/gaia' },
  { name: 'AstrologyAgent', route: '/astro' },
  { name: 'PTSDAgent', route: '/ptsd' }
];

export default function AgentDock() {
  return (
    <div className="p-4 bg-zinc-100 rounded shadow space-y-2">
      <h2 className="text-lg font-semibold">🧙 Agent Dock</h2>
      <ul className="space-y-1">
        {agents.map((agent) => (
          <li key={agent.name}>
            <Link
              to={agent.route}
              className="text-indigo-700 hover:underline"
            >
              🔹 {agent.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
