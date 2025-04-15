/*
  # Add system configuration and logging tables

  1. New Tables
    - `system_config`
      - Stores global system configuration
      - Includes personality weights, thresholds, and integration settings
    - `system_logs`
      - Stores system-wide logs
      - Includes error tracking and performance monitoring

  2. Security
    - Enable RLS on both tables
    - Add policies for admin access
*/

-- Create system_config table
CREATE TABLE IF NOT EXISTS system_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create system_logs table
CREATE TABLE IF NOT EXISTS system_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level text NOT NULL,
  message text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  timestamp timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access to system_config
CREATE POLICY "Admins can manage system config"
  ON system_config
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN role_types rt ON ur.role_id = rt.id
      WHERE ur.user_id = auth.uid()
      AND rt.name = 'admin'
    )
  );

-- Create policies for admin access to system_logs
CREATE POLICY "Admins can manage system logs"
  ON system_logs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN role_types rt ON ur.role_id = rt.id
      WHERE ur.user_id = auth.uid()
      AND rt.name = 'admin'
    )
  );

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at trigger to system_config
CREATE TRIGGER update_system_config_updated_at
  BEFORE UPDATE ON system_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial system configuration
INSERT INTO system_config (config) VALUES (
  '{
    "elementalWeights": {
      "fire": 0.5,
      "water": 0.5,
      "earth": 0.5,
      "air": 0.5,
      "aether": 0.5
    },
    "confidenceThresholds": {
      "memory": 0.7,
      "pattern": 0.8,
      "wisdom": 0.9
    },
    "systemParameters": {
      "maxTokens": 2000,
      "temperature": 0.7,
      "responseTimeout": 30000
    }
  }'::jsonb
);