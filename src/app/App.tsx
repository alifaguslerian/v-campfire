// Root layout. Anything mounted here survives route changes - this is where
// the global audio player must live (see src/core/audio), never inside a
// feature route, or it gets unmounted on navigation and music cuts out.

import { Button } from "../design-system/components/Button/Button";
import { Card } from "../design-system/components/Card/Card";

export function App() {
  return (
    <div style={{ padding: 24 }}>
      {/* AudioProvider and router go here once features/music and routing exist */}
      {/* Temporary: verifying design tokens render correctly. Remove once
          the first real feature (tracked-items) replaces this. */}
      <Card>
        <h1 style={{ fontFamily: "var(--font-display)" }}>V Campfire</h1>
        <p>Design token check - v0.1 scaffold</p>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </Card>
    </div>
  );
}