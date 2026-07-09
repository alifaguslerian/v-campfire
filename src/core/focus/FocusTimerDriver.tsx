import { useEffect } from "react";
import { useFocusStore } from "./store";

// Mounted once in src/app/App.tsx (the persistent shell) - must not live
// inside a routed page, or navigating away stops the interval and the
// countdown silently freezes in the background. Same reasoning as the
// audio player.
export function FocusTimerDriver() {
  const tick = useFocusStore((s) => s.tick);

  useEffect(() => {
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  return null;
}
