import { create } from "zustand";

export interface Song {
  id: string;
  title: string;
  artistName: string;
  audioUrl: string;
  duration: number;
}

interface PlayerState {
  currentSong: Song | null;
  queue: Song[];
  isPlaying: boolean;
  volume: number;
  progress: number;
  setPlaying: (isPlaying: boolean) => void;
  playSong: (song: Song, queue?: Song[]) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  nextSong: () => void;
  prevSong: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  queue: [],
  isPlaying: false,
  volume: 1,
  progress: 0,
  
  setPlaying: (isPlaying) => set({ isPlaying }),
  
  playSong: (song, queue = []) => set({ currentSong: song, isPlaying: true, queue: queue.length ? queue : [song] }),
  
  setVolume: (volume) => set({ volume }),
  
  setProgress: (progress) => set({ progress }),
  
  nextSong: () => {
    const { currentSong, queue } = get();
    if (!currentSong || queue.length <= 1) return;
    const currentIndex = queue.findIndex(s => s.id === currentSong.id);
    if (currentIndex !== -1 && currentIndex < queue.length - 1) {
      set({ currentSong: queue[currentIndex + 1], isPlaying: true, progress: 0 });
    } else {
      // Loop or stop
      set({ currentSong: queue[0], isPlaying: true, progress: 0 });
    }
  },
  
  prevSong: () => {
    const { currentSong, queue } = get();
    if (!currentSong || queue.length <= 1) return;
    const currentIndex = queue.findIndex(s => s.id === currentSong.id);
    if (currentIndex > 0) {
      set({ currentSong: queue[currentIndex - 1], isPlaying: true, progress: 0 });
    } else {
      set({ progress: 0 }); // Just restart current song if it's the first
    }
  }
}));
