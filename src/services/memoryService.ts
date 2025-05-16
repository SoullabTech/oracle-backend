// src/services/memoryService.ts

import { supabase } from '../lib/supabaseClient.js';
import logger from '../utils/logger.js';
import { logOracleInsight } from '../utils/oracleLogger.js';
import type { MemoryItem } from '../types/memory.js';

/**
 * Store a memory item and log the creation event.
 */
export async function storeMemoryItem(
  memory: Omit<MemoryItem, 'id' | 'created_at'>
): Promise<MemoryItem> {
  const { data, error } = await supabase
    .from<MemoryItem>('memories')
    .insert(
      {
        user_id: memory.clientId,
        content: memory.content,
        metadata: memory.metadata ?? {},
      },
      { returning: 'representation' }
    )
    .single();

  if (error || !data) throw error ?? new Error('No data returned from insert');

  await logOracleInsight({
    anon_id: memory.clientId,
    archetype: 'Memory',
    element: 'memory',
    insight: {
      message: `Memory created: ${data.id}`,
      raw_input: memory.content,
    },
    emotion: 0.8,
    phase: 'creation',
    context: [],
  });

  logger.info('Memory stored successfully', { memoryId: data.id });
  return data;
}

/**
 * Retrieve past memories that match a symbolic tag.
 */
export async function getMemoriesBySymbol(
  symbol: string,
  userId: string,
  limit = 10
): Promise<MemoryItem[]> {
  const { data, error } = await supabase
    .from<MemoryItem>('memories')
    .select('*')
    .contains('metadata', { tags: [symbol] })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    logger.error('Error fetching memories by symbol', { error, symbol, userId });
    return [];
  }
  return data ?? [];
}

/**
 * Fetch all memories for a given user.
 */
export async function getAllMemories(userId: string): Promise<MemoryItem[]> {
  const { data, error } = await supabase
    .from<MemoryItem>('memories')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data ?? [];
}

/**
 * Get recent memories for a user.
 */
export async function getRelevantMemories(
  userId: string,
  limit = 10
): Promise<MemoryItem[]> {
  const { data, error } = await supabase
    .from<MemoryItem>('memories')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

/**
 * Update an existing memory's content.
 */
export async function updateMemory(
  id: string,
  newContent: string,
  userId: string
): Promise<MemoryItem> {
  const { data, error } = await supabase
    .from<MemoryItem>('memories')
    .update({ content: newContent })
    .eq('id', id)
    .eq('user_id', userId)
    .select('*')
    .single();

  if (error || !data) throw error ?? new Error('No data returned from update');

  await logOracleInsight({
    anon_id: userId,
    archetype: 'Memory',
    element: 'memory',
    insight: {
      message: `Memory updated: ${id}`,
      raw_input: newContent,
    },
    emotion: 0.85,
    phase: 'update',
    context: [],
  });

  logger.info('Memory updated successfully', { memoryId: id });
  return data;
}

/**
 * Delete a memory by ID.
 */
export async function deleteMemory(id: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('memories')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;

  await logOracleInsight({
    anon_id: userId,
    archetype: 'Memory',
    element: 'memory',
    insight: {
      message: `Memory deleted: ${id}`,
      raw_input: id,
    },
    emotion: 0.85,
    phase: 'deletion',
    context: [],
  });

  logger.info('Memory deleted successfully', { memoryId: id });
}

/**
 * Generate simple insights from stored memories.
 */
export async function getMemoryInsights(userId: string): Promise<string[]> {
  const memories = await getAllMemories(userId);
  if (memories.length === 0) {
    return ['No memories found for analysis'];
  }

  const insights = memories.map((m, idx) => {
    const preview = m.content.length > 50 ? `${m.content.slice(0, 50)}...` : m.content;
    return `Insight ${idx + 1}: "${preview}"`;
  });

  await logOracleInsight({
    anon_id: userId,
    archetype: 'Memory',
    element: 'insight',
    insight: {
      message: 'Generated memory insights',
      raw_input: JSON.stringify({ count: insights.length }),
    },
    emotion: 0.9,
    phase: 'analysis',
    context: [],
  });

  return insights;
}
