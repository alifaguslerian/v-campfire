import { Outlet } from "react-router-dom";
import { BottomDock } from "./BottomDock";
import { FocusTimerDriver } from "../core/focus/FocusTimerDriver";
import { AudioDriver } from "../core/audio/AudioDriver";
import { AmbientBackground } from "./AmbientBackground";

// Root layout. Anything mounted here survives route changes - FocusTimerDriver
// and AudioDriver both live here, never inside a routed page, or navigating
// away would stop the timer / cut the audio. AmbientBackground and
// BottomDock are shell-level concerns too, same reasoning.
export function App() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <AmbientBackground />
      <FocusTimerDriver />
      <AudioDriver />
      {/* bottom padding reserves room so page content never sits behind
          the floating dock when scrolled to the end */}
      <main style={{ paddingBottom: 96 }}>
        <Outlet />
      </main>
      <BottomDock />
    </div>
  );
}