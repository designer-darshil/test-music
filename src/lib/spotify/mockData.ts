export const MOCK_PROFILE = {
  id: "mock_user",
  display_name: "Developer",
  email: "developer@example.com",
  images: [{ url: "https://i.pravatar.cc/150?u=mock" }],
  product: "premium"
};

export const MOCK_TRACKS = {
  items: [
    {
      id: "track1",
      name: "Cyberpunk City",
      artists: [{ id: "art1", name: "Neon Flux" }],
      album: { id: "alb1", name: "Night Drive", images: [{ url: "https://picsum.photos/300?1" }] },
      duration_ms: 180000,
      uri: "spotify:track:track1",
      explicit: false
    },
    {
      id: "track2",
      name: "Lo-Fi Beats",
      artists: [{ id: "art2", name: "Chill Master" }],
      album: { id: "alb2", name: "Study Session", images: [{ url: "https://picsum.photos/300?2" }] },
      duration_ms: 210000,
      uri: "spotify:track:track2",
      explicit: false
    },
    {
      id: "track3",
      name: "Heavy Riffs",
      artists: [{ id: "art3", name: "The Rockers" }],
      album: { id: "alb3", name: "Stadium Tour", images: [{ url: "https://picsum.photos/300?3" }] },
      duration_ms: 250000,
      uri: "spotify:track:track3",
      explicit: true
    },
    {
      id: "track4",
      name: "Smooth Jazz",
      artists: [{ id: "art4", name: "Sax Guy" }],
      album: { id: "alb4", name: "Midnight Mood", images: [{ url: "https://picsum.photos/300?4" }] },
      duration_ms: 300000,
      uri: "spotify:track:track4",
      explicit: false
    }
  ]
};

export const MOCK_RECENTLY_PLAYED = {
  items: MOCK_TRACKS.items.map(track => ({ track }))
};

export const MOCK_ARTISTS = {
  items: [
    {
      id: "art1",
      name: "Neon Flux",
      images: [{ url: "https://picsum.photos/300?5" }],
      followers: { total: 12345 },
      genres: ["synthwave", "electronic"]
    }
  ]
};

export const MOCK_PLAYLISTS = {
  items: [
    {
      id: "play1",
      name: "Focus Mix",
      owner: { display_name: "Spotify" },
      images: [{ url: "https://picsum.photos/300?6" }],
      tracks: { total: 42, items: MOCK_RECENTLY_PLAYED.items },
      description: "Music to help you concentrate."
    },
    {
      id: "play2",
      name: "Workout Hype",
      owner: { display_name: "Developer" },
      images: [{ url: "https://picsum.photos/300?7" }],
      tracks: { total: 15, items: MOCK_RECENTLY_PLAYED.items },
      description: "Get pumped!"
    }
  ]
};

export function getMockData(endpoint: string) {
  if (endpoint.startsWith("v1/me/top/tracks")) return MOCK_TRACKS;
  if (endpoint.startsWith("v1/me/top/artists")) return MOCK_ARTISTS;
  if (endpoint.startsWith("v1/me/player/recently-played")) return MOCK_RECENTLY_PLAYED;
  if (endpoint.startsWith("v1/me/playlists")) return MOCK_PLAYLISTS;
  if (endpoint === "v1/me") return MOCK_PROFILE;
  if (endpoint.startsWith("v1/search")) return { tracks: MOCK_TRACKS };
  if (endpoint.startsWith("v1/artists/")) return MOCK_ARTISTS.items[0];
  if (endpoint.startsWith("v1/playlists/")) return MOCK_PLAYLISTS.items[0];
  return {};
}
