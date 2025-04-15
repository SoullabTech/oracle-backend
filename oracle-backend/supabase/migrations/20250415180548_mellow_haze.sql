/*
  # Memory System Implementation

  1. New Tables
    - `memory_items`: Stores individual memory entries
    - `memory_patterns`: Stores identified patterns across memories
    - `memory_aggregations`: Stores synthesized wisdom from patterns

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access

  3. Changes
    - Add indexes for efficient querying
    - Add triggers for automatic timestamp updates
*/

-- Create memory_items table
CREATE TABLE IF NOT EXISTS memory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  element text NOT NULL,
  facet text,
  source_agent text NOT NULL,
  user_id uuid REFERENCES users(id),
  confidence numeric CHECK (confidence >= 0 AND confidence <= 1),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_element CHECK (
    element IN ('fire', 'water', 'earth', 'air', 'aether')
  )
);

-- Create memory_patterns table
CREATE TABLE IF NOT EXISTS memory_patterns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_name text NOT NULL,
  description text,
  elements text[] NOT NULL,
  facets text[] NOT NULL,
  confidence numeric CHECK (confidence >= 0 AND confidence <= 1),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create memory_aggregations table
CREATE TABLE IF NOT EXISTS memory_aggregations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  source_patterns uuid[] REFERENCES memory_patterns(id),
  elements text[] NOT NULL,
  facets text[] NOT NULL,
  confidence numeric CHECK (confidence >= 0 AND confidence <= 1),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_memory_items_element ON memory_items(element);
CREATE INDEX IF NOT EXISTS idx_memory_items_facet ON memory_items(facet);
CREATE INDEX IF NOT EXISTS idx_memory_items_user_id ON memory_items(user_id);
CREATE INDEX IF NOT EXISTS idx_memory_items_created_at ON memory_items(created_at);

CREATE INDEX IF NOT EXISTS idx_memory_patterns_elements ON memory_patterns USING gin(elements);
CREATE INDEX IF NOT EXISTS idx_memory_patterns_facets ON memory_patterns USING gin(facets);

CREATE INDEX IF NOT EXISTS idx_memory_aggregations_elements ON memory_aggregations USING gin(elements);
CREATE INDEX IF NOT EXISTS idx_memory_aggregations_facets ON memory_aggregations USING gin(facets);

-- Enable RLS
ALTER TABLE memory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_aggregations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own memory items"
  ON memory_items
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can read memory patterns"
  ON memory_patterns
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read memory aggregations"
  ON memory_aggregations
  FOR SELECT
  TO authenticated
  USING (true);

-- Create update trigger for memory_patterns
CREATE OR REPLACE FUNCTION update_memory_patterns_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_memory_patterns_timestamp
  BEFORE UPDATE ON memory_patterns
  FOR EACH ROW
  EXECUTE FUNCTION update_memory_patterns_updated_at();

-- Create update trigger for memory_aggregations
CREATE OR REPLACE FUNCTION update_memory_aggregations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_memory_aggregations_timestamp
  BEFORE UPDATE ON memory_aggregations
  FOR EACH ROW
  EXECUTE FUNCTION update_memory_aggregations_updated_at();