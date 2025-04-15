-- Create oracle_feedback table
CREATE TABLE IF NOT EXISTS oracle_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  query text NOT NULL,
  response text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comments text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_metadata CHECK (metadata IS NOT NULL)
);

-- Create indexes
CREATE INDEX idx_oracle_feedback_user_id ON oracle_feedback(user_id);
CREATE INDEX idx_oracle_feedback_rating ON oracle_feedback(rating);
CREATE INDEX idx_oracle_feedback_created_at ON oracle_feedback(created_at);

-- Enable RLS
ALTER TABLE oracle_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own feedback"
  ON oracle_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read their own feedback"
  ON oracle_feedback
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create feedback analysis view
CREATE OR REPLACE VIEW feedback_analysis_view AS
SELECT
  user_id,
  COUNT(*) as total_feedback,
  AVG(rating) as average_rating,
  COUNT(*) FILTER (WHERE rating >= 4) as positive_feedback,
  COUNT(*) FILTER (WHERE rating <= 2) as negative_feedback,
  jsonb_object_agg(
    COALESCE(metadata->>'element', 'unknown'),
    COUNT(*)
  ) as elemental_distribution
FROM oracle_feedback
GROUP BY user_id;

-- Grant access to the view
GRANT SELECT ON feedback_analysis_view TO authenticated;