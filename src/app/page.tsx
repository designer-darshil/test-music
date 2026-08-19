"use client";

import { useEffect, useState } from "react";
import { authorizeWithSpotify, getAccessToken, SPOTIFY_CLIENT_ID } from "@/lib/spotify/auth";
import { spotifyRepository } from "@/lib/repository/spotifyRepository";
import { AppTrack, AppArtist, AppPlaylist, UserProfile } from "@/lib/repository/models";
import { Play, User, Activity, Clock, Disc } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [topTracks, setTopTracks] = useState<AppTrack[]>([]);
  const [recentTracks, setRecentTracks] = useState<AppTrack[]>([]);
  const [playlists, setPlaylists] = useState<AppPlaylist[]>([]);
  
  const [recentTracksError, setRecentTracksError] = useState<string | null>(null);
  const [topTracksError, setTopTracksError] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      setIsAuthenticated(true);
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setGlobalError(null);
    setRecentTracksError(null);
    setTopTracksError(null);

    try {
      // Profile is required for the workspace to look right
      const prof = await spotifyRepository.getProfile();
      setProfile(prof);

      // Fetch other data independently so a 403 in one doesn't crash everything
      const [tracksRes, recentRes, plRes] = await Promise.allSettled([
        spotifyRepository.getTopTracks(),
        spotifyRepository.getRecentlyPlayed(),
        spotifyRepository.getUserPlaylists()
      ]);

      if (tracksRes.status === 'fulfilled') {
        setTopTracks(tracksRes.value);
      } else {
        setTopTracksError(tracksRes.reason.message);
      }

      if (recentRes.status === 'fulfilled') {
        setRecentTracks(recentRes.value);
      } else {
        setRecentTracksError(recentRes.reason.message);
      }

      if (plRes.status === 'fulfilled') {
        setPlaylists(plRes.value);
      }

    } catch (e: any) {
      console.error(e);
      if (e.message === 'token_expired') {
        setGlobalError('Spotify session expired');
      } else if (e.message === 'forbidden_scope') {
        setGlobalError('Spotify blocked access (403). Your account must be added to the Spotify Developer Dashboard "User Management" list while the app is in Development mode. If you recently changed scopes, please Reconnect.');
      } else {
        setGlobalError(`Failed to load data: ${e.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-t-blue-500 border-neutral-700 rounded-full animate-spin"></div>
        <p className="mt-4 text-neutral-400">Loading your workspace...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    const isClientIdMissing = !SPOTIFY_CLIENT_ID || SPOTIFY_CLIENT_ID === 'your_spotify_client_id';
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-6">Personal Music Workspace</h1>
        <p className="text-neutral-400 max-w-md mb-8">
          Connect your Spotify account to bring your library into a unified playback experience.
        </p>
        {isClientIdMissing && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-md max-w-md mb-8 text-sm text-left">
            <p className="font-bold mb-2">Missing Spotify Client ID</p>
            <p>You need to create a Spotify Developer Application and add its Client ID to your environment variables or in <code>auth.ts</code>.</p>
          </div>
        )}
        <button 
          onClick={isClientIdMissing ? () => alert('Please configure your Spotify Client ID.') : authorizeWithSpotify}
          className={`${isClientIdMissing ? 'bg-neutral-600 cursor-not-allowed' : 'bg-blue-600 hover:scale-105 shadow-blue-500/50'} shadow-lg text-white px-8 py-4 rounded-2xl font-bold text-lg transition-transform`}
        >
          Connect Spotify
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 pb-32 max-w-7xl mx-auto space-y-12">
      
      {globalError && (
        <div className="bg-red-900/50 border border-red-500 p-4 rounded-xl flex items-center justify-between">
          <span className="text-red-200">{globalError}</span>
          {(globalError.includes('expired') || globalError.includes('Reconnect')) && (
             <button onClick={authorizeWithSpotify} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap ml-4">
               Reconnect Spotify
             </button>
          )}
        </div>
      )}

      {/* Header Profile Section */}
      <header className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-neutral-800 overflow-hidden flex items-center justify-center">
          {profile?.imageUrl ? (
            <img src={profile.imageUrl} alt={profile.displayName} className="w-full h-full object-cover" />
          ) : (
            <User className="w-8 h-8 text-neutral-500" />
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">{profile?.displayName}&apos;s Workspace</h1>
          <p className="text-neutral-400 flex items-center mt-1">
            <Activity className="w-4 h-4 mr-2" /> Spotify Premium Sync Active
          </p>
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Pulse (Recent) */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center space-x-2 text-blue-400 mb-4 border-b border-neutral-800 pb-2">
            <Clock className="w-5 h-5" />
            <h2 className="text-xl font-bold">Listening Pulse</h2>
          </div>
          
          {recentTracksError === 'forbidden_scope' ? (
            <div className="p-6 bg-neutral-900 border border-red-500/50 rounded-2xl flex flex-col items-start space-y-4">
              <div>
                <p className="text-red-400 font-bold mb-1">Listening history unavailable</p>
                <p className="text-neutral-400 text-sm">Allow access to your Spotify listening history to show recently played tracks.</p>
              </div>
              <button onClick={authorizeWithSpotify} className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                Allow Access
              </button>
            </div>
          ) : recentTracksError === 'rate_limited' ? (
             <div className="p-8 bg-neutral-900 rounded-2xl text-center border border-yellow-500/50">
               <p className="text-yellow-400">Spotify is temporarily rate limiting requests. We&apos;ll retry automatically later.</p>
             </div>
          ) : recentTracksError ? (
             <div className="p-8 bg-neutral-900 rounded-2xl text-center border border-red-500/50">
               <p className="text-red-400">Failed to load recent tracks.</p>
             </div>
          ) : recentTracks.length === 0 ? (
            <div className="p-8 bg-neutral-900 rounded-2xl text-center border border-neutral-800">
              <p className="text-neutral-500">Spotify hasn&apos;t returned any recently played tracks for this account.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentTracks.slice(0, 6).map((track, i) => (
                <div key={track.id + i} className="bg-neutral-900 hover:bg-neutral-800 p-3 rounded-2xl flex items-center group cursor-pointer transition-colors border border-neutral-800 hover:border-neutral-700">
                  <div className="w-12 h-12 rounded-xl bg-neutral-800 shrink-0 relative mr-4 overflow-hidden">
                    {track.imageUrl && <img src={track.imageUrl} alt={track.title} className="w-full h-full object-cover" />}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 fill-white text-white ml-1" />
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="text-white font-medium truncate">{track.title}</div>
                    <div className="text-neutral-500 text-xs truncate">{track.artistName}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-2 text-green-400 mb-4 border-b border-neutral-800 pb-2 mt-8">
            <Activity className="w-5 h-5" />
            <h2 className="text-xl font-bold">Your Top Tracks</h2>
          </div>

          {topTracksError === 'forbidden_scope' ? (
            <div className="p-6 bg-neutral-900 border border-red-500/50 rounded-2xl flex flex-col items-start space-y-4">
              <div>
                <p className="text-red-400 font-bold mb-1">Top tracks unavailable</p>
                <p className="text-neutral-400 text-sm">Allow access to your top listening data to view this section.</p>
              </div>
              <button onClick={authorizeWithSpotify} className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                Allow Access
              </button>
            </div>
          ) : topTracksError === 'rate_limited' ? (
             <div className="p-8 bg-neutral-900 rounded-2xl text-center border border-yellow-500/50">
               <p className="text-yellow-400">Spotify is temporarily rate limiting requests. We&apos;ll retry automatically later.</p>
             </div>
          ) : topTracksError ? (
             <div className="p-8 bg-neutral-900 rounded-2xl text-center border border-red-500/50">
               <p className="text-red-400">Failed to load top tracks.</p>
             </div>
          ) : topTracks.length === 0 ? (
            <div className="p-8 bg-neutral-900 rounded-2xl text-center border border-neutral-800">
              <p className="text-neutral-500">Not enough listening history to calculate top tracks.</p>
            </div>
          ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topTracks.slice(0, 6).map((track, i) => (
                <div key={track.id + i} className="bg-neutral-900 hover:bg-neutral-800 p-3 rounded-2xl flex items-center group cursor-pointer transition-colors border border-neutral-800 hover:border-neutral-700">
                  <div className="w-12 h-12 rounded-xl bg-neutral-800 shrink-0 relative mr-4 overflow-hidden">
                    {track.imageUrl && <img src={track.imageUrl} alt={track.title} className="w-full h-full object-cover" />}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 fill-white text-white ml-1" />
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="text-white font-medium truncate">{track.title}</div>
                    <div className="text-neutral-500 text-xs truncate">{track.artistName}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Collections */}
        <section className="space-y-6">
          <div className="flex items-center space-x-2 text-purple-400 mb-4 border-b border-neutral-800 pb-2">
            <Disc className="w-5 h-5" />
            <h2 className="text-xl font-bold">Collections</h2>
          </div>
          
          <div className="space-y-3">
            {playlists.slice(0, 5).map(playlist => (
              <div key={playlist.id} className="flex items-center space-x-3 p-2 hover:bg-neutral-900 rounded-xl cursor-pointer transition-colors">
                <div className="w-10 h-10 bg-neutral-800 rounded-lg overflow-hidden shrink-0">
                  {playlist.imageUrl && <img src={playlist.imageUrl} alt={playlist.name} className="w-full h-full object-cover" />}
                </div>
                <div className="overflow-hidden flex-1">
                  <div className="text-white text-sm font-medium truncate">{playlist.name}</div>
                  <div className="text-neutral-500 text-xs">{playlist.totalTracks} tracks</div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

    </div>
  );
}


