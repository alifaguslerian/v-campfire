import { Outlet } from "react-router-dom";
import { Flame } from "lucide-react";
import { BottomDock } from "./BottomDock";
import { FocusTimerDriver } from "../core/focus/FocusTimerDriver";
import { AudioDriver } from "../core/audio/AudioDriver";
import { AmbientBackground } from "./AmbientBackground";

// Root layout. Anything mounted here survives route changes - FocusTimerDriver
// and AudioDriver both live here, never inside a routed page, or navigating
// away would stop the timer / cut the audio. AmbientBackground, the brand
// mark, and BottomDock are shell-level concerns too, same reasoning.
export function App() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <AmbientBackground />
      <FocusTimerDriver />
      <AudioDriver />

      {/* Static identity mark, not navigation - the dock already handles
          navigation, this is just a signature in the corner. */}
      <div
        style={{
          position: "fixed",
          top: 20,
          left: 24,
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "var(--accent-primary)",
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-lg)",
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        <Flame size={18} strokeWidth={2} />
        <span>V Campfire</span>
      </div>

      {/* bottom padding reserves room so page content never sits behind
          the floating dock when scrolled to the end */}
      <main style={{ paddingBottom: 96, paddingTop: 56 }}>
        <Outlet />
      </main>
      <BottomDock />
    </div>
  );
}