// src/services/memoryService.ts

import { supabase } from "../lib/supabaseClient";
import logger from "../utils/logger";
import oracleLogger from "../utils/oracleLogger";
import { MemoryItem } from '../types/memory';
import { SymbolicTag } from '../types/memory';


class MemoryService {
  /**
   * Stores a memory in the database.
   * @param memory - The memory item to store.
   */
  async storeMemory(memory: MemoryItem): Promise<MemoryItem> {
    const { data, error } = await supabase
      .from('memories')
      .insert([memory])
      .single();

    if (error) {
      throw new Error('Failed to store memory');
    }

    return data;
  }

  /**
   * Retrieves memories by user or client ID.
   * @param userId - The user ID to filter memories.
   */
  async getMemories(userId: string): Promise<MemoryItem[]> {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .eq('clientId', userId);

    if (error) {
      throw new Error('Failed to retrieve memories');
    }

    return data;
  }

  /**
   * Adds a symbolic tag to a memory.
   * @param tag - The symbolic tag to associate with the memory.
   */
  async addSymbolicTag(tag: SymbolicTag): Promise<SymbolicTag> {
    const { data, error } = await supabase
      .from('symbolic_tags')
      .insert([tag])
      .single();

    if (error) {
      throw new Error('Failed to store symbolic tag');
    }

    return data;
  }
}

export default new MemoryService();


/**
 * Store a memory item and log the creation event.
 */
export async function storeMemoryItem(
  memory: Omit<MemoryItem, "id" | "created_at">,
): Promise<MemoryItem> {
  try {
    const { data, error } = await supabase
      .from<MemoryItem>("memories")
      .insert(
        {
          user_id: memory.clientId,
          content: memory.content,
          metadata: memory.metadata ?? {},
        },
        { returning: "representation" },
      )
      .single();

    if (error || !data) {
      throw error ?? new Error("No data returned from insert");
    }

    await oracleLogger.logInsight({
      userId: memory.clientId,
      insightType: "memory_creation",
      content: `Memory created: ${data.id}`,
      metadata: {
        memory_id: data.id,
        tags: memory.metadata?.tags ?? [],
        length: memory.content.length,
      },
    });

    logger.info("Memory stored successfully", { memoryId: data.id });
    return data;
  } catch (err) {
    logger.error("Failed to store memory", { error: err });
    throw err;
  }
}

/**
 * Retrieve past memories that match a symbolic tag.
 */
export async function getMemoriesBySymbol(
  symbol: string,
  userId: string,
  limit = 10,
): Promise<MemoryItem[]> {
  try {
    // Assuming `metadata->'tags'` is an array of strings in JSONB
    const { data, error } = await supabase
      .from<MemoryItem>("memories")
      .select("*")
      .contains("metadata", { tags: [symbol] })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data ?? [];
  } catch (err) {
    logger.error("Error fetching memories by symbol", {
      error: err,
      symbol,
      userId,
    });
    return [];
  }
}

/**
 * Fetch all memories for a given user.
 */
export async function getAllMemories(userId: string): Promise<MemoryItem[]> {
  try {
    const { data, error } = await supabase
      .from<MemoryItem>("memories")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;
    return data ?? [];
  } catch (err) {
    logger.error("Failed to retrieve all memories", { error: err, userId });
    throw err;
  }
}

/**
 * Get recent memories for a user.
 */
export async function getRelevantMemories(
  userId: string,
  limit = 10,
): Promise<MemoryItem[]> {
  try {
    const { data, error } = await supabase
      .from<MemoryItem>("memories")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data ?? [];
  } catch (err) {
    logger.error("Failed to get relevant memories", { error: err, userId });
    throw err;
  }
}

/**
 * Update an existing memory's content.
 */
export async function updateMemory(
  id: string,
  newContent: string,
  userId: string,
): Promise<MemoryItem> {
  try {
    const { data, error } = await supabase
      .from<MemoryItem>("memories")
      .update({ content: newContent })
      .eq("id", id)
      .eq("user_id", userId)
      .select("*")
      .single();

    if (error || !data) {
      throw error ?? new Error("No data returned from update");
    }

    await oracleLogger.logInsight({
      userId,
      insightType: "memory_update",
      content: `Memory updated: ${id}`,
      metadata: { memory_id: id, action: "update" },
    });

    logger.info("Memory updated successfully", { memoryId: id });
    return data;
  } catch (err) {
    logger.error("Failed to update memory", { error: err, memoryId: id });
    throw err;
  }
}

/**
 * Delete a memory by ID.
 */
export async function deleteMemory(id: string, userId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from("memories")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;

    await oracleLogger.logInsight({
      userId,
      insightType: "memory_deletion",
      content: `Memory deleted: ${id}`,
      metadata: { memory_id: id, action: "delete" },
    });

    logger.info("Memory deleted successfully", { memoryId: id });
  } catch (err) {
    logger.error("Failed to delete memory", { error: err, memoryId: id });
    throw err;
  }
}

/**
 * Generate simple insights from stored memories.
 */
export async function getMemoryInsights(userId: string): Promise<string[]> {
  try {
    const memories = await getAllMemories(userId);
    if (memories.length === 0) {
      return ["No memories found for analysis"];
    }

    const insights = memories.map((m, idx) => {
      const preview =
        m.content.length > 50 ? `${m.content.slice(0, 50)}...` : m.content;
      return `Insight ${idx + 1}: "${preview}"`;
    });

    await oracleLogger.logInsight({
      userId,
      insightType: "memory_insight",
      content: "Generated memory insights",
      metadata: {
        insight_count: insights.length,
        memory_count: memories.length,
      },
    });

    return insights;
  } catch (err) {
    logger.error("Failed to generate memory insights", { error: err, userId });
    throw err;
  }
}
