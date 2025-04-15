/*
  # Feedback System Implementation

  1. New Tables
    - `oracle_feedback`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `query` (text)
      - `response` (text)
      - `rating` (integer, 1-5)
      - `comments` (text, optional)
      - `created_at` (timestamp)
      - `metadata` (jsonb)

  2. Security
    - Enable RLS on `oracle_feedback` table
    - Add policies for authenticated users to:
      - Insert their own feedback
      - Read their own feedback
      - Read aggregated feedback stats

  3. Changes
    - Add feedback tracking capabilities
    - Add metadata storage for response context
*/

-- Create oracle_feedback table
CREATE TABLE IF NOT EXISTS oracle_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  query text NOT NULL,
  response text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comments text,
  created_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT valid_metadata CHECK (metadata IS NOT NULL)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_oracle_feedback_user_id ON oracle_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_oracle_feedback_rating ON oracle_feedback(rating);
CREATE INDEX IF NOT EXISTS idx_oracle_feedback_created_at ON oracle_feedback(created_at);

-- Enable RLS
ALTER TABLE oracle_feedback ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can insert their own feedback"
  ON oracle_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own feedback"
  ON oracle_feedback
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create view for feedback stats
CREATE OR REPLACE VIEW feedback_stats AS
SELECT
  user_id,
  COUNT(*) as total_feedback,
  AVG(rating) as average_rating,
  COUNT(*) FILTER (WHERE rating >= 4) as positive_feedback,
  COUNT(*) FILTER (WHERE rating <= 2) as negative_feedback
FROM oracle_feedback
GROUP BY user_id;

-- Grant access to the view
GRANT SELECT ON feedback_stats TO authenticated;