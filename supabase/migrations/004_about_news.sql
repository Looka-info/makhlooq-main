-- Create the about_news table for About page news entries
CREATE TABLE IF NOT EXISTS about_news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  media_url TEXT,
  media_type TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE about_news ENABLE ROW LEVEL SECURITY;

drop policy if exists "Public Read Access" on about_news;
create policy "Public Read Access" on about_news
  for select using (true);

drop policy if exists "Admin Write Access" on about_news;
create policy "Admin Write Access" on about_news
  for all using (true);
