import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireFleetAdmin } from '../../../lib/adminAuth';

// Use service role key for admin operations to bypass RLS, fallback to anon key for local dev
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseKey);

function getEnvFleetConfigs() {
  const raw = process.env.FLEETYARDS_FLEET_SLUGS || process.env.NEXT_PUBLIC_FLEETYARDS_FLEET_SLUGS || '';
  return raw
    .split(',')
    .map(slug => slug.trim())
    .filter(Boolean)
    .map((slug, index) => ({
      id: `env-${slug}`,
      slug,
      display_name: slug,
      enabled: true,
      sort_order: index,
      source: 'env',
    }));
}

// GET — list all fleet configs (ordered by sort_order)
export async function GET(request) {
  try {
    const envConfigs = getEnvFleetConfigs();
    const { data, error } = await supabase
      .from('fleet_configs')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) throw error;
    
    if (data && data.length > 0) {
      // Combine env configs with DB configs, letting DB configs override env configs with the same slug
      const dbSlugs = new Set(data.map(d => d.slug));
      const filteredEnv = envConfigs.filter(env => !dbSlugs.has(env.slug));
      return NextResponse.json([...filteredEnv, ...data]);
    }
    return NextResponse.json(envConfigs);
  } catch (err) {
    if (err?.code !== 'PGRST205') {
      console.error('fleet_configs lookup failed:', err);
    }
    return NextResponse.json(getEnvFleetConfigs());
  }
}

// POST — create new fleet config
export async function POST(request) {
  try {
    const auth = await requireFleetAdmin();
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { slug, display_name, sort_order, enabled, fleet_type, ceo_name, quantity } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: 'slug is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('fleet_configs')
      .insert([{ 
        slug, 
        display_name, 
        sort_order: sort_order || 0, 
        enabled: enabled ?? true,
        fleet_type: fleet_type || 'small',
        ceo_name: ceo_name || null,
        quantity: quantity || 1
      }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('fleet_configs insert failed:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
