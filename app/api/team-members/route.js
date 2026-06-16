import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireFleetAdmin } from '../../../lib/adminAuth';

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, supabaseKey);

export async function GET() {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('joined_at');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request) {
  const auth = await requireFleetAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await request.json();
  const { data, error } = await supabase
    .from('team_members')
    .insert(body)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

