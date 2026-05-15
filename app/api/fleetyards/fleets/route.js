import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '1';
    const perPage = url.searchParams.get('perPage') || '50';

    const targetUrl = `https://api.fleetyards.net/v1/public/fleets?page=${encodeURIComponent(page)}&perPage=${encodeURIComponent(perPage)}`;
    const response = await fetch(targetUrl, { method: 'GET' });
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || `Fleetyards API error (${response.status})` },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error?.message || 'Unexpected fetch error' }, { status: 500 });
  }
}
