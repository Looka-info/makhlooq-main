import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key for admin operations to bypass RLS, fallback to anon key for local dev
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey
);

// GET — list all fleet configs (ordered by sort_order)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('fleet_configs')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST — create new fleet config
export async function POST(request) {
  try {
    const body = await request.json();
    const { slug, display_name, enabled = true, sort_order = 0 } = body;

    if (!slug) {
      return NextResponse.json({ error: 'slug is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('fleet_configs')
      .insert({ slug, display_name: display_name || slug, enabled, sort_order })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
