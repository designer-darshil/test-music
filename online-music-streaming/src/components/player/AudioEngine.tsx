"use client";

import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/playerStore";

export function AudioEngine() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { currentSong, isPlaying, volume, setProgress, nextSong } = usePlayerStore();

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(e => console.error("Playback failed:", e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    nextSong();
  };

  return (
    <audio
      ref={audioRef}
      src={currentSong?.audioUrl || ""}
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
    />
  );
}
