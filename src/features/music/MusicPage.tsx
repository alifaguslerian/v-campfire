import { Button } from "../../design-system/components/Button/Button";
import { Card } from "../../design-system/components/Card/Card";
import { useAudioStore, type AmbientTrack } from "../../core/audio/store";

const AMBIENT_TRACKS: { id: AmbientTrack; label: string }[] = [
  { id: "rain", label: "Rain" },
  { id: "campfire", label: "Campfire" },
  { id: "forest", label: "Forest" },
  { id: "night", label: "Night" },
  { id: "sea", label: "Sea" },
];

export function MusicPage() {
  const { currentTrack, isPlaying, play, pause, stop } = useAudioStore();

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontFamily: "var(--font-display)" }}>Music</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: 16 }}>
        Ambient sound. Place your own audio files under{" "}
        <code>public/ambient/</code> - see{" "}
        <code>src/core/audio/store.ts</code> for expected filenames.
      </p>

      <Card>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {AMBIENT_TRACKS.map((track) => {
            const isActive = currentTrack === track.id;
            return (
              <Button
                key={track.id}
                variant={isActive && isPlaying ? "primary" : "secondary"}
                onClick={() =>
                  isActive && isPlaying ? pause() : play(track.id)
                }
              >
                {track.label}
              </Button>
            );
          })}
        </div>
        {currentTrack && (
          <div style={{ marginTop: 16 }}>
            <Button variant="destructive" onClick={stop}>
              Stop
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
