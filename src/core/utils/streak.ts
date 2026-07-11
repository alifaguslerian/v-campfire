import { getLocalDateString } from "./date";

/**
 * Current streak = consecutive calendar days with a journal entry, counted
 * backward from today. If today has no entry yet, that alone doesn't break
 * an otherwise-continuous streak (the day isn't over) - counting starts
 * from yesterday instead. Any actual gap (a day with no entry) stops the
 * count immediately.
 */
export function calculateStreak(
  sortedDatesDesc: string[],
  today: string = getLocalDateString(),
): number {
  if (sortedDatesDesc.length === 0) return 0;

  const dateSet = new Set(sortedDatesDesc);
  const [year, month, day] = today.split("-").map(Number);
  const cursor = new Date(year, month - 1, day);

  if (!dateSet.has(today)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (dateSet.has(getLocalDateString(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
