import { useEffect, useState } from "react";
import { Card } from "../../design-system/components/Card/Card";
import { useDebouncedCallback } from "../../core/utils/useDebouncedCallback";
import { getLocalDateString } from "../../core/utils/date";
import { getEntryByDate, upsertEntry } from "../../core/db/journal";

const today = getLocalDateString();

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 8,
  color: "var(--text-secondary)",
  fontSize: "var(--text-sm)",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 80,
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

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontFamily: "var(--font-display)" }}>Journal</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: 16 }}>
        {today}
      </p>

      <Card style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Apa yang selesai hari ini?</label>
        <textarea
          value={doneToday}
          onChange={(e) => handleFieldChange("done", e.target.value)}
          style={textareaStyle}
        />
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Kendala?</label>
        <textarea
          value={blockers}
          onChange={(e) => handleFieldChange("blockers", e.target.value)}
          style={textareaStyle}
        />
      </Card>

      <Card>
        <label style={labelStyle}>Target besok?</label>
        <textarea
          value={tomorrowTarget}
          onChange={(e) => handleFieldChange("target", e.target.value)}
          style={textareaStyle}
        />
      </Card>
    </div>
  );
}
