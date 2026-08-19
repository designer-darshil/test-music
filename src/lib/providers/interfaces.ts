export interface UnifiedSearchResult {
  id: string;
  type: 'track' | 'artist' | 'album' | 'playlist';
  title: string;
  subtitle: string;
  imageUrl?: string;
  duration?: number;
  uri: string;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl?: string;
  bio?: string;
}

export interface Playlist {
  id: string;
  name: string;
  owner: string;
  imageUrl?: string;
  tracks: UnifiedSearchResult[];
}

export interface MetadataProvider {
  search(query: string): Promise<UnifiedSearchResult[]>;
  getArtist(id: string): Promise<Artist>;
  getPlaylist(id: string): Promise<Playlist>;
}

export interface PlaybackProvider {
  play(trackId: string): Promise<void>;
  pause(): void;
  seek(ms: number): void;
  setVolume(level: number): void;
}
