/*
  # Create Survey Tables

  1. New Tables
    - survey_questions
      - id (uuid, primary key)
      - text (text)
      - element (text)
      - weight (integer)
      - created_at (timestamptz)
    
    - survey_responses
      - id (uuid, primary key)
      - user_id (uuid, references auth.users)
      - question_id (uuid, references survey_questions)
      - answer (integer, 1-5)
      - created_at (timestamptz)
    
    - elemental_profiles
      - id (uuid, primary key)
      - user_id (uuid, references auth.users)
      - fire (integer, 0-100)
      - water (integer, 0-100)
      - earth (integer, 0-100)
      - air (integer, 0-100)
      - aether (integer, 0-100)
      - crystal_focus (jsonb)
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add constraints for data validation
*/

-- Create survey_questions table
CREATE TABLE IF NOT EXISTS survey_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  element text NOT NULL CHECK (element IN ('fire', 'water', 'earth', 'air', 'aether')),
  weight integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Create survey_responses table
CREATE TABLE IF NOT EXISTS survey_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id uuid REFERENCES survey_questions(id) ON DELETE CASCADE,
  answer integer NOT NULL CHECK (answer BETWEEN 1 AND 5),
  created_at timestamptz DEFAULT now()
);

-- Create elemental_profiles table
CREATE TABLE IF NOT EXISTS elemental_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  fire integer NOT NULL CHECK (fire BETWEEN 0 AND 100),
  water integer NOT NULL CHECK (water BETWEEN 0 AND 100),
  earth integer NOT NULL CHECK (earth BETWEEN 0 AND 100),
  air integer NOT NULL CHECK (air BETWEEN 0 AND 100),
  aether integer NOT NULL CHECK (aether BETWEEN 0 AND 100),
  crystal_focus jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add check constraint to validate crystal_focus structure
ALTER TABLE elemental_profiles ADD CONSTRAINT valid_crystal_focus CHECK (
  (crystal_focus->>'type')::text = ANY(ARRAY['career', 'spiritual', 'relational', 'health', 'creative', 'other']) AND
  crystal_focus->>'challenges' IS NOT NULL AND
  crystal_focus->>'aspirations' IS NOT NULL AND
  (
    (crystal_focus->>'type')::text != 'other' OR
    (
      crystal_focus->>'type' = 'other' AND
      crystal_focus->>'customDescription' IS NOT NULL
    )
  )
);

-- Enable Row Level Security
ALTER TABLE survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE elemental_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for survey_questions
CREATE POLICY "Anyone can read survey questions"
  ON survey_questions
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for survey_responses
CREATE POLICY "Users can create own responses"
  ON survey_responses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own responses"
  ON survey_responses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for elemental_profiles
CREATE POLICY "Users can insert own profile"
  ON elemental_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own profile"
  ON elemental_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON elemental_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger for elemental_profiles
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

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
  ('How connected do you feel to the spiritual aspects of life?', 'aether', 1),
  ('How comfortable are you taking bold action?', 'fire', 1),
  ('How deeply do you connect with others'' emotions?', 'water', 1),
  ('How well do you maintain healthy routines?', 'earth', 1),
  ('How much do you enjoy exploring new ideas?', 'air', 1),
  ('How often do you reflect on life''s deeper meaning?', 'aether', 1);