// Every number here comes from an aggregate query over existing event
// tables (focus_sessions, checklist_items, tracked_items, journal_entries)
// - no stored counters, same principle as tracked_items' progress %.

import { getDb } from "./client";

export interface StatsSummary {
  totalFocusSeconds: number;
  checklistItemsCompleted: number;
  projectsArchived: number;
  gamesArchived: number;
}

export async function getStatsSummary(): Promise<StatsSummary> {
  const db = await getDb();

  const [focusRows, checklistRows, archivedRows] = await Promise.all([
    db.select<{ total: number | null }[]>(
      "SELECT SUM(duration_seconds) as total FROM focus_sessions WHERE type = 'focus'",
    ),
    db.select<{ count: number }[]>(
      "SELECT COUNT(*) as count FROM checklist_items WHERE is_done = 1",
    ),
    db.select<{ type: string; count: number }[]>(
      "SELECT type, COUNT(*) as count FROM tracked_items WHERE archived_at IS NOT NULL GROUP BY type",
    ),
  ]);

  // "Archived", not "completed" - the app only tracks an archive action
  // right now, not a separate completed-vs-abandoned distinction, so the
  // stat is named for what the data actually represents.
  const projectsArchived =
    archivedRows.find((r) => r.type === "project")?.count ?? 0;
  const gamesArchived =
    archivedRows.find((r) => r.type === "game")?.count ?? 0;

  return {
    totalFocusSeconds: focusRows[0]?.total ?? 0,
    checklistItemsCompleted: checklistRows[0]?.count ?? 0,
    projectsArchived,
    gamesArchived,
  };
}

export async function listJournalDates(): Promise<string[]> {
  const db = await getDb();
  const rows = await db.select<{ date: string }[]>(
    "SELECT DISTINCT date FROM journal_entries ORDER BY date DESC",
  );
  return rows.map((r) => r.date);
}
