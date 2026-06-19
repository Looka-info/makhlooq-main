-- Create the About page settings table for editable page content
create table if not exists about_settings (
  id text primary key,
  bridge_heading text,
  bridge_subtitle text,
  bridge_background_url text,
  archives_background_url text,
  archives_intro_year text,
  archives_intro_title text,
  archives_intro_desc text,
  updated_at timestamptz default now()
);

alter table about_settings enable row level security;

drop policy if exists "Public Read Access" on about_settings;
create policy "Public Read Access" on about_settings
  for select using (true);

drop policy if exists "Admin Insert Access" on about_settings;
create policy "Admin Insert Access" on about_settings
  for insert with check (
    public.is_admin(
      current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

drop policy if exists "Admin Update Access" on about_settings;
create policy "Admin Update Access" on about_settings
  for update using (
    public.is_admin(
      current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );
