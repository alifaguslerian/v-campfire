// Global audio state. Deliberately outside any feature folder and outside
// React component state - must persist across route changes and be
// controllable from anywhere (e.g. a mini-player in the sidebar while a
// different feature view is open).

import { create } from "zustand";

interface AudioState {
  currentTrack: string | null;
  isPlaying: boolean;
  play: (track: string) => void;
  pause: () => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  currentTrack: null,
  isPlaying: false,
  play: (track) => set({ currentTrack: track, isPlaying: true }),
  pause: () => set({ isPlaying: false }),
}));
