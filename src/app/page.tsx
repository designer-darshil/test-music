"use client";

import { useEffect, useState } from "react";
import { authorizeWithSpotify, getAccessToken } from "@/lib/spotify/auth";
import { spotifyAdapter } from "@/lib/spotify/adapter";
import { UnifiedSearchResult } from "@/lib/providers/interfaces";
import { Play } from "lucide-react";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [topTracks, setTopTracks] = useState<UnifiedSearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      setIsAuthenticated(true);
      spotifyAdapter.getTopTracks()
        .then(setTopTracks)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className="p-8 text-white">Loading your music...</div>;
  }

  if (!isAuthenticated) {
    const isClientIdMissing = !process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID === 'your_spotify_client_id';

    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-6">Welcome to Hybrid Music</h1>
        <p className="text-neutral-400 max-w-md mb-8">
          Connect your Spotify account to bring your library, playlists, and taste profile into a unified playback experience powered by YouTube.
        </p>
        
        {isClientIdMissing ? (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-md max-w-md mb-8 text-sm text-left">
            <p className="font-bold mb-2">Missing Spotify Client ID</p>
            <p>You need to create a Spotify Developer Application and add its Client ID to your environment variables:</p>
            <code className="block bg-black/50 p-2 mt-2 rounded">NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_id_here</code>
          </div>
        ) : null}

        <button 
          onClick={isClientIdMissing ? () => alert('Please configure NEXT_PUBLIC_SPOTIFY_CLIENT_ID in your environment variables.') : authorizeWithSpotify}
          className={`${isClientIdMissing ? 'bg-neutral-600 cursor-not-allowed' : 'bg-green-500 hover:scale-105'} text-black px-8 py-4 rounded-full font-bold text-lg transition-transform`}
        >
          Connect Spotify
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 pb-32">
      <h1 className="text-3xl font-bold text-white mb-8">Good Evening</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">Your Top Tracks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topTracks.map((track) => (
            <div key={track.id} className="bg-neutral-800/40 hover:bg-neutral-800 p-3 rounded flex items-center group cursor-pointer transition-colors">
              <div className="w-12 h-12 bg-neutral-700 shrink-0 relative mr-4">
                {track.imageUrl && <img src={track.imageUrl} alt={track.title} className="w-full h-full object-cover" />}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-6 h-6 fill-white text-white ml-1" />
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-white font-semibold truncate">{track.title}</div>
                <div className="text-neutral-400 text-sm truncate">{track.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
