export type TimeBand = "night" | "morning" | "day" | "evening";

/**
 * Night = 00:00-04:59, deliberately narrow - this is specifically for
 * "still genuinely up at 2am" energy, not just "it's dark out". Boundaries
 * matter here the same way they do in calculateStreak/getLocalDateString.
 */
export function getTimeBand(hour: number): TimeBand {
  if (hour >= 0 && hour < 5) return "night";
  if (hour >= 5 && hour < 9) return "morning";
  if (hour >= 9 && hour < 18) return "day";
  return "evening";
}

// Deliberately not "1% better every day" style poster lines - mix of
// soft, blunt, and a little intense, matching what was asked for. Night
// pool is heavier/more introspective on purpose, for anyone genuinely
// still up at that hour.
const MESSAGES: Record<TimeBand, string[]> = {
  night: [
    "Still here. That says something about what you're building.",
    "The house is quiet. Your mind doesn't have to be.",
    "Some of the best work happens when no one else is awake to see it.",
    "This hour asks for honesty, not hustle.",
    "You're not behind. You're just working while the world sleeps.",
    "Whatever kept you up, it mattered enough to stay for.",
    "No one's grading this hour. Use it anyway.",
  ],
  morning: [
    "The day hasn't decided what it is yet. Neither have you. Good.",
    "Early enough that nothing's gone wrong yet.",
    "A clean page, a clean hour.",
    "Start rough. Starting is the whole point.",
    "Whatever yesterday was, it's not today's problem anymore.",
  ],
  day: [
    "One thing at a time. That's the whole trick.",
    "Progress doesn't need an audience.",
    "You don't have to feel ready to begin.",
    "Small moves count more than big plans.",
    "Whatever's in front of you is the only thing that matters right now.",
    "Nobody's watching. Do it anyway.",
    "Discomfort now is just relief later.",
  ],
  evening: [
    "The day's mostly spent. Spend the rest of it on purpose.",
    "You've earned the slow part of the day.",
    "Whatever didn't get done can wait for tomorrow's version of you.",
    "Close a loop before you close the day.",
    "Not everything has to be finished to be enough.",
  ],
};

export function getTimeAwareMessage(date: Date = new Date()): string {
  const pool = MESSAGES[getTimeBand(date.getHours())];
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getCurrentTimeLabel(date: Date = new Date()): string {
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}
