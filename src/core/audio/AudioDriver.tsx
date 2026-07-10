import { useEffect, useRef } from "react";
import { useAudioStore, TRACK_SOURCES } from "./store";

// Mounted once in src/app/App.tsx (the persistent shell) - holds the
// actual <audio> element so playback survives route changes. Never mount
// this inside a routed page, or navigating away unmounts the element and
// the sound cuts out - same reasoning as FocusTimerDriver.
export function AudioDriver() {
  const { currentTrack, isPlaying } = useAudioStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Only re-runs when the track itself changes, not on every play/pause
  // toggle - otherwise resuming a paused track would restart it from 0:00.
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = TRACK_SOURCES[currentTrack];
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          // Expected if the audio file hasn't been supplied yet - see
          // store.ts comment. Fails silently rather than crashing the app.
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack]);

  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);

  // loop is correct here specifically because these are ambient tracks
  // meant to play continuously - revisit if a non-looping "real music"
  // mode is ever added.
  return <audio ref={audioRef} loop />;
}
