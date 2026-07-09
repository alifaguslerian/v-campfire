import { getDb } from "./client";

export type StickyNoteColor = "amber" | "sage" | "neutral";

export interface StickyNote {
  id: number;
  content: string;
  color: StickyNoteColor;
  position_x: number;
  position_y: number;
  created_at: string;
  updated_at: string;
}

export async function listStickyNotes(): Promise<StickyNote[]> {
  const db = await getDb();
  return db.select<StickyNote[]>(
    "SELECT * FROM sticky_notes ORDER BY created_at DESC",
  );
}

export async function createStickyNote(
  color: StickyNoteColor,
): Promise<void> {
  const db = await getDb();
  await db.execute(
    "INSERT INTO sticky_notes (content, color) VALUES ($1, $2)",
    ["", color],
  );
}

export async function updateStickyNoteContent(
  id: number,
  content: string,
): Promise<void> {
  const db = await getDb();
  await db.execute(
    "UPDATE sticky_notes SET content = $1, updated_at = datetime('now') WHERE id = $2",
    [content, id],
  );
}

export async function deleteStickyNote(id: number): Promise<void> {
  const db = await getDb();
  await db.execute("DELETE FROM sticky_notes WHERE id = $1", [id]);
}
