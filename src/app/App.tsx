import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { FocusTimerDriver } from "../core/focus/FocusTimerDriver";

// Root layout. Anything mounted here survives route changes - this is
// where the global audio player must live once features/music exists,
// and where FocusTimerDriver lives now, never inside a routed page, or
// it gets unmounted on navigation and the countdown stops.
export function App() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <FocusTimerDriver />
      <Sidebar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
}