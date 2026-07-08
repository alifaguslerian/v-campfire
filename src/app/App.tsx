// Root layout. Anything mounted here survives route changes - this is where
// the global audio player must live (see src/core/audio), never inside a
// feature route, or it gets unmounted on navigation and music cuts out.

import { useState } from "react";
import { Button } from "../design-system/components/Button/Button";
import { Card } from "../design-system/components/Card/Card";
import { pingDb } from "../core/db/client";

export function App() {
  const [dbResult, setDbResult] = useState<string>("not tested yet");

  async function handleTestDb() {
    setDbResult("testing...");
    try {
      const count = await pingDb();
      setDbResult(`OK - tracked_items row count: ${count}`);
    } catch (err) {
      setDbResult(`ERROR - ${String(err)}`);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      {/* AudioProvider and router go here once features/music and routing exist */}
      {/* Temporary: verifying design tokens + db layer. Remove once the
          first real feature (tracked-items) replaces this. */}
      <Card>
        <h1 style={{ fontFamily: "var(--font-display)" }}>V Campfire</h1>
        <p>Design token check - v0.1 scaffold</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Button variant="secondary" onClick={handleTestDb}>
            Test DB
          </Button>
          <span>{dbResult}</span>
        </div>
      </Card>
    </div>
  );
}