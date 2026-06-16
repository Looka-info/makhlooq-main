import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { fetchDiscordMembers, mapDiscordStatus } from '../../../../lib/discord';
import { requireFleetAdmin } from '../../../../lib/adminAuth';

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, supabaseKey);

export async function POST(request) {
  try {
    const auth = await requireFleetAdmin();
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // 1. Fetch live members from Discord
    const discordMembers = await fetchDiscordMembers();
    
    if (!discordMembers || discordMembers.length === 0) {
      return NextResponse.json({ error: 'No Discord members found or API error' }, { status: 500 });
    }

    // 2. Fetch existing roster from Supabase
    const { data: existingMembers, error: fetchError } = await supabase
      .from('team_members')
      .select('id, discord_uid');

    if (fetchError) throw fetchError;

    const updates = [];
    
    // 3. Map Discord data to Supabase updates
    for (const dm of discordMembers) {
      const { user, nick, roles, presence } = dm;
      const uid = user.id;
      
      const existing = existingMembers.find(m => m.discord_uid === uid);
      
      if (existing) {
        // Update status, avatar, and possibly name if not set
        updates.push(
          supabase
            .from('team_members')
            .update({
              status: mapDiscordStatus(presence?.status),
              avatar_url: `https://cdn.discordapp.com/avatars/${uid}/${user.avatar}.png`,
              discord_tag: `${user.username}#${user.discriminator}`,
              // Update name only if it's the first sync or we want to sync nicks
              // name: nick || user.username, 
            })
            .eq('discord_uid', uid)
        );
      }
    }

    // Execute all updates
    await Promise.all(updates);

    return NextResponse.json({ 
      success: true, 
      synced: updates.length,
      totalDiscord: discordMembers.length 
    });
  } catch (error) {
    console.error('Sync Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
