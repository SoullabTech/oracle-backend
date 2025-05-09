// src/services/constellationService.ts
import { supabase } from '@/core/supabase'

export interface ConstellationEntry {
  id: string
  created_at: string
  // add other fields as needed
}

export async function buildConstellationMap(): Promise<ConstellationEntry[]> {
  const { data, error } = await supabase
    .from<ConstellationEntry>('constellation_entries')
    .select('*')

  if (error) {
    console.error('buildConstellationMap error:', error)
    throw new Error(error.message)
  }

  return data
}

export async function createConstellationEntry(
  attrs: Partial<ConstellationEntry>
): Promise<ConstellationEntry> {
  const { data, error } = await supabase
    .from<ConstellationEntry>('constellation_entries')
    .insert(attrs)
    .single()

  if (error) {
    console.error('createConstellationEntry error:', error)
    throw new Error(error.message)
  }

  return data
}
