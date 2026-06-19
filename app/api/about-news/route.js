import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireFleetAdmin } from '../../../lib/adminAuth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  const { data, error } = await supabase
    .from('about_news')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

export async function POST(request) {
  const auth = await requireFleetAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const contentType = request.headers.get('content-type') || '';
  let title;
  let newsBody;
  let mediaUrl;
  let mediaType;
  let mediaFile;

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    title = String(formData.get('title') || '');
    newsBody = String(formData.get('body') || '');
    mediaUrl = String(formData.get('media_url') || '').trim() || null;
    mediaType = String(formData.get('media_type') || '').trim() || null;
    mediaFile = formData.get('media_file');
  } else {
    const body = await request.json();
    title = String(body.title || '');
    newsBody = String(body.body || '');
    mediaUrl = String(body.media_url || '').trim() || null;
    mediaType = String(body.media_type || '').trim() || null;
  }

  if (!title?.trim() || !newsBody?.trim()) {
    return NextResponse.json({ error: 'Title and body are required.' }, { status: 400 });
  }

  const allowedMediaTypes = ['image', 'video', 'link'];
  let normalizedMediaType = null;
  let storedMediaUrl = mediaUrl;

  if (mediaFile && typeof mediaFile !== 'string' && typeof mediaFile.arrayBuffer === 'function') {
    if (!mediaType || !['image', 'video'].includes(mediaType)) {
      return NextResponse.json({ error: 'Media type must be image or video when uploading a file.' }, { status: 400 });
    }

    const ext = String(mediaFile.name || '').split('.').pop() || (mediaType === 'image' ? 'png' : 'mp4');
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const path = `about-news/${fileName}`;
    const bytes = Buffer.from(await mediaFile.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, bytes, { contentType: mediaFile.type || (mediaType === 'image' ? 'image/png' : 'video/mp4'), upsert: true });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: publicData } = supabase.storage.from('avatars').getPublicUrl(path);
    storedMediaUrl = publicData?.publicUrl || null;
    normalizedMediaType = mediaType;
  } else if (mediaUrl) {
    if (mediaType && allowedMediaTypes.includes(mediaType)) {
      normalizedMediaType = mediaType;
    } else {
      const url = mediaUrl.trim().toLowerCase();
      if (url.match(/\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/)) normalizedMediaType = 'image';
      else if (url.match(/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/)) normalizedMediaType = 'video';
      else normalizedMediaType = 'link';
    }
  }

  const { data, error } = await supabase
    .from('about_news')
    .insert({
      title: title.trim(),
      body: newsBody.trim(),
      media_url: storedMediaUrl ? storedMediaUrl.trim() : null,
      media_type: normalizedMediaType,
      published_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
