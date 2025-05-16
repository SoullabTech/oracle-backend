import { supabase } from '../lib/supabase.js';
import logger from '../utils/logger.js';

export interface SystemMetrics {
  timestamps: string[];
  activeUsers: number[];
  responseTimes: number[];
  currentActiveUsers: number;
  avgResponseTime: number;
  memoryUsage: number;
  systemLoad: number;
}

export async function getSystemMetrics(): Promise<SystemMetrics> {
  try {
    const { data: metrics, error } = await supabase
      .from('system_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(24); // Last 24 data points

    if (error) throw error;

    return {
      timestamps: metrics.map(m => m.timestamp),
      activeUsers: metrics.map(m => m.metadata.activeUsers || 0),
      responseTimes: metrics.map(m => m.metadata.responseTime || 0),
      currentActiveUsers: metrics[0]?.metadata.activeUsers || 0,
      avgResponseTime: metrics[0]?.metadata.responseTime || 0,
      memoryUsage: metrics[0]?.metadata.memoryUsage || 0,
      systemLoad: metrics[0]?.metadata.systemLoad || 0,
    };
  } catch (error) {
    logger.error('Error fetching system metrics:', error);
    throw new Error('Failed to fetch system metrics');
  }
}

export async function getSystemConfig() {
  try {
    const { data, error } = await supabase
      .from('system_config')
      .select('*')
      .single();

    if (error) throw error;
    return data.config;
  } catch (error) {
    logger.error('Error fetching system config:', error);
    throw new Error('Failed to fetch system config');
  }
}

export async function updateSystemConfig(config: Record<string, unknown>) {
  try {
    const { error } = await supabase
      .from('system_config')
      .update({ config, updated_at: new Date().toISOString() })
      .eq('id', 1);

    if (error) throw error;

    logger.info('System configuration updated', { metadata: { config } });
  } catch (error) {
    logger.error('Error updating system config:', error);
    throw new Error('Failed to update system config');
  }
}

export async function getMemoryLogs(options: {
  element?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}) {
  try {
    let query = supabase
      .from('memory_items')
      .select('*', { count: 'exact' });

    if (options.element) {
      query = query.eq('element', options.element);
    }
    if (options.startDate) {
      query = query.gte('created_at', options.startDate.toISOString());
    }
    if (options.endDate) {
      query = query.lte('created_at', options.endDate.toISOString());
    }

    const page = options.page || 1;
    const limit = options.limit || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query
      .order('created_at', { ascending: false })
      .range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  } catch (error) {
    logger.error('Error fetching memory logs:', error);
    throw new Error('Failed to fetch memory logs');
  }
}

export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role_id')
      .eq('user_id', userId)
      .single();

    if (!roles) return false;

    const { data: roleType } = await supabase
      .from('role_types')
      .select('name')
      .eq('id', roles.role_id)
      .single();

    return roleType?.name === 'admin';
  } catch (error) {
    logger.error('Error checking admin status:', error);
    return false;
  }
}