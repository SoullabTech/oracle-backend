/*
  # Add Crystal Focus to Elemental Profiles

  1. Changes
    - Add crystal_focus column to elemental_profiles table
    - Add crystal_focus_type enum type for validation
    - Add check constraint for crystal_focus_type values

  2. Security
    - No changes to RLS policies needed
*/

-- Create enum type for crystal focus
CREATE TYPE crystal_focus_type AS ENUM (
  'career',
  'spiritual',
  'relational',
  'health',
  'creative',
  'other'
);

-- Add crystal_focus column to elemental_profiles
ALTER TABLE elemental_profiles ADD COLUMN IF NOT EXISTS crystal_focus jsonb DEFAULT '{}'::jsonb;

-- Add check constraint to validate crystal_focus structure
ALTER TABLE elemental_profiles ADD CONSTRAINT valid_crystal_focus CHECK (
  (crystal_focus->>'type')::text = ANY(enum_range(NULL::crystal_focus_type)::text[]) AND
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