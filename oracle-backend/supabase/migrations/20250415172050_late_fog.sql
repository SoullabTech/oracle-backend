/*
  # Survey System Tables

  1. New Tables
    - `elemental_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `fire` (integer)
      - `water` (integer)
      - `earth` (integer)
      - `air` (integer)
      - `aether` (integer)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

    - `survey_responses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `question_id` (text)
      - `answer` (integer)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to:
      - Read their own profiles and responses
      - Create and update their own profiles
      - Create their own responses
*/

-- Create elemental_profiles table
CREATE TABLE IF NOT EXISTS elemental_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  fire integer NOT NULL CHECK (fire BETWEEN 0 AND 100),
  water integer NOT NULL CHECK (water BETWEEN 0 AND 100),
  earth integer NOT NULL CHECK (earth BETWEEN 0 AND 100),
  air integer NOT NULL CHECK (air BETWEEN 0 AND 100),
  aether integer NOT NULL CHECK (aether BETWEEN 0 AND 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create survey_responses table
CREATE TABLE IF NOT EXISTS survey_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  question_id text NOT NULL,
  answer integer NOT NULL CHECK (answer BETWEEN 1 AND 5),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE elemental_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Policies for elemental_profiles
CREATE POLICY "Users can view own profile"
  ON elemental_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own profile"
  ON elemental_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON elemental_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for survey_responses
CREATE POLICY "Users can view own responses"
  ON survey_responses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own responses"
  ON survey_responses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);