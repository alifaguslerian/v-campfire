import { Button } from "../../design-system/components/Button/Button";
import { Card } from "../../design-system/components/Card/Card";
import { PageContainer } from "../../design-system/components/PageContainer/PageContainer";
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
    <PageContainer>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-3xl)",
          marginBottom: 16,
        }}
      >
        Music
      </h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
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
    </PageContainer>
  );
}