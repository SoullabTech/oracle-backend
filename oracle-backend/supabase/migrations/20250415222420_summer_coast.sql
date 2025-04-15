/*
  # Oracle Integration Schema Update

  1. New Tables
    - `oracle_knowledge_base`: Stores IP wisdom and knowledge
    - `oracle_patterns`: Stores identified patterns and insights
    - `oracle_feedback`: Stores feedback and effectiveness metrics
    - `oracle_integrations`: Tracks external service integrations

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated access
    - Add policies for admin management

  3. Changes
    - Add integration tracking
    - Add knowledge management
    - Add pattern recognition
*/

-- Create oracle_knowledge_base table
CREATE TABLE IF NOT EXISTS oracle_knowledge_base (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  element text,
  confidence double precision DEFAULT 0.7,
  metadata jsonb DEFAULT '{}'::jsonb,
  source text NOT NULL,
  validation_status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create oracle_patterns table
CREATE TABLE IF NOT EXISTS oracle_patterns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_type text NOT NULL,
  pattern_data jsonb NOT NULL,
  confidence double precision NOT NULL,
  frequency integer DEFAULT 1,
  metadata jsonb DEFAULT '{}'::jsonb,
  last_matched timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create oracle_integrations table
CREATE TABLE IF NOT EXISTS oracle_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name text NOT NULL,
  api_key_hash text NOT NULL,
  status text DEFAULT 'active',
  last_used timestamptz,
  usage_metrics jsonb DEFAULT '{}'::jsonb,
  config jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE oracle_knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE oracle_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE oracle_integrations ENABLE ROW LEVEL SECURITY;

-- Create policies for oracle_knowledge_base
CREATE POLICY "Authenticated users can read knowledge base"
  ON oracle_knowledge_base
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage knowledge base"
  ON oracle_knowledge_base
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

-- Create policies for oracle_patterns
CREATE POLICY "Authenticated users can read patterns"
  ON oracle_patterns
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage patterns"
  ON oracle_patterns
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

-- Create policies for oracle_integrations
CREATE POLICY "Admins can manage integrations"
  ON oracle_integrations
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

-- Add updated_at triggers
CREATE TRIGGER update_oracle_knowledge_base_updated_at
  BEFORE UPDATE ON oracle_knowledge_base
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_oracle_patterns_updated_at
  BEFORE UPDATE ON oracle_patterns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_oracle_integrations_updated_at
  BEFORE UPDATE ON oracle_integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX idx_knowledge_base_category ON oracle_knowledge_base(category);
CREATE INDEX idx_knowledge_base_element ON oracle_knowledge_base(element);
CREATE INDEX idx_patterns_type ON oracle_patterns(pattern_type);
CREATE INDEX idx_patterns_frequency ON oracle_patterns(frequency);
CREATE INDEX idx_integrations_service ON oracle_integrations(service_name);
CREATE INDEX idx_integrations_status ON oracle_integrations(status);

-- Insert initial ChatGPT Oracle integration
INSERT INTO oracle_integrations (
  service_name,
  api_key_hash,
  config
) VALUES (
  'chatgpt-oracle',
  crypt(current_setting('app.settings.chatgpt_oracle_key'), gen_salt('bf')),
  '{
    "url": "https://api.elementaloracle.com",
    "version": "2.0",
    "features": ["story_generation", "pattern_recognition", "wisdom_integration"]
  }'::jsonb
);