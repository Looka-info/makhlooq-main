-- Migration: Fix fleet_configs — drop unique slug constraint, add missing columns, fix enum
-- Run this in Supabase SQL Editor

-- 1. Drop the UNIQUE constraint on slug so multiple ships of same type can be added
ALTER TABLE public.fleet_configs DROP CONSTRAINT IF EXISTS fleet_configs_slug_key;
ALTER TABLE public.fleet_configs DROP CONSTRAINT IF EXISTS fleet_configs_slug_unique;

-- 2. Add missing columns if they don't exist
ALTER TABLE public.fleet_configs
  ADD COLUMN IF NOT EXISTS fleet_type text NOT NULL DEFAULT 'small';

ALTER TABLE public.fleet_configs
  ADD COLUMN IF NOT EXISTS ceo_name text;

ALTER TABLE public.fleet_configs
  ADD COLUMN IF NOT EXISTS quantity integer NOT NULL DEFAULT 1;

-- 3. If there's an enum constraint on fleet_type, convert it to plain text
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'fleet_configs'
      AND column_name = 'fleet_type'
      AND data_type = 'USER-DEFINED'
  ) THEN
    ALTER TABLE public.fleet_configs ALTER COLUMN fleet_type TYPE text USING fleet_type::text;
  END IF;
END $$;

-- 4. Normalize any bad fleet_type values stored by old code
UPDATE public.fleet_configs SET fleet_type = 'sub_capital' WHERE fleet_type IN ('sub-capital', 'sub capital', 'snub');
UPDATE public.fleet_configs SET fleet_type = 'small' WHERE fleet_type NOT IN ('small', 'medium', 'large', 'sub_capital', 'capital');

-- 5. Add a CHECK constraint going forward
ALTER TABLE public.fleet_configs
  DROP CONSTRAINT IF EXISTS fleet_configs_fleet_type_check;

ALTER TABLE public.fleet_configs
  ADD CONSTRAINT fleet_configs_fleet_type_check
  CHECK (fleet_type IN ('small', 'medium', 'large', 'sub_capital', 'capital'));

