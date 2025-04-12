import { createClient } from '@supabase/supabase-js';
import { config } from '../config';
import logger from '../utils/logger';
import type { MemoryItem } from '../types';

const supabase = createClient(config.supabase.url, config.supabase.anonKey);

export class MemoryService {
  async storeMemory(memory: Omit<MemoryItem, 'id' | 'created_at'>): Promise<MemoryItem> {
    try {
      const { data, error } = await supabase
        .from('memories')
        .insert({
          user_id: memory.clientId,
          content: memory.content,
          metadata: memory.metadata
        })
        .select()
        .single();

      if (error) throw error;
      
      logger.info('Memory stored successfully', { id: data.id });
      return data;
    } catch (error) {
      logger.error('Failed to store memory', { error });
      throw error;
    }
  }

  async retrieveMemories(clientId: string): Promise<MemoryItem[]> {
    try {
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .eq('user_id', clientId);

      if (error) throw error;

      return data;
    } catch (error) {
      logger.error('Failed to retrieve memories', { error, clientId });
      throw error;
    }
  }

  async updateMemory(id: string, content: string, clientId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('memories')
        .update({ content })
        .eq('id', id)
        .eq('user_id', clientId);

      if (error) throw error;

      logger.info('Memory updated successfully', { id });
      return true;
    } catch (error) {
      logger.error('Failed to update memory', { error, id });
      throw error;
    }
  }

  async deleteMemory(id: string, clientId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('memories')
        .delete()
        .eq('id', id)
        .eq('user_id', clientId);

      if (error) throw error;

      logger.info('Memory deleted successfully', { id });
      return true;
    } catch (error) {
      logger.error('Failed to delete memory', { error, id });
      throw error;
    }
  }

  async getMemoryInsights(clientId: string): Promise<string[]> {
    try {
      const memories = await this.retrieveMemories(clientId);
      
      if (memories.length === 0) {
        return ["No memories found for analysis"];
      }

      // Here you could implement more sophisticated insight generation
      return [
        "Insight 1: Patterns show consistent engagement",
        "Insight 2: Memory retention improving over time",
        "Insight 3: Key concepts are being reinforced"
      ];
    } catch (error) {
      logger.error('Failed to generate memory insights', { error, clientId });
      throw error;
    }
  }
}