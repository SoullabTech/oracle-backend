import { supabase } from '../lib/supabase';

export interface OracleMetric {
  metricType: string;
  value: number;
  dimension?: string;
  metadata?: Record<string, unknown>;
}

export interface MetricsSummary {
  averageResponseTime: number;
  tokenUsage: number;
  userSatisfaction: number;
  errorRate: number;
  patternConfidence: number;
}

export async function recordMetric(metric: OracleMetric): Promise<void> {
  const { error } = await supabase
    .from('oracle_metrics')
    .insert({
      metric_type: metric.metricType,
      value: metric.value,
      dimension: metric.dimension,
      metadata: metric.metadata,
      timestamp: new Date().toISOString(),
    });

  if (error) {
    console.error('Error recording metric:', error);
    throw new Error('Failed to record metric');
  }
}

export async function getMetricsSummary(
  timeframe: { start: Date; end: Date }
): Promise<MetricsSummary> {
  const { data, error } = await supabase
    .from('oracle_metrics')
    .select('metric_type, value')
    .gte('timestamp', timeframe.start.toISOString())
    .lte('timestamp', timeframe.end.toISOString());

  if (error) {
    console.error('Error fetching metrics:', error);
    throw new Error('Failed to fetch metrics');
  }

  // Calculate averages for each metric type
  const metrics = data.reduce((acc, curr) => {
    if (!acc[curr.metric_type]) {
      acc[curr.metric_type] = { sum: 0, count: 0 };
    }
    acc[curr.metric_type].sum += curr.value;
    acc[curr.metric_type].count += 1;
    return acc;
  }, {} as Record<string, { sum: number; count: number }>);

  return {
    averageResponseTime: metrics.response_time?.sum / metrics.response_time?.count || 0,
    tokenUsage: metrics.token_usage?.sum / metrics.token_usage?.count || 0,
    userSatisfaction: metrics.user_satisfaction?.sum / metrics.user_satisfaction?.count || 0,
    errorRate: metrics.error_rate?.sum / metrics.error_rate?.count || 0,
    patternConfidence: metrics.pattern_confidence?.sum / metrics.pattern_confidence?.count || 0,
  };
}

export async function getMetricTrends(
  metricType: string,
  timeframe: { start: Date; end: Date },
  interval: string = '1 hour'
): Promise<{ timestamp: string; value: number }[]> {
  const { data, error } = await supabase
    .from('oracle_metrics')
    .select('timestamp, value')
    .eq('metric_type', metricType)
    .gte('timestamp', timeframe.start.toISOString())
    .lte('timestamp', timeframe.end.toISOString())
    .order('timestamp', { ascending: true });

  if (error) {
    console.error('Error fetching metric trends:', error);
    throw new Error('Failed to fetch metric trends');
  }

  return data.map(item => ({
    timestamp: new Date(item.timestamp).toISOString(),
    value: item.value,
  }));
}