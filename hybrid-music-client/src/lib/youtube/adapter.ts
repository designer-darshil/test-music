import { PlaybackProvider } from "../providers/interfaces";

// Type definitions for YouTube IFrame API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export class YouTubeAdapter implements PlaybackProvider {
  private player: any = null;
  private isReady: boolean = false;
  private queue: string[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initIFrameAPI();
    }
  }

  private initIFrameAPI() {
    if (window.YT) {
      this.isReady = true;
      return;
    }

    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = () => {
      this.player = new window.YT.Player('youtube-player-container', {
        height: '0',
        width: '0',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1
        },
        events: {
          onReady: () => {
            this.isReady = true;
          },
          onStateChange: (event: any) => {
            // Forward events to Zustand store (handled in component)
          },
          onError: (event: any) => {
            console.error("YouTube Player Error", event.data);
          }
        }
      });
    };
  }

  async play(trackId: string): Promise<void> {
    if (!this.isReady || !this.player) {
      // In a real app, queue this action until ready
      console.warn("YouTube player not ready");
      return;
    }
    
    // Note: trackId here is the YouTube Video ID from our matching engine
    this.player.loadVideoById(trackId);
    this.player.playVideo();
  }

  pause(): void {
    if (this.player && this.isReady) {
      this.player.pauseVideo();
    }
  }

  seek(ms: number): void {
    if (this.player && this.isReady) {
      this.player.seekTo(ms / 1000, true);
    }
  }

  setVolume(level: number): void {
    if (this.player && this.isReady) {
      this.player.setVolume(level * 100);
    }
  }

  getCurrentTime(): number {
    if (this.player && this.isReady && this.player.getCurrentTime) {
      return this.player.getCurrentTime();
    }
    return 0;
  }
}

export const youtubeAdapter = typeof window !== 'undefined' ? new YouTubeAdapter() : null;
