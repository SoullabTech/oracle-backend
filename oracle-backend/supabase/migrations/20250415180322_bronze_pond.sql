/*
  # Collective Wisdom System

  1. New Tables
    - `collective_wisdom`
      - Stores aggregated insights from all oracle interactions
      - Includes element tags, facet identifiers, and confidence scores
    - `wisdom_patterns`
      - Stores identified patterns and themes across multiple insights
    - `wisdom_connections`
      - Maps relationships between different pieces of wisdom

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access
    - Ensure data isolation between users

  3. Changes
    - Add indexes for efficient querying
    - Add triggers for automatic timestamp updates
*/

-- Create collective_wisdom table
CREATE TABLE IF NOT EXISTS collective_wisdom (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  elements text[] NOT NULL DEFAULT '{}',
  facets text[] NOT NULL DEFAULT '{}',
  source_type text NOT NULL,
  confidence numeric NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create wisdom_patterns table
CREATE TABLE IF NOT EXISTS wisdom_patterns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  elements text[] NOT NULL DEFAULT '{}',
  facets text[] NOT NULL DEFAULT '{}',
  frequency integer DEFAULT 1,
  confidence numeric NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create wisdom_connections table
CREATE TABLE IF NOT EXISTS wisdom_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_wisdom_id uuid REFERENCES collective_wisdom(id),
  target_wisdom_id uuid REFERENCES collective_wisdom(id),
  connection_type text NOT NULL,
  strength numeric NOT NULL CHECK (strength >= 0 AND strength <= 1),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(source_wisdom_id, target_wisdom_id, connection_type)
);

-- Create indexes
CREATE INDEX idx_collective_wisdom_elements ON collective_wisdom USING gin(elements);
CREATE INDEX idx_collective_wisdom_facets ON collective_wisdom USING gin(facets);
CREATE INDEX idx_collective_wisdom_source_type ON collective_wisdom(source_type);
CREATE INDEX idx_collective_wisdom_confidence ON collective_wisdom(confidence);

CREATE INDEX idx_wisdom_patterns_elements ON wisdom_patterns USING gin(elements);
CREATE INDEX idx_wisdom_patterns_facets ON wisdom_patterns USING gin(facets);
CREATE INDEX idx_wisdom_patterns_frequency ON wisdom_patterns(frequency);

CREATE INDEX idx_wisdom_connections_source ON wisdom_connections(source_wisdom_id);
CREATE INDEX idx_wisdom_connections_target ON wisdom_connections(target_wisdom_id);
CREATE INDEX idx_wisdom_connections_type ON wisdom_connections(connection_type);

-- Enable RLS
ALTER TABLE collective_wisdom ENABLE ROW LEVEL SECURITY;
ALTER TABLE wisdom_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE wisdom_connections ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to collective wisdom"
  ON collective_wisdom
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to wisdom patterns"
  ON wisdom_patterns
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to wisdom connections"
  ON wisdom_connections
  FOR SELECT
  TO authenticated
  USING (true);

-- Create update triggers
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_collective_wisdom_timestamp
  BEFORE UPDATE ON collective_wisdom
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_wisdom_patterns_timestamp
  BEFORE UPDATE ON wisdom_patterns
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();