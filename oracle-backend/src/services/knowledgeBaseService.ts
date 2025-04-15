import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';

export interface KnowledgeEntry {
  id?: string;
  title: string;
  content: string;
  category: string;
  element?: string;
  confidence?: number;
  metadata?: Record<string, unknown>;
  source: string;
}

export async function storeKnowledge(entry: KnowledgeEntry): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('oracle_knowledge_base')
      .insert({
        title: entry.title,
        content: entry.content,
        category: entry.category,
        element: entry.element,
        confidence: entry.confidence || 0.7,
        metadata: entry.metadata || {},
        source: entry.source,
        validation_status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    logger.info('Knowledge entry stored', {
      metadata: {
        id: data.id,
        title: entry.title,
        category: entry.category,
      },
    });

    return data.id;
  } catch (error) {
    logger.error('Error storing knowledge:', error);
    throw new Error('Failed to store knowledge');
  }
}

export async function queryKnowledge(params: {
  category?: string;
  element?: string;
  query?: string;
  minConfidence?: number;
  limit?: number;
}): Promise<KnowledgeEntry[]> {
  try {
    let query = supabase
      .from('oracle_knowledge_base')
      .select('*')
      .eq('validation_status', 'approved');

    if (params.category) {
      query = query.eq('category', params.category);
    }
    if (params.element) {
      query = query.eq('element', params.element);
    }
    if (params.minConfidence) {
      query = query.gte('confidence', params.minConfidence);
    }
    if (params.query) {
      query = query.textSearch('content', params.query);
    }

    query = query
      .order('confidence', { ascending: false })
      .limit(params.limit || 10);

    const { data, error } = await query;

    if (error) throw error;

    return data;
  } catch (error) {
    logger.error('Error querying knowledge base:', error);
    throw new Error('Failed to query knowledge base');
  }
}

export async function validateKnowledge(id: string, approved: boolean, notes?: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('oracle_knowledge_base')
      .update({
        validation_status: approved ? 'approved' : 'rejected',
        metadata: supabase.sql`jsonb_set(metadata, '{validation_notes}', ${notes})`,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;

    logger.info('Knowledge entry validated', {
      metadata: {
        id,
        approved,
        notes,
      },
    });
  } catch (error) {
    logger.error('Error validating knowledge:', error);
    throw new Error('Failed to validate knowledge');
  }
}

export async function updateKnowledgeConfidence(id: string, newConfidence: number): Promise<void> {
  try {
    const { error } = await supabase
      .from('oracle_knowledge_base')
      .update({
        confidence: newConfidence,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;

    logger.info('Knowledge confidence updated', {
      metadata: {
        id,
        newConfidence,
      },
    });
  } catch (error) {
    logger.error('Error updating knowledge confidence:', error);
    throw new Error('Failed to update knowledge confidence');
  }
}