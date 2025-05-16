import { supabase } from '../lib/supabase.js';
import logger from '../utils/logger.js';

export interface IntegrationConfig {
  id?: string;
  serviceName: string;
  apiKey: string;
  status?: string;
  config?: Record<string, unknown>;
}

export async function registerIntegration(integration: IntegrationConfig): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('oracle_integrations')
      .insert({
        service_name: integration.serviceName,
        api_key_hash: integration.apiKey, // Note: Key will be hashed by RLS policy
        status: integration.status || 'active',
        config: integration.config || {},
      })
      .select()
      .single();

    if (error) throw error;

    logger.info('Integration registered', {
      metadata: {
        id: data.id,
        serviceName: integration.serviceName,
      },
    });

    return data.id;
  } catch (error) {
    logger.error('Error registering integration:', error);
    throw new Error('Failed to register integration');
  }
}

export async function getIntegrationConfig(serviceName: string): Promise<IntegrationConfig | null> {
  try {
    const { data, error } = await supabase
      .from('oracle_integrations')
      .select('*')
      .eq('service_name', serviceName)
      .eq('status', 'active')
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return null;
      }
      throw error;
    }

    return {
      id: data.id,
      serviceName: data.service_name,
      apiKey: data.api_key_hash,
      status: data.status,
      config: data.config,
    };
  } catch (error) {
    logger.error('Error getting integration config:', error);
    throw new Error('Failed to get integration config');
  }
}

export async function updateIntegrationStatus(
  id: string,
  status: string,
  metrics?: Record<string, unknown>
): Promise<void> {
  try {
    const { error } = await supabase
      .from('oracle_integrations')
      .update({
        status,
        last_used: new Date().toISOString(),
        usage_metrics: metrics ? supabase.sql`usage_metrics || ${metrics}` : undefined,
      })
      .eq('id', id);

    if (error) throw error;

    logger.info('Integration status updated', {
      metadata: {
        id,
        status,
        metrics,
      },
    });
  } catch (error) {
    logger.error('Error updating integration status:', error);
    throw new Error('Failed to update integration status');
  }
}