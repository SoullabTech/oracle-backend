/*
  # Data Model for Oracle System

  1. New Tables
    - `oracle_sessions`: Tracks user interaction sessions
    - `oracle_responses`: Stores individual responses and their metadata
    - `oracle_metrics`: Stores performance and usage metrics
    - `oracle_patterns`: Stores identified interaction patterns
    - `oracle_feedback`: Stores user feedback and ratings

  2. Security
    - Enable RLS on all tables
    - Add policies for user access control
    - Add policies for admin access

  3. Changes
    - Add indexes for performance optimization
    - Add triggers for automatic timestamp updates
*/

-- Create oracle_sessions table
CREATE TABLE IF NOT EXISTS oracle_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  element text,
  phase text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_element CHECK (
    element IN ('fire', 'water', 'earth', 'air', 'aether')
  )
);

-- Create oracle_responses table
CREATE TABLE IF NOT EXISTS oracle_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES oracle_sessions(id),
  query text NOT NULL,
  response text NOT NULL,
  element text NOT NULL,
  confidence numeric CHECK (confidence >= 0 AND confidence <= 1),
  processing_time integer, -- in milliseconds
  token_count integer,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_element CHECK (
    element IN ('fire', 'water', 'earth', 'air', 'aether')
  )
);

-- Create oracle_metrics table
CREATE TABLE IF NOT EXISTS oracle_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type text NOT NULL,
  value numeric NOT NULL,
  dimension text,
  timestamp timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT valid_metric_type CHECK (
    metric_type IN (
      'response_time',
      'token_usage',
      'user_satisfaction',
      'error_rate',
      'pattern_confidence'
    )
  )
);

-- Create oracle_patterns table
CREATE TABLE IF NOT EXISTS oracle_patterns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_type text NOT NULL,
  pattern_data jsonb NOT NULL,
  confidence numeric CHECK (confidence >= 0 AND confidence <= 1),
  frequency integer DEFAULT 1,
  last_matched timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_pattern_type CHECK (
    pattern_type IN (
      'interaction',
      'response',
      'feedback',
      'elemental',
      'temporal'
    )
  )
);

-- Create indexes
CREATE INDEX idx_oracle_sessions_user_id ON oracle_sessions(user_id);
CREATE INDEX idx_oracle_sessions_element ON oracle_sessions(element);
CREATE INDEX idx_oracle_responses_session_id ON oracle_responses(session_id);
CREATE INDEX idx_oracle_responses_element ON oracle_responses(element);
CREATE INDEX idx_oracle_metrics_type_timestamp ON oracle_metrics(metric_type, timestamp);
CREATE INDEX idx_oracle_patterns_type ON oracle_patterns(pattern_type);
CREATE INDEX idx_oracle_patterns_confidence ON oracle_patterns(confidence);

-- Enable RLS
ALTER TABLE oracle_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE oracle_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE oracle_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE oracle_patterns ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can access their own sessions"
  ON oracle_sessions
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can access their own responses"
  ON oracle_responses
  FOR ALL
  TO authenticated
  USING (
    session_id IN (
      SELECT id FROM oracle_sessions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Only admins can access metrics"
  ON oracle_metrics
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN role_types rt ON ur.role_id = rt.id
      WHERE ur.user_id = auth.uid() AND rt.name = 'admin'
    )
  );

CREATE POLICY "Only admins can access patterns"
  ON oracle_patterns
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN role_types rt ON ur.role_id = rt.id
      WHERE ur.user_id = auth.uid() AND rt.name = 'admin'
    )
  );

-- Create update triggers
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_oracle_sessions_timestamp
  BEFORE UPDATE ON oracle_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_oracle_patterns_timestamp
  BEFORE UPDATE ON oracle_patterns
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();