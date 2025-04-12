/*
  # Initial Database Schema

  1. Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - created_at (timestamp)
      - last_login (timestamp)
    
    - memories
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - content (text)
      - created_at (timestamp)
      - metadata (jsonb)
    
    - sessions
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - started_at (timestamp)
      - ended_at (timestamp)
      - status (text)
      - metadata (jsonb)

  2. Security
    - Enable RLS on all tables
    - Add policies for user data access
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Memories table
CREATE TABLE IF NOT EXISTS memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own memories"
  ON memories
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  status text DEFAULT 'active',
  metadata jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own sessions"
  ON sessions
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());