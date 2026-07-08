import { getDb } from "./client";

export interface ChecklistItem {
  id: number;
  tracked_item_id: number;
  title: string;
  is_done: number; // sqlite has no bool type - 0/1
  position: number;
  created_at: string;
}

export async function listChecklistItems(
  trackedItemId: number,
): Promise<ChecklistItem[]> {
  const db = await getDb();
  return db.select<ChecklistItem[]>(
    "SELECT * FROM checklist_items WHERE tracked_item_id = $1 ORDER BY position ASC",
    [trackedItemId],
  );
}

export async function createChecklistItem(
  trackedItemId: number,
  title: string,
): Promise<void> {
  const db = await getDb();
  const existing = await db.select<{ count: number }[]>(
    "SELECT COUNT(*) as count FROM checklist_items WHERE tracked_item_id = $1",
    [trackedItemId],
  );
  const position = existing[0].count;
  await db.execute(
    "INSERT INTO checklist_items (tracked_item_id, title, position) VALUES ($1, $2, $3)",
    [trackedItemId, title, position],
  );
}

export async function toggleChecklistItem(
  id: number,
  isDone: boolean,
): Promise<void> {
  const db = await getDb();
  await db.execute("UPDATE checklist_items SET is_done = $1 WHERE id = $2", [
    isDone ? 1 : 0,
    id,
  ]);
}
