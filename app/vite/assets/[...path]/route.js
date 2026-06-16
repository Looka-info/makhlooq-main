import { NextResponse } from 'next/server';

const FLEETYARDS_ASSET_BASE = 'https://fleetyards.net/vite/assets';

const CONTENT_TYPES = {
  css: 'text/css; charset=utf-8',
  js: 'application/javascript; charset=utf-8',
  map: 'application/json; charset=utf-8',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  svg: 'image/svg+xml',
  webp: 'image/webp',
  woff: 'font/woff',
  woff2: 'font/woff2',
};

function getContentType(path) {
  const extension = path.split('.').pop()?.toLowerCase();
  return CONTENT_TYPES[extension] || 'application/octet-stream';
}

export async function GET(_request, { params }) {
  try {
    const path = params.path?.join('/');

    if (!path || path.includes('..')) {
      return NextResponse.json({ error: 'Invalid asset path' }, { status: 400 });
    }

    const response = await fetch(`${FLEETYARDS_ASSET_BASE}/${path}`, {
      headers: { Accept: '*/*' },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `FleetYards asset not found (${response.status})` },
        { status: response.status }
      );
    }

    const body = await response.arrayBuffer();

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('content-type') || getContentType(path),
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || 'Unable to proxy FleetYards asset' },
      { status: 500 }
    );
  }
}
