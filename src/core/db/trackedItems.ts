// Domain-specific query functions for tracked_items. Features import from
// here, never call getDb() + raw SQL directly from a component - keeps the
// query logic in one place per docs/ARCHITECTURE.md.

import { getDb } from "./client";

export type TrackedItemType = "project" | "game";

export interface TrackedItem {
  id: number;
  type: TrackedItemType;
  title: string;
  description: string | null;
  status: string;
  cover_image_path: string | null;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

// checklist_total/done computed via aggregate join, not a stored counter -
// stays consistent with docs/ARCHITECTURE.md's stats-via-query principle.
export interface TrackedItemWithProgress extends TrackedItem {
  checklist_total: number;
  checklist_done: number;
}

export async function listTrackedItems(): Promise<TrackedItemWithProgress[]> {
  const db = await getDb();
  return db.select<TrackedItemWithProgress[]>(`
    SELECT
      t.*,
      COALESCE(c.total, 0) as checklist_total,
      COALESCE(c.done, 0) as checklist_done
    FROM tracked_items t
    LEFT JOIN (
      SELECT tracked_item_id, COUNT(*) as total, SUM(is_done) as done
      FROM checklist_items
      GROUP BY tracked_item_id
    ) c ON c.tracked_item_id = t.id
    WHERE t.archived_at IS NULL
    ORDER BY t.created_at DESC
  `);
}

export async function getTrackedItem(id: number): Promise<TrackedItem | null> {
  const db = await getDb();
  const rows = await db.select<TrackedItem[]>(
    "SELECT * FROM tracked_items WHERE id = $1",
    [id],
  );
  return rows[0] ?? null;
}

export async function createTrackedItem(input: {
  type: TrackedItemType;
  title: string;
}): Promise<void> {
  const db = await getDb();
  await db.execute("INSERT INTO tracked_items (type, title) VALUES ($1, $2)", [
    input.type,
    input.title,
  ]);
}

// Soft archive, not hard delete - matches the product's "archive completed
// projects" intent rather than permanent deletion, which needs its own
// confirmation UX not scoped here.
export async function archiveTrackedItem(id: number): Promise<void> {
  const db = await getDb();
  await db.execute(
    "UPDATE tracked_items SET archived_at = datetime('now') WHERE id = $1",
    [id],
  );
}