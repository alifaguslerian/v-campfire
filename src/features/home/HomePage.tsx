import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageContainer } from "../../design-system/components/PageContainer/PageContainer";
import { Card } from "../../design-system/components/Card/Card";
import { Button } from "../../design-system/components/Button/Button";
import { ProgressBar } from "../../design-system/components/ProgressBar/ProgressBar";
import { useFocusStore } from "../../core/focus/store";
import { useAudioStore } from "../../core/audio/store";
import { formatSecondsAsClock } from "../../core/utils/time";
import { calculateProgress } from "../../core/utils/progress";
import { getDailyQuote } from "../../core/utils/dailyQuote";
import { getLocalDateString } from "../../core/utils/date";
import {
  listTrackedItems,
  type TrackedItemWithProgress,
} from "../../core/db/trackedItems";
import { getEntryByDate, type JournalEntry } from "../../core/db/journal";

export function HomePage() {
  const { phase, secondsRemaining, isRunning, start, pause } = useFocusStore();
  const {
    currentTrack,
    isPlaying,
    pause: pauseMusic,
    play: playMusic,
  } = useAudioStore();

  const [recentItems, setRecentItems] = useState<TrackedItemWithProgress[]>(
    [],
  );
  const [todayEntry, setTodayEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [items, entry] = await Promise.all([
        listTrackedItems(),
        getEntryByDate(getLocalDateString()),
      ]);
      setRecentItems(items.slice(0, 3));
      setTodayEntry(entry);
      setLoading(false);
    })();
  }, []);

  const quote = getDailyQuote();
  const dateLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const heading =
    phase === "focus"
      ? "In the flow."
      : phase === "break"
        ? "Take a breath."
        : "Ready when you are.";

  return (
    <PageContainer style={{ maxWidth: 800 }}>
      <p
        style={{
          color: "var(--text-secondary)",
          fontSize: "var(--text-sm)",
          marginBottom: 8,
        }}
      >
        {dateLabel}
      </p>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-3xl)",
          marginBottom: 32,
        }}
      >
        {heading}
      </h1>

      {/* Focus status - the most prominent block, mirrors the actual
          global timer state, not a separate copy of it */}
      <Card style={{ marginBottom: 24 }}>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "var(--text-sm)",
            marginBottom: 8,
          }}
        >
          Focus
        </p>
        {phase === "idle" ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>No session running.</span>
            <Button variant="primary" onClick={start}>
              Start Focus
            </Button>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <span
                className="tabular-nums"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-2xl)",
                }}
              >
                {formatSecondsAsClock(secondsRemaining)}
              </span>
              <span style={{ marginLeft: 12, color: "var(--text-secondary)" }}>
                {phase === "focus" ? "Focus session" : "Break"}
              </span>
            </div>
            <Button variant="secondary" onClick={isRunning ? pause : start}>
              {isRunning ? "Pause" : "Resume"}
            </Button>
          </div>
        )}
      </Card>

      {/* Music status - only takes up space if something is actually
          loaded, no empty "nothing playing" placeholder card */}
      {currentTrack && (
        <Card style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ color: "var(--text-secondary)" }}>
              {isPlaying ? "Playing" : "Paused"}: {currentTrack}
            </span>
            <Button
              variant="secondary"
              onClick={() =>
                isPlaying ? pauseMusic() : playMusic(currentTrack)
              }
            >
              {isPlaying ? "Pause" : "Play"}
            </Button>
          </div>
        </Card>
      )}

      <p
        style={{
          color: "var(--text-secondary)",
          fontSize: "var(--text-sm)",
          marginBottom: 12,
          marginTop: 32,
        }}
      >
        Latest
      </p>
      {loading ? (
        <p>Loading...</p>
      ) : recentItems.length === 0 ? (
        <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>
          Nothing tracked yet. <Link to="/tracked-items">Start a project</Link>.
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginBottom: 32,
          }}
        >
          {recentItems.map((item) => {
            const progress = calculateProgress(
              item.checklist_done,
              item.checklist_total,
            );
            return (
              <Card key={item.id}>
                <Link
                  to={`/tracked-items/${item.id}`}
                  style={{
                    color: "var(--text-primary)",
                    textDecoration: "none",
                  }}
                >
                  <strong>{item.title}</strong>
                </Link>{" "}
                <span style={{ color: "var(--text-secondary)" }}>
                  ({item.type})
                </span>
                {item.checklist_total > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <ProgressBar value={progress} />
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <p
        style={{
          color: "var(--text-secondary)",
          fontSize: "var(--text-sm)",
          marginBottom: 12,
        }}
      >
        Today's journal
      </p>
      {todayEntry?.done_today ? (
        <p style={{ marginBottom: 32 }}>{todayEntry.done_today}</p>
      ) : (
        <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>
          Nothing written yet. <Link to="/journal">Add today's entry</Link>.
        </p>
      )}

      <p
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          color: "var(--text-secondary)",
          fontSize: "var(--text-lg)",
          textAlign: "center",
          marginTop: 48,
        }}
      >
        &ldquo;{quote}&rdquo;
      </p>
    </PageContainer>
  );
}
