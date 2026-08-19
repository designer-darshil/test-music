import { getAccessToken, refreshAccessToken, isTokenExpired } from "./auth";
import { getMockData } from "./mockData";

export const USE_MOCK_DATA = true;

export class SpotifyApiClient {
  async fetch(endpoint: string, method: string = 'GET', body?: any) {
    if (USE_MOCK_DATA) {
      console.log(`[MOCK] Spotify fetch: ${endpoint}`);
      return new Promise(resolve => setTimeout(() => resolve(getMockData(endpoint)), 300));
    }

    if (isTokenExpired()) {
      try {
        await refreshAccessToken();
      } catch (e) {
        throw new Error("token_expired");
      }
    }

    const token = getAccessToken();
    if (!token) {
      throw new Error("unauthorized");
    }

    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("token_expired");
      }
      if (res.status === 403) {
        throw new Error("forbidden_scope");
      }
      if (res.status === 429) {
        throw new Error("rate_limited");
      }
      throw new Error(`spotify_error_${res.status}`);
    }
    
    // Some endpoints return 204 No Content
    if (res.status === 204) return null;

    return await res.json();
  }
}

export const spotifyClient = new SpotifyApiClient();
