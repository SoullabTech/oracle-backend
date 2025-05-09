// src/app/api/constellation/route.ts
import { NextRequest, NextResponse } from 'next/server'
import {
  buildConstellationMap,
  createConstellationEntry
} from '@/services/constellationService'

export async function GET(_: NextRequest) {
  try {
    const entries = await buildConstellationMap()
    return NextResponse.json(entries)
  } catch (err: any) {
    console.error('GET /api/constellation failed:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()
    const newEntry = await createConstellationEntry(payload)
    return NextResponse.json(newEntry, { status: 201 })
  } catch (err: any) {
    console.error('POST /api/constellation failed:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
