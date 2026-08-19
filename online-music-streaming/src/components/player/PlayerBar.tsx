"use client";

import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";
import { AudioEngine } from "./AudioEngine";

export function PlayerBar() {
  const { currentSong, isPlaying, setPlaying, progress, volume, setVolume, nextSong, prevSong } = usePlayerStore();

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercent = currentSong && currentSong.duration > 0 
    ? (progress / currentSong.duration) * 100 
    : 0;

  return (
    <>
      <AudioEngine />
      <div className="bg-neutral-900 border-t border-neutral-800 flex flex-col md:flex-row md:items-center justify-between px-2 md:px-4 w-full h-auto md:h-24 py-2 md:py-0">
        
        {/* Progress bar on mobile (top of mini player) */}
        <div className="md:hidden w-full h-1 bg-neutral-800 rounded-full mb-2 absolute top-0 left-0">
           <div className="h-full bg-white rounded-full transition-all" style={{ width: `${progressPercent}%` }}></div>
        </div>

        <div className="flex items-center justify-between w-full md:w-1/3">
          <div className="flex items-center">
            {currentSong ? (
              <>
                <div className="w-10 h-10 md:w-14 md:h-14 bg-neutral-800 rounded mr-3 overflow-hidden shrink-0">
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-500"></div>
                </div>
                <div className="overflow-hidden">
                  <div className="text-white text-sm font-medium truncate">{currentSong.title}</div>
                  <div className="text-neutral-400 text-xs truncate">{currentSong.artistName}</div>
                </div>
              </>
            ) : (
              <div className="text-neutral-500 text-sm">Select a song</div>
            )}
          </div>
          
          {/* Mobile controls */}
          <div className="md:hidden flex items-center space-x-4">
             <button 
                onClick={() => setPlaying(!isPlaying)}
                className="text-white hover:scale-105 transition-transform"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
              </button>
          </div>
        </div>
        
        {/* Desktop controls */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/3">
          <div className="flex items-center space-x-6 mb-2">
            <button onClick={prevSong} className="text-neutral-400 hover:text-white transition-colors">
              <SkipBack className="w-5 h-5 fill-current" />
            </button>
            <button 
              onClick={() => setPlaying(!isPlaying)}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform text-black"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-1" />}
            </button>
            <button onClick={nextSong} className="text-neutral-400 hover:text-white transition-colors">
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
          </div>
          <div className="w-full max-w-md flex items-center space-x-2 text-xs text-neutral-400">
            <span>{formatTime(progress)}</span>
            <div className="h-1 bg-neutral-600 rounded-full flex-1 group cursor-pointer relative">
              <div 
                className="h-full bg-white rounded-full group-hover:bg-green-500 transition-all" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <span>{currentSong ? formatTime(currentSong.duration) : "0:00"}</span>
          </div>
        </div>
        
        {/* Desktop volume */}
        <div className="hidden md:flex items-center justify-end w-1/3 space-x-3 text-neutral-400">
          <Volume2 className="w-5 h-5" />
          <div className="w-24 h-1 bg-neutral-600 rounded-full group cursor-pointer">
            <div 
              className="h-full bg-white rounded-full group-hover:bg-green-500"
              style={{ width: `${volume * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}
