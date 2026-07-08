import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

// Root layout. Anything mounted here survives route changes - this is
// where the global audio player must live once features/music exists,
// never inside a routed page, or it gets unmounted on navigation.
export function App() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
}