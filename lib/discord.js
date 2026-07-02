/**
 * Discord API Utility
 * Uses the bot token to fetch server data
 */

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

export async function fetchDiscordMembers() {
  if (!BOT_TOKEN || !GUILD_ID) {
    console.warn('Discord Bot Token or Guild ID missing');
    return [];
  }

  try {
    const response = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/members?limit=1000`, {
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`,
      },
    });

    if (!response.ok) {
      let errMsg = response.statusText;
      try {
        const errBody = await response.json();
        if (errBody && errBody.message) {
          errMsg = `${response.statusText} - ${errBody.message} (code ${errBody.code})`;
        }
      } catch (_) {}
      throw new Error(`Discord API error: ${response.status} ${errMsg}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch Discord members:', error);
    throw error;
  }
}

/**
 * Maps Discord presence to our internal status
 */
export function mapDiscordStatus(presence) {
  switch (presence) {
    case 'online':
    case 'idle':
    case 'dnd':
      return 'active';
    default:
      return 'inactive';
  }
}
