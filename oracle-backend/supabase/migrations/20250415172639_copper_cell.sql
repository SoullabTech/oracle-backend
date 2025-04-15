/*
  # Survey and Profile Tables

  1. New Tables
    - `survey_questions`
      - `id` (uuid, primary key)
      - `text` (text, question text)
      - `element` (text, associated element)
      - `weight` (integer, question weight)
      - `created_at` (timestamp)
    
    - `survey_responses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `question_id` (text, foreign key to survey_questions)
      - `answer` (integer, 1-5 scale)
      - `created_at` (timestamp)
    
    - `elemental_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `fire` (integer, 0-100 score)
      - `water` (integer, 0-100 score)
      - `earth` (integer, 0-100 score)
      - `air` (integer, 0-100 score)
      - `aether` (integer, 0-100 score)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
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
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  question_id text NOT NULL,
  answer integer NOT NULL CHECK (answer BETWEEN 1 AND 5),
  created_at timestamptz DEFAULT now()
);

-- Create elemental_profiles table
CREATE TABLE IF NOT EXISTS elemental_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  fire integer NOT NULL CHECK (fire BETWEEN 0 AND 100),
  water integer NOT NULL CHECK (water BETWEEN 0 AND 100),
  earth integer NOT NULL CHECK (earth BETWEEN 0 AND 100),
  air integer NOT NULL CHECK (air BETWEEN 0 AND 100),
  aether integer NOT NULL CHECK (aether BETWEEN 0 AND 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
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
  ('How connected do you feel to the spiritual aspects of life?', 'aether', 1);