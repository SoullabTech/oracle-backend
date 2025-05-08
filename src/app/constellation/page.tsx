// src/app/constellation/page.tsx
'use client'

import { useEffect, useState } from 'react'

interface ConstellationEntry {
  id: string
  created_at: string
  // …other fields
}

export default function ConstellationPage() {
  const [entries, setEntries] = useState<ConstellationEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    fetch('/api/constellation')
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || `HTTP ${res.status}`)
        }
        return res.json() as Promise<ConstellationEntry[]>
      })
      .then((data) => {
        if (isMounted) {
          setEntries(data)
        }
      })
      .catch((err: any) => {
        if (isMounted) {
          setError(err.message || 'Unknown error')
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>
  }

  if (loading) {
    return <div className="p-6">Loading…</div>
  }

  if (entries.length === 0) {
    return <div className="p-6">No constellation entries found.</div>
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Constellation Entries</h1>
      <ul className="list-disc pl-5">
        {entries.map((e) => (
          <li key={e.id}>
            <strong>ID:</strong> {e.id} {' '}
            <span className="text-sm text-gray-600">
              ({new Date(e.created_at).toLocaleString()})
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
