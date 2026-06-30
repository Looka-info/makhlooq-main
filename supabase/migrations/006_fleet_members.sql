-- Migration: Create fleet_members table
-- Run this in your Supabase SQL Editor to support assigning crew members to ship configurations.

CREATE TABLE IF NOT EXISTS public.fleet_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fleet_config_id INTEGER NOT NULL REFERENCES public.fleet_configs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'Member',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fleet_members ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Fleet members are viewable by everyone"
  ON public.fleet_members FOR SELECT
  USING (true);

-- Authenticated users can modify (further restricted by app-level admin check)
CREATE POLICY "Authenticated users can insert fleet members"
  ON public.fleet_members FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update fleet members"
  ON public.fleet_members FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete fleet members"
  ON public.fleet_members FOR DELETE
  TO authenticated
  USING (true);
