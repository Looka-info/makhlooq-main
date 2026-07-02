ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS awards JSONB DEFAULT '[]'::jsonb;
