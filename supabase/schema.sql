-- ============================================================
-- Khalai Makhlooq — Team Members Table
-- Run this SQL in your Supabase SQL Editor
-- ============================================================

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Members table (keyed by Discord UID)
drop table if exists public.team_members cascade;

create table public.team_members (
  id            uuid primary key default uuid_generate_v4(),
  discord_uid   text unique not null,
  discord_tag   text,
  name          text not null,
  role          text default 'Member',
  category      text default 'General',
  avatar_url    text,
  node_color    text default '#10b981',
  bio           text,
  skills        text[] default '{}',
  status        text default 'offline',
  is_admin      boolean default false,
  joined_at     timestamptz default now(),
  updated_at    timestamptz default now()
);

-- 3. Row-level security
alter table public.team_members enable row level security;

drop policy if exists "Public read" on public.team_members;
create policy "Public read" on public.team_members
  for select using (true);

drop policy if exists "Self update" on public.team_members;
create policy "Self update" on public.team_members
  for update using (
    discord_uid = coalesce(
      current_setting('request.jwt.claims', true)::json->'user_metadata'->>'provider_id',
      current_setting('request.jwt.claims', true)::json->'user_metadata'->>'sub'
    )
  );

-- Function to check admin status bypassing RLS to avoid infinite recursion
create or replace function public.is_admin(user_uid text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from team_members
    where discord_uid = user_uid and is_admin = true
  );
$$;

drop policy if exists "Admin full access" on public.team_members;
create policy "Admin full access" on public.team_members
  for all using (
    public.is_admin(
      coalesce(
        current_setting('request.jwt.claims', true)::json->'user_metadata'->>'provider_id',
        current_setting('request.jwt.claims', true)::json->'user_metadata'->>'sub'
      )
    )
  );

-- 4. Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists update_team_members_updated_at on public.team_members;
create trigger update_team_members_updated_at
  before update on public.team_members
  for each row execute function public.update_updated_at();

-- 5. Shared whiteboard table
create table if not exists public.team_whiteboard (
  id text primary key,
  state text,
  updated_at timestamptz default now()
);

alter table public.team_whiteboard enable row level security;

drop policy if exists "Public read" on public.team_whiteboard;
create policy "Public read" on public.team_whiteboard
  for select using (true);

drop policy if exists "Public modify" on public.team_whiteboard;
create policy "Public modify" on public.team_whiteboard
  for all using (true) with check (true);

-- 6. Sample seed data (remove before production)
insert into public.team_members (discord_uid, discord_tag, name, role, category, node_color, bio, skills, status, is_admin)
values
  ('309682434507800578', 'deduke', 'Commander X',    'Fleet Admiral',     'Command',        '#10b981', 'Founder and leader of Khalai Makhlooq.', '{Strategy,Command}',      'online',  true),
  ('222222222222222222', 'Viper#1234',      'Viper',          'Squadron Leader',   'Combat',         '#34d399', 'Elite fighter pilot.',                  '{Dogfighting,Tactics}',   'online',  false),
  ('333333333333333333', 'Nova#5678',       'Nova',           'Operations Officer','Command',        '#6ee7b7', 'Keeps the fleet running.',               '{Logistics,Planning}',    'idle',    false),
  ('444444444444444444', 'Ranger#9012',     'Ranger',         'Explorer',          'Exploration',    '#a78bfa', 'Charts new systems.',                    '{Navigation,Scouting}',   'online',  false),
  ('555555555555555555', 'Echo#3456',       'Echo',           'Comms Officer',     'Communications', '#f59e0b', 'Manages all comms.',                     '{Radio,Coordination}',    'dnd',     false);
