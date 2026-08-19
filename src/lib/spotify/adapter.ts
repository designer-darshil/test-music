import { MetadataProvider, UnifiedSearchResult, Artist, Playlist } from "../providers/interfaces";
import { getAccessToken } from "./auth";

async function fetchWebApi(endpoint: string, method: string = 'GET', body?: any) {
  const token = getAccessToken();
  if (!token) throw new Error("No Spotify access token available.");

  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    if (res.status === 401) {
      // Token expired, handle refresh here in a robust implementation
      throw new Error("Token expired");
    }
    throw new Error(`Spotify API error: ${res.status}`);
  }
  return await res.json();
}

export class SpotifyAdapter implements MetadataProvider {
  async search(query: string): Promise<UnifiedSearchResult[]> {
    const data = await fetchWebApi(`v1/search?q=${encodeURIComponent(query)}&type=track,artist,album,playlist&limit=10`);
    const results: UnifiedSearchResult[] = [];

    // Map Tracks
    if (data.tracks?.items) {
      data.tracks.items.forEach((track: any) => {
        results.push({
          id: track.id,
          type: 'track',
          title: track.name,
          subtitle: track.artists.map((a: any) => a.name).join(', '),
          imageUrl: track.album?.images?.[0]?.url,
          duration: track.duration_ms,
          uri: track.uri,
        });
      });
    }

    return results;
  }

  async getArtist(id: string): Promise<Artist> {
    const data = await fetchWebApi(`v1/artists/${id}`);
    return {
      id: data.id,
      name: data.name,
      imageUrl: data.images?.[0]?.url,
    };
  }

  async getPlaylist(id: string): Promise<Playlist> {
    const data = await fetchWebApi(`v1/playlists/${id}`);
    return {
      id: data.id,
      name: data.name,
      owner: data.owner.display_name,
      imageUrl: data.images?.[0]?.url,
      tracks: data.tracks.items.map((item: any) => ({
        id: item.track.id,
        type: 'track',
        title: item.track.name,
        subtitle: item.track.artists.map((a: any) => a.name).join(', '),
        imageUrl: item.track.album?.images?.[0]?.url,
        duration: item.track.duration_ms,
        uri: item.track.uri,
      }))
    };
  }

  async getTopTracks(): Promise<UnifiedSearchResult[]> {
    const data = await fetchWebApi(`v1/me/top/tracks?time_range=short_term&limit=10`);
    return data.items.map((track: any) => ({
      id: track.id,
      type: 'track',
      title: track.name,
      subtitle: track.artists.map((a: any) => a.name).join(', '),
      imageUrl: track.album?.images?.[0]?.url,
      duration: track.duration_ms,
      uri: track.uri,
    }));
  }
}

export const spotifyAdapter = new SpotifyAdapter();
