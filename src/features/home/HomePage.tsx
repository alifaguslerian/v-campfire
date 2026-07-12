import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../../design-system/components/Card/Card";
import { Button } from "../../design-system/components/Button/Button";
import { ProgressBar } from "../../design-system/components/ProgressBar/ProgressBar";
import { useFocusStore } from "../../core/focus/store";
import { useAudioStore } from "../../core/audio/store";
import { formatSecondsAsClock } from "../../core/utils/time";
import { calculateProgress } from "../../core/utils/progress";
import { calculateStreak } from "../../core/utils/streak";
import {
  getCurrentTimeLabel,
  getTimeAwareMessage,
} from "../../core/utils/greeting";
import { getLocalDateString } from "../../core/utils/date";
import {
  listTrackedItems,
  type TrackedItemWithProgress,
} from "../../core/db/trackedItems";
import { getEntryByDate, type JournalEntry } from "../../core/db/journal";
import { getStatsSummary, listJournalDates } from "../../core/db/stats";
import styles from "./HomePage.module.css";

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
  const [focusHours, setFocusHours] = useState(0);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [clock, setClock] = useState(() => getCurrentTimeLabel());

  // Picked once on mount, not re-rolled on every render - so it doesn't
  // change out from under the user while they're reading it.
  const [timeMessage] = useState(() => getTimeAwareMessage());

  useEffect(() => {
    const interval = setInterval(() => setClock(getCurrentTimeLabel()), 30_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    (async () => {
      const [items, entry, summary, journalDates] = await Promise.all([
        listTrackedItems(),
        getEntryByDate(getLocalDateString()),
        getStatsSummary(),
        listJournalDates(),
      ]);
      setRecentItems(items.slice(0, 3));
      setTodayEntry(entry);
      setFocusHours(summary.totalFocusSeconds / 3600);
      setStreak(calculateStreak(journalDates));
      setLoading(false);
    })();
  }, []);

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
    <div className={styles.wrapper}>
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
          marginBottom: 12,
        }}
      >
        {heading}
      </h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 32,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            color: "var(--text-secondary)",
            fontSize: "var(--text-base)",
            margin: 0,
          }}
        >
          {timeMessage}
        </p>
        <span
          className="tabular-nums"
          style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}
        >
          {clock}
        </span>
      </div>

      <div className={styles.layout}>
        {/* main column - what's actually happening */}
        <div>
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
                  <span
                    style={{ marginLeft: 12, color: "var(--text-secondary)" }}
                  >
                    {phase === "focus" ? "Focus session" : "Break"}
                  </span>
                </div>
                <Button variant="secondary" onClick={isRunning ? pause : start}>
                  {isRunning ? "Pause" : "Resume"}
                </Button>
              </div>
            )}
          </Card>

          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "var(--text-sm)",
              marginBottom: 12,
            }}
          >
            Latest
          </p>
          {loading ? (
            <p>Loading...</p>
          ) : recentItems.length === 0 ? (
            <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>
              Nothing tracked yet.{" "}
              <Link to="/tracked-items">Start a project</Link>.
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
            <p>{todayEntry.done_today}</p>
          ) : (
            <p style={{ color: "var(--text-secondary)" }}>
              Nothing written yet.{" "}
              <Link to="/journal">Add today's entry</Link>.
            </p>
          )}
        </div>

        {/* side column - status and atmosphere, not primary content */}
        <div className={styles.side}>
          {currentTrack && (
            <Card>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "var(--text-sm)",
                  marginBottom: 8,
                }}
              >
                Music
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>{isPlaying ? "Playing" : "Paused"}: {currentTrack}</span>
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

          <Card>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "var(--text-sm)",
                marginBottom: 12,
              }}
            >
              At a glance
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span style={{ color: "var(--text-secondary)" }}>
                Journal streak
              </span>
              <span className="tabular-nums">
                {streak} day{streak === 1 ? "" : "s"}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>
                Focus time
              </span>
              <span className="tabular-nums">{focusHours.toFixed(1)}h</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}