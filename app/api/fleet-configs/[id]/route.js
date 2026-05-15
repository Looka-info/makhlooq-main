import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key for admin operations to bypass RLS, fallback to anon key for local dev
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey
);

// PUT — update a fleet config
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { slug, display_name, enabled, sort_order } = body;

    const updates = {};
    if (slug !== undefined) updates.slug = slug;
    if (display_name !== undefined) updates.display_name = display_name;
    if (enabled !== undefined) updates.enabled = enabled;
    if (sort_order !== undefined) updates.sort_order = sort_order;

    const { data, error } = await supabase
      .from('fleet_configs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE — remove a fleet config
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const { error } = await supabase
      .from('fleet_configs')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
