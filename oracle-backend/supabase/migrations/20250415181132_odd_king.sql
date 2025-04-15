-- Create system_metrics table
CREATE TABLE IF NOT EXISTS system_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL DEFAULT now(),
  active_users integer NOT NULL DEFAULT 0,
  response_time numeric NOT NULL DEFAULT 0,
  memory_usage numeric NOT NULL DEFAULT 0,
  cpu_usage numeric NOT NULL DEFAULT 0,
  error_count integer NOT NULL DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Create system_config table
CREATE TABLE IF NOT EXISTS system_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_system_metrics_timestamp ON system_metrics(timestamp);

-- Enable RLS
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Only admins can access system metrics"
  ON system_metrics
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN role_types rt ON ur.role_id = rt.id
      WHERE ur.user_id = auth.uid() AND rt.name = 'admin'
    )
  );

CREATE POLICY "Only admins can access system config"
  ON system_config
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN role_types rt ON ur.role_id = rt.id
      WHERE ur.user_id = auth.uid() AND rt.name = 'admin'
    )
  );

-- Create update trigger for system_config
CREATE OR REPLACE FUNCTION update_system_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_system_config_timestamp
  BEFORE UPDATE ON system_config
  FOR EACH ROW
  EXECUTE FUNCTION update_system_config_updated_at();