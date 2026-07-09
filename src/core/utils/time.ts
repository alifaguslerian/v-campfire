/**
 * MM:SS clock format for the pomodoro timer. Deliberately no hour handling -
 * focus/break durations are always under 60 minutes by design (25/5), so
 * this doesn't need to roll over to HH:MM:SS.
 */
export function formatSecondsAsClock(totalSeconds: number): string {
  const clamped = Math.max(0, totalSeconds);
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
