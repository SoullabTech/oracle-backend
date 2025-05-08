// src/app/page.tsx
'use client'

import { useState, useEffect, FormEvent } from 'react'

export default function HomePage() {
  const [entries, setEntries] = useState<{ id: string; created_at: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newContent, setNewContent] = useState('')

  useEffect(() => {
    fetch('/api/constellation')
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`)
        return res.json()
      })
      .then((data) => setEntries(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      const res = await fetch('/api/constellation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ /* put your entry fields here, e.g.: */ content: newContent })
      })
      if (!res.ok) throw new Error(`Status ${res.status}`)
      const created = await res.json()
      setEntries((prev) => [created, ...prev])
      setNewContent('')
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Constellation Entries</h1>

      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          className="w-full border rounded p-2"
          placeholder="New entry content…"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Entry
        </button>
      </form>

      {loading && <p>Loading…</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      <ul className="space-y-4">
        {entries.map((e) => (
          <li key={e.id} className="border p-4 rounded bg-white">
            <p>ID: {e.id}</p>
            <p>Created: {new Date(e.created_at).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
