/*
  # Initial Schema Setup

  1. New Tables
    - `auth.users`: Core user authentication table (managed by Supabase)
    - `public.users`: Extended user profile data
      - `id` (uuid, primary key) - References auth.users
      - `email` (text, unique)
      - `created_at` (timestamptz)
      - `last_login` (timestamptz)
    
    - `public.memories`: User memories
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `content` (text)
      - `metadata` (jsonb)
      - `created_at` (timestamptz)
    
    - `public.sessions`: User sessions
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `started_at` (timestamptz)
      - `ended_at` (timestamptz)
      - `status` (text)
      - `metadata` (jsonb)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Create public.users table
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create memories table
CREATE TABLE IF NOT EXISTS public.memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own memories"
  ON public.memories
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Create sessions table
CREATE TABLE IF NOT EXISTS public.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  status text DEFAULT 'active',
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own sessions"
  ON public.sessions
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());