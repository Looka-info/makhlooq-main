import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const ALLOWED_HOSTS = new Set(['api.fleetyards.net', 'fleetyards.net', 'storage.fltyrd.net']);

const getContentType = (url, fallback = 'application/octet-stream') => {
  const path = new URL(url).pathname.toLowerCase();
  if (path.endsWith('.gltf')) return 'model/gltf+json';
  if (path.endsWith('.glb')) return 'model/gltf-binary';
  if (path.endsWith('.bin')) return 'application/octet-stream';
  if (path.endsWith('.png')) return 'image/png';
  if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg';
  if (path.endsWith('.webp')) return 'image/webp';
  return fallback;
};

const proxyUrl = (assetUrl) => `/api/fleetyards/model-proxy?url=${encodeURIComponent(assetUrl)}`;

const rewriteAssetUris = (gltf, sourceUrl) => {
  const rewrite = (item) => {
    if (!item?.uri || item.uri.startsWith('data:') || item.uri.startsWith('blob:')) return;
    item.uri = proxyUrl(new URL(item.uri, sourceUrl).toString());
  };

  gltf.buffers?.forEach(rewrite);
  gltf.images?.forEach(rewrite);
  return gltf;
};

export async function GET(request) {
  try {
    const requestUrl = new URL(request.url);
    const rawUrl = requestUrl.searchParams.get('url');

    if (!rawUrl) {
      return NextResponse.json({ error: 'Missing asset url' }, { status: 400 });
    }

    const targetUrl = new URL(rawUrl);
    if (targetUrl.protocol !== 'https:' || !ALLOWED_HOSTS.has(targetUrl.hostname)) {
      return NextResponse.json({ error: 'Blocked asset host' }, { status: 400 });
    }

    const response = await fetch(targetUrl.toString(), {
      headers: { Accept: '*/*' },
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Fleetyards asset error (${response.status})` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type') || getContentType(targetUrl.toString());
    const isGltf = contentType.includes('json') || targetUrl.pathname.toLowerCase().endsWith('.gltf');

    if (isGltf) {
      const text = await response.text();
      const gltf = rewriteAssetUris(JSON.parse(text), response.url || targetUrl.toString());
      return new NextResponse(JSON.stringify(gltf), {
        headers: {
          'Content-Type': 'model/gltf+json; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      });
    }

    const bytes = await response.arrayBuffer();
    return new NextResponse(bytes, {
      headers: {
        'Content-Type': getContentType(targetUrl.toString(), contentType),
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || 'Failed to proxy Fleetyards asset' },
      { status: 500 }
    );
  }
}
