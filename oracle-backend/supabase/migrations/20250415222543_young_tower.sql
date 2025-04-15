/*
  # Feedback Loop System Schema

  1. New Tables
    - `feedback_metrics`: Stores detailed feedback metrics
    - `feedback_analysis`: Stores analysis results
    - `learning_adjustments`: Stores system adjustments based on feedback
    - `effectiveness_tracking`: Tracks effectiveness of adjustments

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated access
    - Add policies for admin analysis

  3. Changes
    - Add feedback tracking
    - Add analysis storage
    - Add adjustment tracking
*/

-- Create feedback_metrics table
CREATE TABLE IF NOT EXISTS feedback_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  response_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  element text,
  query_type text,
  response_pattern text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create feedback_analysis table
CREATE TABLE IF NOT EXISTS feedback_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timeframe_start timestamptz NOT NULL,
  timeframe_end timestamptz NOT NULL,
  total_feedback integer NOT NULL,
  average_rating numeric NOT NULL,
  elemental_effectiveness jsonb NOT NULL,
  pattern_effectiveness jsonb NOT NULL,
  insights jsonb DEFAULT '[]'::jsonb,
  recommendations jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create learning_adjustments table
CREATE TABLE IF NOT EXISTS learning_adjustments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id uuid REFERENCES feedback_analysis(id),
  adjustment_type text NOT NULL,
  previous_value jsonb NOT NULL,
  new_value jsonb NOT NULL,
  confidence numeric NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  applied_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Create effectiveness_tracking table
CREATE TABLE IF NOT EXISTS effectiveness_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  adjustment_id uuid REFERENCES learning_adjustments(id),
  metric_type text NOT NULL,
  baseline_value numeric NOT NULL,
  current_value numeric NOT NULL,
  improvement_percentage numeric,
  evaluation_period_days integer DEFAULT 7,
  last_evaluated_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE feedback_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE effectiveness_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies for feedback_metrics
CREATE POLICY "Users can insert their own feedback"
  ON feedback_metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback"
  ON feedback_metrics
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for feedback analysis and learning
CREATE POLICY "Admins can view all feedback analysis"
  ON feedback_analysis
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN role_types rt ON ur.role_id = rt.id
      WHERE ur.user_id = auth.uid()
      AND rt.name = 'admin'
    )
  );

CREATE POLICY "Admins can manage learning adjustments"
  ON learning_adjustments
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

CREATE POLICY "Admins can manage effectiveness tracking"
  ON effectiveness_tracking
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

-- Create indexes
CREATE INDEX idx_feedback_metrics_user ON feedback_metrics(user_id);
CREATE INDEX idx_feedback_metrics_element ON feedback_metrics(element);
CREATE INDEX idx_feedback_metrics_created ON feedback_metrics(created_at);
CREATE INDEX idx_feedback_analysis_timeframe ON feedback_analysis(timeframe_start, timeframe_end);
CREATE INDEX idx_learning_adjustments_type ON learning_adjustments(adjustment_type);
CREATE INDEX idx_effectiveness_tracking_metric ON effectiveness_tracking(metric_type);

-- Add functions for feedback analysis
CREATE OR REPLACE FUNCTION calculate_effectiveness_metrics()
RETURNS trigger AS $$
BEGIN
  -- Calculate improvement percentage
  NEW.improvement_percentage := 
    CASE 
      WHEN NEW.baseline_value = 0 THEN 0
      ELSE ((NEW.current_value - NEW.baseline_value) / NEW.baseline_value) * 100
    END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
CREATE TRIGGER update_effectiveness_metrics
  BEFORE INSERT OR UPDATE ON effectiveness_tracking
  FOR EACH ROW
  EXECUTE FUNCTION calculate_effectiveness_metrics();