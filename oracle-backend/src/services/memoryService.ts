import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

export interface MemoryItem {
  id?: string;
  content: string;
  element: string;
  facet?: string;
  sourceAgent: string;
  userId?: string;
  confidence?: number;
  metadata?: Record<string, unknown>;
}

export interface MemoryPattern {
  id?: string;
  patternName: string;
  description?: string;
  elements: string[];
  facets: string[];
  confidence: number;
  metadata?: Record<string, unknown>;
}

export interface MemoryAggregation {
  id?: string;
  content: string;
  sourcePatterns: string[];
  elements: string[];
  facets: string[];
  confidence: number;
  metadata?: Record<string, unknown>;
}

export async function storeMemoryItem(item: MemoryItem): Promise<string> {
  const { data, error } = await supabase
    .from('memory_items')
    .insert({
      content: item.content,
      element: item.element,
      facet: item.facet,
      source_agent: item.sourceAgent,
      user_id: item.userId,
      confidence: item.confidence,
      metadata: item.metadata,
    })
    .select()
    .single();

  if (error) {
    console.error('Error storing memory item:', error);
    throw new Error('Failed to store memory item');
  }

  return data.id;
}

export async function storeMemoryPattern(pattern: MemoryPattern): Promise<string> {
  const { data, error } = await supabase
    .from('memory_patterns')
    .insert({
      pattern_name: pattern.patternName,
      description: pattern.description,
      elements: pattern.elements,
      facets: pattern.facets,
      confidence: pattern.confidence,
      metadata: pattern.metadata,
    })
    .select()
    .single();

  if (error) {
    console.error('Error storing memory pattern:', error);
    throw new Error('Failed to store memory pattern');
  }

  return data.id;
}

export async function storeMemoryAggregation(aggregation: MemoryAggregation): Promise<string> {
  const { data, error } = await supabase
    .from('memory_aggregations')
    .insert({
      content: aggregation.content,
      source_patterns: aggregation.sourcePatterns,
      elements: aggregation.elements,
      facets: aggregation.facets,
      confidence: aggregation.confidence,
      metadata: aggregation.metadata,
    })
    .select()
    .single();

  if (error) {
    console.error('Error storing memory aggregation:', error);
    throw new Error('Failed to store memory aggregation');
  }

  return data.id;
}

export async function getRelevantMemories(
  element: string,
  facet?: string,
  limit = 10
): Promise<MemoryItem[]> {
  let query = supabase
    .from('memory_items')
    .select('*')
    .eq('element', element)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (facet) {
    query = query.eq('facet', facet);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching memories:', error);
    throw new Error('Failed to fetch memories');
  }

  return data;
}

export async function getPatternsByElements(
  elements: string[],
  minConfidence = 0.7
): Promise<MemoryPattern[]> {
  const { data, error } = await supabase
    .from('memory_patterns')
    .select('*')
    .contains('elements', elements)
    .gte('confidence', minConfidence)
    .order('confidence', { ascending: false });

  if (error) {
    console.error('Error fetching patterns:', error);
    throw new Error('Failed to fetch patterns');
  }

  return data;
}

export async function getAggregatedWisdom(
  elements: string[],
  facets: string[],
  minConfidence = 0.7
): Promise<MemoryAggregation[]> {
  const { data, error } = await supabase
    .from('memory_aggregations')
    .select('*')
    .contains('elements', elements)
    .contains('facets', facets)
    .gte('confidence', minConfidence)
    .order('confidence', { ascending: false });

  if (error) {
    console.error('Error fetching aggregated wisdom:', error);
    throw new Error('Failed to fetch aggregated wisdom');
  }

  return data;
}