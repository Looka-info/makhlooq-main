import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireFleetAdmin } from '../../../lib/adminAuth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  const { data, error } = await supabase
    .from('about_settings')
    .select('*')
    .limit(1)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || {});
}

export async function POST(request) {
  const auth = await requireFleetAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await request.json();
  const draft = {
    id: 'main',
    bridge_heading: body.bridge_heading?.trim() || null,
    bridge_subtitle: body.bridge_subtitle?.trim() || null,
    bridge_background_url: body.bridge_background_url?.trim() || null,
    archives_background_url: body.archives_background_url?.trim() || null,
    archives_intro_year: body.archives_intro_year?.trim() || null,
    archives_intro_title: body.archives_intro_title?.trim() || null,
    archives_intro_desc: body.archives_intro_desc?.trim() || null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('about_settings')
    .upsert(draft, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
