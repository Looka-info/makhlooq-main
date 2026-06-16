-- FleetYards fleet registry for the public Fleet page.
-- Stores real public FleetYards fleet slugs. No seeded/fake fleet data.

create table if not exists public.fleet_configs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  display_name text,
  enabled boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.fleet_configs enable row level security;

drop policy if exists "Fleet configs are viewable by everyone" on public.fleet_configs;
create policy "Fleet configs are viewable by everyone"
  on public.fleet_configs for select
  using (true);

drop policy if exists "Authenticated users can insert fleet configs" on public.fleet_configs;
create policy "Authenticated users can insert fleet configs"
  on public.fleet_configs for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update fleet configs" on public.fleet_configs;
create policy "Authenticated users can update fleet configs"
  on public.fleet_configs for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users can delete fleet configs" on public.fleet_configs;
create policy "Authenticated users can delete fleet configs"
  on public.fleet_configs for delete
  to authenticated
  using (true);

create or replace function public.update_fleet_configs_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists update_fleet_configs_updated_at on public.fleet_configs;
create trigger update_fleet_configs_updated_at
  before update on public.fleet_configs
  for each row
  execute function public.update_fleet_configs_updated_at();
