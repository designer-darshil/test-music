export interface AppTrack {
  id: string;
  title: string;
  artistName: string;
  artistId: string;
  albumName: string;
  albumId: string;
  imageUrl?: string;
  durationMs: number;
  providerUri: string;
  explicit: boolean;
}

export interface AppArtist {
  id: string;
  name: string;
  imageUrl?: string;
  followers?: number;
  genres?: string[];
}

export interface AppAlbum {
  id: string;
  title: string;
  artistName: string;
  imageUrl?: string;
  releaseDate: string;
  totalTracks: number;
}

export interface AppPlaylist {
  id: string;
  name: string;
  ownerName: string;
  imageUrl?: string;
  totalTracks: number;
  description?: string;
}

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  imageUrl?: string;
  product: string;
}
