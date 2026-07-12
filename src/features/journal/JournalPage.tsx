import { useEffect, useState } from "react";
import { PageContainer } from "../../design-system/components/PageContainer/PageContainer";
import { useDebouncedCallback } from "../../core/utils/useDebouncedCallback";
import { getLocalDateString } from "../../core/utils/date";
import { getEntryByDate, upsertEntry } from "../../core/db/journal";
import styles from "./JournalPage.module.css";

const today = getLocalDateString();

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 8,
  color: "var(--text-secondary)",
  fontSize: "var(--text-sm)",
};

const sectionStyle: React.CSSProperties = {
  marginBottom: 32,
  paddingBottom: 32,
  borderBottom: "1px solid var(--border-subtle)",
};

export function JournalPage() {
  const [doneToday, setDoneToday] = useState("");
  const [blockers, setBlockers] = useState("");
  const [tomorrowTarget, setTomorrowTarget] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const entry = await getEntryByDate(today);
      if (entry) {
        setDoneToday(entry.done_today ?? "");
        setBlockers(entry.blockers ?? "");
        setTomorrowTarget(entry.tomorrow_target ?? "");
      }
      setLoading(false);
    })();
  }, []);

  // One debounced upsert covering all three fields, not three separate
  // debounced writes - fewer round trips to SQLite per docs/PERFORMANCE.md.
  const debouncedSave = useDebouncedCallback(
    (done: string, block: string, target: string) => {
      upsertEntry(today, {
        done_today: done,
        blockers: block,
        tomorrow_target: target,
      });
    },
    500,
  );

  function handleFieldChange(
    field: "done" | "blockers" | "target",
    value: string,
  ) {
    let nextDone = doneToday;
    let nextBlockers = blockers;
    let nextTarget = tomorrowTarget;
    if (field === "done") {
      nextDone = value;
      setDoneToday(value);
    }
    if (field === "blockers") {
      nextBlockers = value;
      setBlockers(value);
    }
    if (field === "target") {
      nextTarget = value;
      setTomorrowTarget(value);
    }
    debouncedSave(nextDone, nextBlockers, nextTarget);
  }

  if (loading) {
    return (
      <PageContainer>
        <p>Loading...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <p
        style={{
          color: "var(--text-secondary)",
          fontSize: "var(--text-sm)",
          marginBottom: 8,
        }}
      >
        {today}
      </p>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-3xl)",
          marginBottom: 40,
        }}
      >
        Journal
      </h1>

      {/*
        One entry, three fields - not three separate boxed panels. A flowing
        page with quiet dividers reads as a single act of writing, not a
        form to fill out field by field.
      */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Apa yang selesai hari ini?</label>
        <textarea
          value={doneToday}
          onChange={(e) => handleFieldChange("done", e.target.value)}
          className={styles.entryField}
        />
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>Kendala?</label>
        <textarea
          value={blockers}
          onChange={(e) => handleFieldChange("blockers", e.target.value)}
          className={styles.entryField}
        />
      </div>

      <div>
        <label style={labelStyle}>Target besok?</label>
        <textarea
          value={tomorrowTarget}
          onChange={(e) => handleFieldChange("target", e.target.value)}
          className={styles.entryField}
        />
      </div>
    </PageContainer>
  );
}