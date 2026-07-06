// Root layout. Anything mounted here survives route changes - this is where
// the global audio player must live (see src/core/audio), never inside a
// feature route, or it gets unmounted on navigation and music cuts out.

export function App() {
  return (
    <div>
      {/* AudioProvider and router go here once features/music and routing exist */}
      <p>V Campfire - v0.1 scaffold</p>
    </div>
  );
}
