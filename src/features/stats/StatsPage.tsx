import { useEffect, useState } from "react";
import { Card } from "../../design-system/components/Card/Card";
import {
  getStatsSummary,
  listJournalDates,
  type StatsSummary,
} from "../../core/db/stats";
import { calculateStreak } from "../../core/utils/streak";

function formatHours(totalSeconds: number): string {
  return `${(totalSeconds / 3600).toFixed(1)}h`;
}

export function StatsPage() {
  const [summary, setSummary] = useState<StatsSummary | null>(null);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [statsSummary, journalDates] = await Promise.all([
        getStatsSummary(),
        listJournalDates(),
      ]);
      setSummary(statsSummary);
      setStreak(calculateStreak(journalDates));
      setLoading(false);
    })();
  }, []);

  if (loading || !summary) {
    return <div style={{ padding: 24 }}>Loading...</div>;
  }

  const statCards = [
    { label: "Focus time", value: formatHours(summary.totalFocusSeconds) },
    {
      label: "Checklist items done",
      value: String(summary.checklistItemsCompleted),
    },
    { label: "Projects archived", value: String(summary.projectsArchived) },
    { label: "Games archived", value: String(summary.gamesArchived) },
    {
      label: "Journal streak",
      value: `${streak} day${streak === 1 ? "" : "s"}`,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontFamily: "var(--font-display)" }}>Stats</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 16,
        }}
      >
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "var(--text-sm)",
                marginBottom: 4,
              }}
            >
              {stat.label}
            </p>
            <p
              className="tabular-nums"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-xl)",
              }}
            >
              {stat.value}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
