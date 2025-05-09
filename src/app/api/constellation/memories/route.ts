// src/app/api/memories/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { listMemories, createMemory } from '@/services/memoryService'

export async function GET(_: NextRequest) {
  try {
    const all = await listMemories()
    return NextResponse.json(all)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const saved = await createMemory(body)
    return NextResponse.json(saved, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
