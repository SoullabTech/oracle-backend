import { supabase } from '../lib/supabase';

export interface CollectiveWisdom {
  id?: string;
  content: string;
  elements: string[];
  facets: string[];
  sourceType: string;
  confidence: number;
  metadata?: Record<string, unknown>;
}

export interface WisdomPattern {
  id?: string;
  name: string;
  description?: string;
  elements: string[];
  facets: string[];
  frequency: number;
  confidence: number;
  metadata?: Record<string, unknown>;
}

export interface WisdomConnection {
  id?: string;
  sourceWisdomId: string;
  targetWisdomId: string;
  connectionType: string;
  strength: number;
  metadata?: Record<string, unknown>;
}

export async function storeWisdom(wisdom: CollectiveWisdom): Promise<string> {
  const { data, error } = await supabase
    .from('collective_wisdom')
    .insert({
      content: wisdom.content,
      elements: wisdom.elements,
      facets: wisdom.facets,
      source_type: wisdom.sourceType,
      confidence: wisdom.confidence,
      metadata: wisdom.metadata,
    })
    .select()
    .single();

  if (error) {
    console.error('Error storing wisdom:', error);
    throw new Error('Failed to store wisdom');
  }

  return data.id;
}

export async function storePattern(pattern: WisdomPattern): Promise<string> {
  const { data, error } = await supabase
    .from('wisdom_patterns')
    .insert({
      name: pattern.name,
      description: pattern.description,
      elements: pattern.elements,
      facets: pattern.facets,
      frequency: pattern.frequency,
      confidence: pattern.confidence,
      metadata: pattern.metadata,
    })
    .select()
    .single();

  if (error) {
    console.error('Error storing pattern:', error);
    throw new Error('Failed to store pattern');
  }

  return data.id;
}

export async function connectWisdom(connection: WisdomConnection): Promise<string> {
  const { data, error } = await supabase
    .from('wisdom_connections')
    .insert({
      source_wisdom_id: connection.sourceWisdomId,
      target_wisdom_id: connection.targetWisdomId,
      connection_type: connection.connectionType,
      strength: connection.strength,
      metadata: connection.metadata,
    })
    .select()
    .single();

  if (error) {
    console.error('Error connecting wisdom:', error);
    throw new Error('Failed to connect wisdom');
  }

  return data.id;
}

export async function getWisdomByElements(
  elements: string[],
  minConfidence = 0.7,
  limit = 10
): Promise<CollectiveWisdom[]> {
  const { data, error } = await supabase
    .from('collective_wisdom')
    .select('*')
    .contains('elements', elements)
    .gte('confidence', minConfidence)
    .order('confidence', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching wisdom:', error);
    throw new Error('Failed to fetch wisdom');
  }

  return data;
}

export async function getPatternsByFacets(
  facets: string[],
  minConfidence = 0.7
): Promise<WisdomPattern[]> {
  const { data, error } = await supabase
    .from('wisdom_patterns')
    .select('*')
    .contains('facets', facets)
    .gte('confidence', minConfidence)
    .order('frequency', { ascending: false });

  if (error) {
    console.error('Error fetching patterns:', error);
    throw new Error('Failed to fetch patterns');
  }

  return data;
}

export async function getConnectedWisdom(
  wisdomId: string,
  connectionType?: string
): Promise<WisdomConnection[]> {
  let query = supabase
    .from('wisdom_connections')
    .select('*')
    .or(`source_wisdom_id.eq.${wisdomId},target_wisdom_id.eq.${wisdomId}`);

  if (connectionType) {
    query = query.eq('connection_type', connectionType);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching connections:', error);
    throw new Error('Failed to fetch connections');
  }

  return data;
}