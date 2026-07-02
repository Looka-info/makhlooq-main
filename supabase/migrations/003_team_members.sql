-- Create team_members table if it doesn't exist
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  handle TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'Officer',
  category TEXT DEFAULT 'MAKHLOOQ- E1',
  sec_level TEXT DEFAULT 'R0',
  avatar_url TEXT,
  discord_tag TEXT,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public Read Access" ON team_members
  FOR SELECT USING (true);

-- Admin write access (simplified for now)
CREATE POLICY "Admin Write Access" ON team_members
  FOR ALL USING (true);
