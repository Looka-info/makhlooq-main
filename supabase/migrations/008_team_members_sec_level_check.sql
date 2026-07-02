-- Migration: Add CHECK constraint on sec_level for team_members table
-- Drop constraint if exists
ALTER TABLE public.team_members
  DROP CONSTRAINT IF EXISTS team_members_sec_level_check;

-- Normalize any bad values to R0
UPDATE public.team_members
  SET sec_level = 'R0'
  WHERE sec_level NOT IN ('R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6') OR sec_level IS NULL;

-- Add check constraint
ALTER TABLE public.team_members
  ADD CONSTRAINT team_members_sec_level_check
  CHECK (sec_level IN ('R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6'));
