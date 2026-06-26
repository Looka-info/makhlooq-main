import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { clearAdminSessionCookie, isEnvAdminDiscordId, setAdminSessionCookie } from '../../../../../lib/adminAuth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseKey);

function sanitizeReturnTo(value) {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : '/team';
}

function redirectTo(request, returnTo, params = {}) {
  const baseUrl = getBaseUrl(request);
  const url = new URL(sanitizeReturnTo(returnTo), baseUrl);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  return NextResponse.redirect(url);
}

function requiresAdmin(returnTo) {
  return ['/fleet/admin', '/team/admin'].some(path => sanitizeReturnTo(returnTo).startsWith(path));
}

function getBaseUrl(request) {
  let url = new URL(request.url).origin;
  if (url.endsWith('/')) url = url.slice(0, -1);
  return url;
}

async function exchangeCode(request, code) {
  const clientId = process.env.DISCORD_CLIENT_ID || process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = `${getBaseUrl(request)}/api/auth/discord/callback`;

  if (!clientId || !clientSecret) {
    throw new Error('DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET are required');
  }

  const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenRes.ok) throw new Error(`Discord token exchange failed: ${tokenRes.status}`);
  return tokenRes.json();
}

async function fetchDiscordUser(accessToken) {
  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!userRes.ok) throw new Error(`Discord user lookup failed: ${userRes.status}`);
  return userRes.json();
}

async function isGuildMember(discordId) {
  const botToken = process.env.DISCORD_BOT_TOKEN;
  const guildId = process.env.DISCORD_GUILD_ID;

  if (!botToken || !guildId) {
    throw new Error('DISCORD_BOT_TOKEN and DISCORD_GUILD_ID are required');
  }

  const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${discordId}`, {
    headers: { Authorization: `Bot ${botToken}` },
  });

  return res.ok;
}

async function isAdmin(discordId) {
  if (isEnvAdminDiscordId(discordId)) return true;

  const { data } = await supabase
    .from('team_members')
    .select('is_admin')
    .eq('discord_uid', discordId)
    .maybeSingle();

  return !!data?.is_admin;
}

/**
 * Auto-upsert the Discord user into team_members if they don't exist yet.
 * New users start with is_approved = false so they're hidden from public roster.
 * Existing members are left untouched (no overwrite of their data).
 */
async function autoRegisterMember(user, isEnvAdmin = false) {
  try {
    const { data: existing } = await supabase
      .from('team_members')
      .select('id')
      .eq('discord_uid', user.id)
      .maybeSingle();

    if (!existing) {
      const avatarUrl = user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
        : null;

      await supabase.from('team_members').insert({
        discord_uid: user.id,
        discord_tag: user.username,
        name: user.global_name || user.username,
        avatar_url: avatarUrl,
        role: isEnvAdmin ? 'Commander' : 'Member',
        is_admin: isEnvAdmin,
        is_approved: isEnvAdmin, // Env admins are auto-approved; others wait for review
        joined_at: new Date().toISOString(),
      });
    }
  } catch (err) {
    // Non-fatal — log but don't block login
    console.warn('autoRegisterMember failed:', err);
  }
}

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const expectedState = request.cookies.get('kmhq_discord_oauth_state')?.value;
  const returnTo = sanitizeReturnTo(request.cookies.get('kmhq_discord_oauth_return_to')?.value);

  if (!code || !state || !expectedState || state !== expectedState) {
    console.error('OAuth state mismatch:', { code: !!code, state, expectedState });
    const response = redirectTo(request, returnTo, { error: 'oauth_state' });
    clearAdminSessionCookie(response);
    return response;
  }

  try {
    const token = await exchangeCode(request, code);
    const user = await fetchDiscordUser(token.access_token);
    const envAdmin = isEnvAdminDiscordId(user.id);
    const adminRequired = requiresAdmin(returnTo);

    const [isMember, admin] = await Promise.all([
      envAdmin ? Promise.resolve(true) : isGuildMember(user.id),
      envAdmin ? Promise.resolve(true) : isAdmin(user.id),
    ]);

    if (!isMember || (adminRequired && !admin)) {
      const response = redirectTo(request, returnTo, { denied: '1' });
      clearAdminSessionCookie(response);
      response.cookies.delete('kmhq_discord_oauth_state');
      response.cookies.delete('kmhq_discord_oauth_return_to');
      return response;
    }

    // Auto-register member in DB (no-op if already exists)
    await autoRegisterMember(user, envAdmin);

    const response = redirectTo(request, returnTo);
    setAdminSessionCookie(user, response);
    response.cookies.delete('kmhq_discord_oauth_state');
    response.cookies.delete('kmhq_discord_oauth_return_to');
    return response;
  } catch (error) {
    console.error('Discord admin auth failed:', error);
    const response = redirectTo(request, returnTo, { error: 'discord_auth' });
    clearAdminSessionCookie(response);
    response.cookies.delete('kmhq_discord_oauth_state');
    response.cookies.delete('kmhq_discord_oauth_return_to');
    return response;
  }
}
