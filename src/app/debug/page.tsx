"use client";

import { useEffect, useState } from "react";
import { spotifyRepository } from "@/lib/repository/spotifyRepository";
import { getAccessToken, authorizeWithSpotify } from "@/lib/spotify/auth";

export default function DebugScreen() {
  const [token, setToken] = useState<string | null>(null);
  const [tests, setTests] = useState<any>({});

  useEffect(() => {
    const t = getAccessToken();
    setToken(t);
  }, []);

  const runTest = async (name: string, fetcher: () => Promise<any>) => {
    setTests((prev: any) => ({ ...prev, [name]: { status: 'loading' } }));
    try {
      const data = await fetcher();
      setTests((prev: any) => ({ 
        ...prev, 
        [name]: { status: 'success', items: Array.isArray(data) ? data.length : 1 } 
      }));
    } catch (e: any) {
      setTests((prev: any) => ({ 
        ...prev, 
        [name]: { status: 'error', error: e.message } 
      }));
    }
  };

  const runAllTests = () => {
    runTest('Profile', () => spotifyRepository.getProfile());
    runTest('Top Tracks', () => spotifyRepository.getTopTracks());
    runTest('Top Artists', () => spotifyRepository.getTopArtists());
    runTest('Playlists', () => spotifyRepository.getUserPlaylists());
    runTest('Recently Played', () => spotifyRepository.getRecentlyPlayed());
  };

  return (
    <div className="p-8 pb-32 text-white font-mono text-sm">
      <h1 className="text-2xl font-bold mb-6 text-red-500">Spotify Data Debug Screen</h1>
      
      <div className="mb-8 p-4 bg-neutral-900 border border-neutral-800 rounded">
        <h2 className="text-xl font-bold mb-2">Connection Status</h2>
        <p>Connected: {token ? <span className="text-green-500">Yes</span> : <span className="text-red-500">No</span>}</p>
        {!token && (
          <button onClick={authorizeWithSpotify} className="mt-4 bg-green-500 text-black px-4 py-2 rounded">
            Reconnect Spotify
          </button>
        )}
      </div>

      <div className="mb-8 p-4 bg-neutral-900 border border-neutral-800 rounded">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">API Tests</h2>
          <button onClick={runAllTests} className="bg-blue-600 text-white px-4 py-2 rounded" disabled={!token}>
            Run All Tests
          </button>
        </div>

        <div className="space-y-2">
          {Object.entries(tests).map(([name, result]: [string, any]) => (
            <div key={name} className="flex justify-between items-center border-b border-neutral-800 pb-2">
              <span>{name}</span>
              {result.status === 'loading' && <span className="text-yellow-500">Loading...</span>}
              {result.status === 'success' && <span className="text-green-500">Success ({result.items} items)</span>}
              {result.status === 'error' && <span className="text-red-500">Error: {result.error}</span>}
            </div>
          ))}
          {Object.keys(tests).length === 0 && <div className="text-neutral-500">No tests run yet.</div>}
        </div>
      </div>
    </div>
  );
}
