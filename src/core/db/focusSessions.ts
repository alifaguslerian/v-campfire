import { getDb } from "./client";

export type FocusSessionType = "focus" | "break";

export async function recordFocusSession(input: {
  type: FocusSessionType;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
}): Promise<void> {
  const db = await getDb();
  await db.execute(
    "INSERT INTO focus_sessions (started_at, ended_at, duration_seconds, type) VALUES ($1, $2, $3, $4)",
    [input.startedAt, input.endedAt, input.durationSeconds, input.type],
  );
}
