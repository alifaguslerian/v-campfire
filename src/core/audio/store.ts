// Global playback state - deliberately outside any feature folder and
// outside React component state, same reasoning as src/core/focus/store.ts:
// must keep playing across route changes, and be controllable from
// anywhere (e.g. the sidebar mini-indicator while another page is open).

import { create } from "zustand";

export type AmbientTrack = "rain" | "campfire" | "forest" | "night" | "sea";

// Files are NOT included in this scaffold - place matching audio files
// (mp3 or ogg) under public/ambient/ using these exact filenames. Missing
// files simply fail to play (browser console will show a 404), nothing
// crashes.
export const TRACK_SOURCES: Record<AmbientTrack, string> = {
  rain: "/ambient/rain.mp3",
  campfire: "/ambient/campfire.mp3",
  forest: "/ambient/forest.mp3",
  night: "/ambient/night.mp3",
  sea: "/ambient/sea.mp3",
};

interface AudioState {
  currentTrack: AmbientTrack | null;
  isPlaying: boolean;
  play: (track: AmbientTrack) => void;
  pause: () => void;
  stop: () => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  currentTrack: null,
  isPlaying: false,
  play: (track) => set({ currentTrack: track, isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  stop: () => set({ currentTrack: null, isPlaying: false }),
}));