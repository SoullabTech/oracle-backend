// src/components/MemoryList.tsx
import { useEffect, useState } from 'react';

interface Memory {
  id: string;
  input: string;
  insight: string;
  created_at: string;
}

export default function MemoryList() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const res = await fetch('/api/oracle/memory', { credentials: 'include' });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        setMemories(data);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load memories');
      } finally {
        setLoading(false);
      }
    };
    fetchMemories();
  }, []);

  if (loading) return <p>Loading insights…</p>;
  if (error)   return <p className="text-red-600">{error}</p>;

  if (memories.length === 0) {
    return <p className="text-gray-600">No insights saved yet.</p>;
  }

  return (
    <ul className="space-y-4">
      {memories.map(mem => (
        <li key={mem.id} className="p-4 border rounded bg-white">
          <p className="text-sm text-gray-500">{new Date(mem.created_at).toLocaleString()}</p>
          <p className="mt-1"><strong>Q:</strong> {mem.input}</p>
          <p className="mt-1"><strong>A:</strong> {mem.insight}</p>
        </li>
      ))}
    </ul>
  );
}
