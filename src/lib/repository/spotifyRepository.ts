import { spotifyClient } from "../spotify/client";
import { AppTrack, AppArtist, AppPlaylist, UserProfile, AppAlbum } from "./models";

export class SpotifyRepository {
  async getProfile(): Promise<UserProfile> {
    const data = await spotifyClient.fetch("v1/me");
    return {
      id: data.id,
      displayName: data.display_name || 'Unknown User',
      email: data.email,
      imageUrl: data.images?.[0]?.url,
      product: data.product,
    };
  }

  async getTopTracks(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'short_term'): Promise<AppTrack[]> {
    const data = await spotifyClient.fetch(`v1/me/top/tracks?time_range=${timeRange}&limit=20`);
    if (!data || !data.items) return [];
    return data.items.map((track: any) => this.mapTrack(track));
  }

  async getTopArtists(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'short_term'): Promise<AppArtist[]> {
    const data = await spotifyClient.fetch(`v1/me/top/artists?time_range=${timeRange}&limit=10`);
    if (!data || !data.items) return [];
    return data.items.map((artist: any) => this.mapArtist(artist));
  }

  async getRecentlyPlayed(): Promise<AppTrack[]> {
    const data = await spotifyClient.fetch(`v1/me/player/recently-played?limit=20`);
    if (!data || !data.items) return [];
    // recently played items are wrapped in a play history object
    return data.items.map((item: any) => this.mapTrack(item.track));
  }

  async getUserPlaylists(): Promise<AppPlaylist[]> {
    const data = await spotifyClient.fetch(`v1/me/playlists?limit=20`);
    if (!data || !data.items) return [];
    return data.items.map((p: any) => ({
      id: p.id,
      name: p.name,
      ownerName: p.owner.display_name,
      imageUrl: p.images?.[0]?.url,
      totalTracks: p.tracks.total,
      description: p.description,
    }));
  }

  private mapTrack(track: any): AppTrack {
    return {
      id: track.id,
      title: track.name,
      artistName: track.artists?.[0]?.name || 'Unknown Artist',
      artistId: track.artists?.[0]?.id || '',
      albumName: track.album?.name || 'Unknown Album',
      albumId: track.album?.id || '',
      imageUrl: track.album?.images?.[0]?.url,
      durationMs: track.duration_ms,
      providerUri: track.uri,
      explicit: track.explicit || false,
    };
  }

  private mapArtist(artist: any): AppArtist {
    return {
      id: artist.id,
      name: artist.name,
      imageUrl: artist.images?.[0]?.url,
      followers: artist.followers?.total,
      genres: artist.genres,
    };
  }
}

export const spotifyRepository = new SpotifyRepository();
