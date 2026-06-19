-- Create the about_news table for About page news entries
CREATE TABLE IF NOT EXISTS about_news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE about_news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Access" ON about_news
  FOR SELECT USING (true);

CREATE POLICY "Admin Write Access" ON about_news
  FOR ALL USING (true);
