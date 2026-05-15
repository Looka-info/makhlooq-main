-- Fleet Ships table for managing fleet assets via admin panel
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS fleet_ships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ship_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  manufacturer TEXT DEFAULT '',
  ship_class TEXT DEFAULT '',
  role TEXT DEFAULT '',
  crew TEXT DEFAULT '',
  length TEXT DEFAULT '',
  mass TEXT DEFAULT '',
  cargo TEXT DEFAULT '',
  top_speed TEXT DEFAULT '',
  description TEXT DEFAULT '',
  model_path TEXT DEFAULT '',
  thumbnail TEXT DEFAULT '',
  mesh_type TEXT DEFAULT 'medium' CHECK (mesh_type IN ('capital', 'fighter', 'explorer', 'medium', 'industrial', 'luxury')),
  accent_color TEXT DEFAULT '#00ff0dff',
  weapons TEXT DEFAULT '',
  features TEXT DEFAULT '',
  shield_pct INTEGER DEFAULT 50,
  armor_pct INTEGER DEFAULT 50,
  firepower_pct INTEGER DEFAULT 50,
  speed_pct INTEGER DEFAULT 50,
  stealth_pct INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE fleet_ships ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Fleet ships are viewable by everyone"
  ON fleet_ships FOR SELECT
  USING (true);

-- Only authenticated users can modify (further restricted by app-level admin check)
CREATE POLICY "Authenticated users can insert fleet ships"
  ON fleet_ships FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update fleet ships"
  ON fleet_ships FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete fleet ships"
  ON fleet_ships FOR DELETE
  TO authenticated
  USING (true);

-- Seed with default fleet data
INSERT INTO fleet_ships (ship_id, name, manufacturer, ship_class, role, crew, length, mass, cargo, top_speed, description, model_path, thumbnail, mesh_type, accent_color, weapons, features, shield_pct, armor_pct, firepower_pct, speed_pct, stealth_pct) VALUES
  ('idris', 'Aegis Idris-P', 'Aegis Dynamics', 'Capital Corvette', 'Command & Control', '10-12', '236m', '3,700,000 kg', '228 SCU', '155 m/s', 'The crown jewel of the fleet.', '/models/ships/idris.glb', '', 'capital', '#00f3ff', '8× S4, 4× S5, 1× S10', 'Command Bridge,Fighter Bay,Medbay,Armory,Brig', 95, 90, 98, 20, 8),
  ('f8c', 'Anvil F8C Lightning', 'Anvil Aerospace', 'Heavy Fighter', 'Space Superiority', '1', '22m', '28,000 kg', '3 SCU', '280 m/s', 'Elite dogfighter for air superiority.', '/models/ships/f8c.glb', '', 'fighter', '#ff3366', '4× S3, 2× S4', 'Ejection Seat,Advanced Avionics,Stealth Coating,Afterburner', 55, 50, 75, 95, 35),
  ('aquila', 'RSI Constellation Aquila', 'Roberts Space Industries', 'Multi-Role Explorer', 'Deep Space Exploration', '4-5', '61m', '190,000 kg', '96 SCU', '150 m/s', 'Long-range exploration vessel.', '/models/ships/aquila.glb', '', 'explorer', '#ffaa00', '4× S2, 2× S4, P-52 Merlin', 'Cartography Suite,Rover Bay,Snub Fighter,Long Range Scanners', 70, 55, 50, 45, 50),
  ('cutlass', 'Drake Cutlass Black', 'Drake Interplanetary', 'Medium Freighter', 'Multi-Role / Cargo', '2-3', '50m', '88,000 kg', '48 SCU', '180 m/s', 'Versatile workhorse for cargo runs.', '/models/ships/cutlass.glb', '', 'medium', '#44ff88', '4× S2, 2× S3', 'Rear Ramp,Tractor Beam,Side Turret,Modular Cargo', 50, 55, 45, 70, 40),
  ('reclaimer', 'Aegis Reclaimer', 'Aegis Dynamics', 'Industrial Capital', 'Salvage Operations', '5-8', '155m', '2,800,000 kg', '3680 SCU', '110 m/s', 'Ultimate salvage platform.', '/models/ships/reclaimer.glb', '', 'industrial', '#ff8800', '2× S5 Turrets', 'Salvage Arms,Processing Plant,Drone Bay,Crew Quarters,Cargo Hold', 80, 85, 20, 10, 5),
  ('600i', 'Origin 600i Explorer', 'Origin Jumpworks', 'Luxury Explorer', 'Luxury / Exploration', '3-5', '91m', '420,000 kg', '40 SCU', '195 m/s', 'Performance meets opulence.', '/models/ships/600i.glb', '', 'luxury', '#aa88ff', '3× S3, 2× S5 Turrets', 'Panoramic Bridge,VIP Quarters,Bar & Lounge,Scanning Suite', 72, 60, 55, 50, 30)
ON CONFLICT (ship_id) DO NOTHING;
