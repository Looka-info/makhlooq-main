-- Migration: Update flairs (role) and ranks (category) for team_members table

-- 1. Alter default for role column to 'KMHQ'
ALTER TABLE public.team_members 
  ALTER COLUMN role SET DEFAULT 'KMHQ';

-- 2. Alter default for category column to 'Makhlooq'
ALTER TABLE public.team_members 
  ALTER COLUMN category SET DEFAULT 'Makhlooq';

-- 3. Normalize category (Rank) values
UPDATE public.team_members
SET category = CASE 
  WHEN category = 'FIELD MARSHAL - C3' THEN 'Field Marshal'
  WHEN category = 'GENERAL - C2' THEN 'General'
  WHEN category = 'COMMANDER - C1' THEN 'Commander'
  WHEN category = 'COLONEL - O5' THEN 'Colonel'
  WHEN category = 'MAJOR - O4' THEN 'Major'
  WHEN category = 'CAPTAIN - O3' THEN 'Captain'
  WHEN category = 'OFFICER - O2' THEN 'Officer'
  WHEN category = 'LIEUTENANT - O1' THEN 'Lieutenant'
  WHEN category = 'SERGEANT - E5' THEN 'Sergeant'
  WHEN category = 'CORPORAL - E4' THEN 'Corporal'
  WHEN category = 'SOLDIER - E3' THEN 'Soldier'
  WHEN category = 'CITIZEN - E2' THEN 'Citizen'
  WHEN category = 'MAKHLOOQ- E1' THEN 'Makhlooq'
  ELSE category
END;

-- 4. Map existing roles to flairs based on ranks and admin status
UPDATE public.team_members
SET role = CASE
  WHEN discord_uid = '814571007804833852' THEN 'Quaid - Founder'
  WHEN discord_uid = '309682434507800578' THEN 'High Council'
  WHEN discord_uid = '809731733791440926' THEN 'High Council'
  WHEN discord_uid = '287992090619805697' THEN 'Advisor'
  ELSE 'KMHQ'
END;
