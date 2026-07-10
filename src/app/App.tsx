import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { FocusTimerDriver } from "../core/focus/FocusTimerDriver";
import { AudioDriver } from "../core/audio/AudioDriver";

// Root layout. Anything mounted here survives route changes - FocusTimerDriver
// and AudioDriver both live here, never inside a routed page, or navigating
// away would stop the timer / cut the audio.
export function App() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <FocusTimerDriver />
      <AudioDriver />
      <Sidebar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
}