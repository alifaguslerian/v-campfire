import { getDb } from "./client";

export interface JournalEntry {
  id: number;
  date: string;
  done_today: string | null;
  blockers: string | null;
  tomorrow_target: string | null;
  created_at: string;
}

export async function getEntryByDate(
  date: string,
): Promise<JournalEntry | null> {
  const db = await getDb();
  const rows = await db.select<JournalEntry[]>(
    "SELECT * FROM journal_entries WHERE date = $1",
    [date],
  );
  return rows[0] ?? null;
}

// Upsert on the UNIQUE(date) constraint - one atomic statement instead of
// "check if exists, then insert or update" from the frontend, which would
// race against itself if two saves fire close together.
export async function upsertEntry(
  date: string,
  fields: { done_today: string; blockers: string; tomorrow_target: string },
): Promise<void> {
  const db = await getDb();
  await db.execute(
    `INSERT INTO journal_entries (date, done_today, blockers, tomorrow_target)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT(date) DO UPDATE SET
       done_today = excluded.done_today,
       blockers = excluded.blockers,
       tomorrow_target = excluded.tomorrow_target`,
    [date, fields.done_today, fields.blockers, fields.tomorrow_target],
  );
}
