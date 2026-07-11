import { useEffect, useState } from "react";
import { PageContainer } from "../../design-system/components/PageContainer/PageContainer";
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
    return (
      <PageContainer>
        <p>Loading...</p>
      </PageContainer>
    );
  }

  const statRows = [
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
    <PageContainer>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-3xl)",
          marginBottom: 40,
        }}
      >
        Stats
      </h1>

      {/*
        Deliberately not a grid of Cards - a set of numbers each boxed in
        an identical tile is exactly the "admin dashboard" look this pass
        is moving away from. A quiet ledger-style list, with typography
        doing the work instead of surfaces, fits the "workspace, not
        dashboard" direction better.
      */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {statRows.map((stat, i) => (
          <div
            key={stat.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              paddingBottom: 20,
              marginBottom: 20,
              borderBottom:
                i < statRows.length - 1
                  ? "1px solid var(--border-subtle)"
                  : "none",
            }}
          >
            <span
              style={{
                color: "var(--text-secondary)",
                fontSize: "var(--text-sm)",
              }}
            >
              {stat.label}
            </span>
            <span
              className="tabular-nums"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-2xl)",
                color: "var(--text-primary)",
              }}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}