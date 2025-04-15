/*
  # Survey System Tables

  1. New Tables
    - `survey_questions`
      - Questions for the elemental profile assessment
      - Stores question text, element type, and weight
    
    - `survey_responses`
      - User responses to survey questions
      - Links users to their answers
    
    - `elemental_profiles`
      - Calculated elemental scores for each user
      - Stores fire, water, earth, air, and aether scores

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read/write their own data
*/

-- Create survey_questions table
CREATE TABLE IF NOT EXISTS survey_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  element text NOT NULL,
  weight integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  CHECK (element IN ('fire', 'water', 'earth', 'air', 'aether'))
);

ALTER TABLE survey_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read survey questions"
  ON survey_questions
  FOR SELECT
  TO authenticated
  USING (true);

-- Create survey_responses table
CREATE TABLE IF NOT EXISTS survey_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  question_id uuid REFERENCES survey_questions NOT NULL,
  answer integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  CHECK (answer >= 1 AND answer <= 5)
);

ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own responses"
  ON survey_responses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own responses"
  ON survey_responses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create elemental_profiles table
CREATE TABLE IF NOT EXISTS elemental_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL UNIQUE,
  fire integer NOT NULL CHECK (fire >= 0 AND fire <= 100),
  water integer NOT NULL CHECK (water >= 0 AND water <= 100),
  earth integer NOT NULL CHECK (earth >= 0 AND earth <= 100),
  air integer NOT NULL CHECK (air >= 0 AND air <= 100),
  aether integer NOT NULL CHECK (aether >= 0 AND aether <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE elemental_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can upsert their own profile"
  ON elemental_profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for updated_at
CREATE TRIGGER update_elemental_profiles_updated_at
  BEFORE UPDATE ON elemental_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial survey questions
INSERT INTO survey_questions (text, element, weight) VALUES
  ('How often do you feel driven by passion and inspiration?', 'fire', 1),
  ('How well do you adapt to emotional situations?', 'water', 1),
  ('How grounded do you feel in your daily life?', 'earth', 1),
  ('How much do you value intellectual freedom?', 'air', 1),
  ('How connected do you feel to the spiritual aspects of life?', 'aether', 1)
ON CONFLICT DO NOTHING;