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

export async function listTrackedItems(): Promise<TrackedItem[]> {
  const db = await getDb();
  return db.select<TrackedItem[]>(
    "SELECT * FROM tracked_items WHERE archived_at IS NULL ORDER BY created_at DESC",
  );
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
