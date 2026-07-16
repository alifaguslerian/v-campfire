import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Wind, Droplet, Move, Book } from "lucide-react";
import { Card } from "../../design-system/components/Card/Card";
import { Button } from "../../design-system/components/Button/Button";
import { ProgressBar } from "../../design-system/components/ProgressBar/ProgressBar";
import { SectionHeading } from "../../design-system/components/SectionHeading/SectionHeading";
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

// Visual placeholder only - not wired to any database table or query.
// habits/habit_logs exist in the schema but v0.5 hasn't built the real
// tracking logic yet. These four are generic examples, not user data.
const HABIT_PLACEHOLDERS = [
  { label: "Meditate", icon: Wind },
  { label: "Hydrate", icon: Droplet },
  { label: "Stretch", icon: Move },
  { label: "Read", icon: Book },
];

export function HomePage() {
  const { phase, secondsRemaining, isRunning, start, pause, reset } =
    useFocusStore();
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

  // Always something to look at in this slot - the wall clock when idle,
  // the countdown once a session starts. Never blank waiting for a click.
  const heroTime = phase === "idle" ? clock : formatSecondsAsClock(secondsRemaining);

  return (
    <div className={styles.wrapper}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 8,
        }}
      >
        <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
          {dateLabel}
        </p>
      </div>

      {/*
        Header uses the same 2fr:1fr grid (and the same .side divider) as
        the content grid below it - that's what keeps the heading and the
        Focus display sitting next to each other instead of the timer
        getting stretched all the way to the wrapper's right edge, and
        what makes the vertical divider line continue unbroken from the
        header straight into the content below.
      */}
      <div className={styles.layout} style={{ marginBottom: 40 }}>
        <div>
          {phase !== "idle" && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                backgroundColor: "var(--bg-elevated-2)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 9999,
                padding: "4px 12px",
                marginBottom: 16,
              }}
            >
              <span
                className="pulse-dot"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: "var(--accent-primary)",
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--accent-primary)",
                  fontWeight: 500,
                }}
              >
                {phase === "focus" ? "Focus session active" : "Break active"}
              </span>
            </div>
          )}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-3xl)",
              marginBottom: 12,
            }}
          >
            {heading}
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "var(--text-base)",
              maxWidth: 480,
              margin: 0,
            }}
          >
            {timeMessage}
          </p>
        </div>

        <div className={styles.side} style={{ justifyContent: "center" }}>
          <div
            className="tabular-nums"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-hero)",
              lineHeight: 1,
            }}
          >
            {heroTime}
          </div>
          {phase === "idle" ? (
            <Button variant="primary" onClick={start} style={{ alignSelf: "flex-start" }}>
              Start Focus
            </Button>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <Button variant="secondary" onClick={isRunning ? pause : start}>
                {isRunning ? "Pause" : "Resume"}
              </Button>
              <Button variant="destructive" onClick={reset}>
                Reset
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.layout}>
        {/* main column - what's actually happening */}
        <div>
          <div className={styles.contentSplit}>
            <div className={styles.contentColumn}>
              <SectionHeading>Project Pulse</SectionHeading>
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
                gap: 8,
                marginBottom: 32,
              }}
            >
              {recentItems.map((item) => {
                const progress = calculateProgress(
                  item.checklist_done,
                  item.checklist_total,
                );
                return (
                  <Card key={item.id} className={styles.trackedItemRow}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                      }}
                    >
                      <Link
                        to={`/tracked-items/${item.id}`}
                        style={{
                          flex: 1,
                          minWidth: 0,
                          color: "var(--text-primary)",
                          textDecoration: "none",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <strong>{item.title}</strong>{" "}
                        <span style={{ color: "var(--text-secondary)" }}>
                          ({item.type})
                        </span>
                      </Link>
                      <div style={{ width: 80, flexShrink: 0 }}>
                        <ProgressBar value={progress} />
                      </div>
                      <span
                        className="tabular-nums"
                        style={{
                          width: 32,
                          flexShrink: 0,
                          textAlign: "right",
                          fontSize: "var(--text-sm)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {item.checklist_total > 0 ? `${progress}%` : "\u2013"}
                      </span>
                      <span className={styles.trackedItemArrow}>
                        <ChevronRight size={16} />
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

            </div>

            <div className={styles.contentColumn}>
              {/* Habits - visual placeholder ahead of the real v0.5 feature,
                  see HABIT_PLACEHOLDERS comment above. Not clickable on
                  purpose - nothing here is wired to data yet. */}
              <SectionHeading>Habits</SectionHeading>
              <div className={styles.habitsGrid}>
                {HABIT_PLACEHOLDERS.map(({ label, icon: Icon }) => (
                  <Card key={label} className={styles.habitCard}>
                    <Icon size={20} strokeWidth={1.75} />
                    <span style={{ fontSize: "var(--text-sm)" }}>{label}</span>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <SectionHeading>Today&apos;s journal</SectionHeading>
          {todayEntry?.done_today ? (
            <p>{todayEntry.done_today}</p>
          ) : (
            <p style={{ color: "var(--text-secondary)" }}>
              Nothing written yet.{" "}
              <Link to="/journal">Add today's entry</Link>.
            </p>
          )}
        </div>

        {/* side column - status and atmosphere, left as-is for now, not
            part of this pass */}
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