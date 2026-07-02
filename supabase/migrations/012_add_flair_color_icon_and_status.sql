-- Migration: Add custom flair color, icon columns and simplify status to active/inactive

-- 1. Add custom flair columns
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS flair_color TEXT DEFAULT '#10b981';
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS flair_icon TEXT DEFAULT 'zap';

-- 2. Alter default value of status column to 'active'
ALTER TABLE public.team_members ALTER COLUMN status SET DEFAULT 'active';

-- 3. Migrate existing status values
UPDATE public.team_members
SET status = CASE
  WHEN status IN ('online', 'idle', 'dnd') THEN 'active'
  ELSE 'inactive'
END;
