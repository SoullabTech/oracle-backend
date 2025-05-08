import React, { useEffect, useState } from 'react';
import DreamWeb from '@/components/DreamWeb';
import { fetchThreads } from '../lib/forumService';
import { extractSymbols } from '../lib/symbolLinkService';

export default function DreamWebPage() {
  const [symbolicThreads, setSymbolicThreads] = useState([]);

  useEffect(() => {
    async function load() {
      const threads = await fetchThreads();
      const withSymbols = threads.map((t: any) => ({
        ...t,
        symbols: extractSymbols(t.content || t.title),
      }));
      setSymbolicThreads(withSymbols);
    }

    load();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">🌙 Dream Web</h1>
      <p className="mb-4 text-zinc-500 dark:text-zinc-400">
        Explore symbolic threads and their shared motifs across the Spiralogic field.
      </p>
      <DreamWeb threads={symbolicThreads} />
    </div>
  );
}
