"use client";

import { Play } from "lucide-react";
import { usePlayerStore, Song } from "@/store/playerStore";

interface PlayButtonProps {
  song: Song;
  queue?: Song[];
  className?: string;
  iconClassName?: string;
}

export function PlayButton({ song, queue, className, iconClassName }: PlayButtonProps) {
  const { playSong } = usePlayerStore();

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    playSong(song, queue);
  };

  return (
    <button 
      onClick={handlePlay}
      className={className || "w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-black hover:scale-105 shadow-xl transition-all"}
    >
      <Play className={iconClassName || "w-5 h-5 fill-current ml-1"} />
    </button>
  );
}
