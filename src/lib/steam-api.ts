/**
 * Steam API utilities
 * 
 * Functions to interact with Steam Web API
 */

const STEAM_API_KEY = process.env.STEAM_API_KEY;
const STEAM_API_BASE = "https://api.steampowered.com";

/**
 * Get Steam user profile information
 * 
 * @param steamId - Steam ID (64-bit format)
 * @returns User profile data including persona name
 */
export async function getSteamUserProfile(steamId: string): Promise<{
  personaName: string;
  profileUrl: string;
  avatar: string;
} | null> {
  if (!STEAM_API_KEY) {
    console.warn("STEAM_API_KEY not set, cannot fetch Steam profile");
    return null;
  }

  try {
    const response = await fetch(
      `${STEAM_API_BASE}/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steamId}`
    );

    if (!response.ok) {
      console.error("Steam API error:", response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    const players = data.response?.players;

    if (!players || players.length === 0) {
      return null;
    }

    const player = players[0];
    return {
      personaName: player.personaname || `Steam User ${steamId}`,
      profileUrl: player.profileurl || `https://steamcommunity.com/profiles/${steamId}`,
      avatar: player.avatarfull || player.avatarmedium || player.avatar || "",
    };
  } catch (error) {
    console.error("Error fetching Steam profile:", error);
    return null;
  }
}

