'use client'

import { useState } from 'react'

interface Props {
  onSuccess: () => void
}

export default function CreateEntryForm({ onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState<string|null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/constellation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ /* your fields here */ })
      })
      if (!res.ok) throw new Error(await res.text())
      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded space-y-3">
      <h2 className="text-xl font-semibold">New Entry</h2>
      {/* replace with real inputs */}
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Creating…' : 'Create Entry'}
      </button>
      {error && <p className="text-red-500">Error: {error}</p>}
    </form>
  )
}
