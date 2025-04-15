/*
  # Monitoring and Analysis System

  1. New Tables
    - `feedback_analysis`
      - Stores periodic analysis of feedback trends
    - `personality_weights`
      - Stores dynamic weights for personality adjustments

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access

  3. Changes
    - Add indexes for efficient querying
    - Add triggers for automatic timestamp updates
*/

-- Create feedback_analysis table
CREATE TABLE IF NOT EXISTS feedback_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_date timestamptz NOT NULL DEFAULT now(),
  metrics jsonb NOT NULL DEFAULT '{}'::jsonb,
  adjustments jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_metrics CHECK (metrics IS NOT NULL),
  CONSTRAINT valid_adjustments CHECK (adjustments IS NOT NULL)
);

-- Create personality_weights table
CREATE TABLE IF NOT EXISTS personality_weights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  element text NOT NULL,
  weight numeric NOT NULL CHECK (weight >= 0 AND weight <= 1),
  last_updated timestamptz DEFAULT now(),
  confidence numeric NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  CONSTRAINT valid_element CHECK (
    element IN ('fire', 'water', 'earth', 'air', 'aether')
  )
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_feedback_analysis_date 
  ON feedback_analysis(analysis_date);
CREATE INDEX IF NOT EXISTS idx_personality_weights_element 
  ON personality_weights(element);

-- Enable RLS
ALTER TABLE feedback_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE personality_weights ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to feedback analysis"
  ON feedback_analysis
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to personality weights"
  ON personality_weights
  FOR SELECT
  TO authenticated
  USING (true);

-- Initialize default weights
INSERT INTO personality_weights (element, weight, confidence)
VALUES 
  ('fire', 0.5, 1.0),
  ('water', 0.5, 1.0),
  ('earth', 0.5, 1.0),
  ('air', 0.5, 1.0),
  ('aether', 0.5, 1.0)
ON CONFLICT DO NOTHING;