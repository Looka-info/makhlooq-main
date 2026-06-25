import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

function loadEnv() {
  for (const file of ['.env', '.env.local']) {
    const filePath = path.resolve(process.cwd(), file)
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8')
      content.split('\n').forEach((line) => {
        const parts = line.split('=')
        if (parts.length >= 2) {
          const key = parts[0].trim()
          let val = parts.slice(1).join('=').trim()
          if (val.startsWith('"') && val.endsWith('"')) {
            val = val.substring(1, val.length - 1)
          }
          if (val.startsWith("'") && val.endsWith("'")) {
            val = val.substring(1, val.length - 1)
          }
          process.env[key] = val
        }
      })
    }
  }
}
loadEnv()

import { sanityWriteClient } from '../sanity/lib/client'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function migrate() {
  console.log('Starting migration...')
  const { data: posts, error } = await supabase.from('about_news').select('*')
  
  if (error) {
    console.error('Error fetching from Supabase:', error)
    return
  }

  console.log(`Found ${posts?.length || 0} posts to migrate.`)

  for (const post of posts ?? []) {
    const slugSource = post.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `news-${post.id}`
    
    // Check if document already exists to prevent duplicate entries
    const existing = await sanityWriteClient.fetch(
      `*[_type == "newsPost" && slug.current == $slug][0]`,
      { slug: slugSource }
    )

    if (existing) {
      console.log(`ℹ️ News post "${post.title}" already exists in Sanity. Skipping.`)
      continue
    }

    try {
      const doc: any = {
        _type: 'newsPost',
        title: post.title,
        slug: { _type: 'slug', current: slugSource },
        publishedAt: post.published_at ? new Date(post.published_at).toISOString() : new Date().toISOString(),
        body: [{
          _type: 'block',
          _key: `body-${post.id}`,
          style: 'normal',
          children: [{
            _type: 'span',
            _key: `span-${post.id}`,
            text: post.body
          }],
          markDefs: []
        }],
        category: 'Operation', // default category
        authorHandle: 'BRIDGE' // default author RSI handle
      }

      if (post.media_url) {
        if (post.media_type === 'video') {
          doc.body.push({
            _type: 'videoEmbed',
            _key: `video-${post.id}`,
            url: post.media_url
          })
        } else if (post.media_type === 'image') {
          doc.body[0].children.push({
            _type: 'span',
            _key: `media-link-${post.id}`,
            text: `\n\n[Media Link: ${post.media_url}]`
          })
        }
      }

      await sanityWriteClient.create(doc)
      console.log(`✅ Migrated: ${post.title}`)
    } catch (err) {
      console.error(`❌ Failed to migrate: ${post.title}`, err)
    }
  }
  console.log('Migration complete.')
}

migrate()
