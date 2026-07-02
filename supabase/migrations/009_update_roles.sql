-- Migration: Update role values and default value for team_members table

-- 1. Normalize existing roles to new roles
UPDATE public.team_members
  SET role = 'Field Marshal'
  WHERE role = 'Fleet Admiral';

UPDATE public.team_members
  SET role = 'Officer'
  WHERE role = 'Member' OR role IS NULL OR role NOT IN ('Field Marshal', 'General', 'Commander', 'Colonel', 'Major', 'Captain', 'Officer');

-- 2. Alter column default for role to 'Officer'
ALTER TABLE public.team_members 
  ALTER COLUMN role SET DEFAULT 'Officer';
