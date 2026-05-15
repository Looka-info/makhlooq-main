import { NextResponse } from 'next/server';

// Proxy to look up a FleetYards fleet by slug for admin validation
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'slug is required' }, { status: 400 });
    }

    const res = await fetch(
      `https://api.fleetyards.net/v1/public/fleets/${encodeURIComponent(slug)}`,
      { headers: { 'Accept': 'application/json' }, next: { revalidate: 60 } }
    );

    if (res.status === 404) {
      return NextResponse.json({ found: false }, { status: 200 });
    }

    if (!res.ok) {
      return NextResponse.json({ found: false, error: `FleetYards ${res.status}` }, { status: 200 });
    }

    const data = await res.json();
    return NextResponse.json({ found: true, fleet: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
