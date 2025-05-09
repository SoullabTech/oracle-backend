// src/components/OracleInput.tsx
import { useState } from 'react';

export default function OracleInput() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: query, storeToMemory: true, accessLevel: 'public' }),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      setResponse(data.content);
      setQuery('');
    } catch (err: any) {
      console.error(err);
      setError('Failed to get oracle response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Ask the Oracle..."
        className="w-full h-32 border rounded p-2 focus:outline-none focus:ring"
        required
      />
      <button
        type="submit"
        disabled={loading || !query.trim()}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Asking...' : 'Ask Oracle'}
      </button>
      {error && <p className="text-red-600">{error}</p>}
      {response && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Oracle Says:</h3>
          <p>{response}</p>
        </div>
      )}
    </form>
  );
}
