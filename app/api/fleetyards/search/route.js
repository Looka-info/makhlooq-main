import { NextResponse } from 'next/server';

// Proxy to look up a FleetYards fleet or ship model by slug for admin validation
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'slug is required' }, { status: 400 });
    }

    const fleetUrl = `https://api.fleetyards.net/v1/public/fleets/${encodeURIComponent(slug)}`;
    const statsUrl = `https://api.fleetyards.net/v1/public/fleets/${encodeURIComponent(slug)}/stats/members`;
    const headers = { Accept: 'application/json' };
    const res = await fetch(fleetUrl, { headers, next: { revalidate: 60 } });

    if (res.ok) {
      const data = await res.json();
      const statsRes = await fetch(statsUrl, { headers, next: { revalidate: 60 } });
      const memberStats = statsRes.ok ? await statsRes.json() : null;

      return NextResponse.json({
        found: true,
        type: 'fleet',
        fleet: {
          ...data,
          memberCount: memberStats?.total,
        },
      });
    }

    const modelRes = await fetch(`https://api.fleetyards.net/v1/models/${encodeURIComponent(slug)}`, {
      headers,
      next: { revalidate: 60 },
    });

    if (modelRes.ok) {
      const model = await modelRes.json();
      return NextResponse.json({
        found: true,
        type: 'model',
        fleet: {
          slug: model.slug,
          name: model.name,
          memberCount: 1,
        },
        model,
      });
    }

    if (res.status === 404 && modelRes.status === 404) {
      return NextResponse.json({ found: false }, { status: 200 });
    }

    return NextResponse.json({ found: false, error: `FleetYards ${res.status}/${modelRes.status}` }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
