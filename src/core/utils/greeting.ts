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

// Two-sentence, descriptive-status length (not a short quip) - mix of
// soft, blunt, and a little intense, never "1% better every day" style
// poster lines. Night pool is heavier/more introspective on purpose, for
// anyone genuinely still up at that hour.
const MESSAGES: Record<TimeBand, string[]> = {
  night: [
    "Still here, long after most people gave up on the day. That kind of quiet focus doesn't happen by accident.",
    "The house has gone quiet, but your mind clearly hasn't. That's alright - some of the best thinking happens in hours like this.",
    "Nobody's awake to see this hour except you. Spend it however actually helps.",
    "This is the version of you that shows up when no one's watching. Worth paying attention to.",
    "Whatever's keeping you up, it mattered enough to stay for. That's not nothing.",
    "No deadline demands this hour from you. You chose it. That's worth noticing.",
  ],
  morning: [
    "The day hasn't decided what kind of day it's going to be yet. Neither have you, and that's exactly as it should be.",
    "Nothing's gone wrong yet. This is about as clean a start as you'll get, so use it.",
    "A quiet hour before everything else gets loud. Good time to decide what actually matters today.",
    "Whatever yesterday left unfinished, it's not this morning's problem to carry.",
    "Early enough that the whole day still belongs to you.",
  ],
  day: [
    "One thing in front of you at a time - that's really the whole trick, even when it doesn't feel like enough.",
    "Progress rarely looks impressive while it's happening. Keep going anyway.",
    "You don't need to feel ready for this. Readiness tends to show up after you start, not before.",
    "Small, unglamorous moves add up to more than big plans usually do.",
    "Whatever's in front of you right now is the only thing that actually needs solving.",
    "No one's grading this hour. Spend it like it counts anyway.",
  ],
  evening: [
    "Most of the day is spent now. What's left is still yours to use on purpose.",
    "You've done enough today to earn the slower part of it.",
    "Whatever didn't get finished can wait for tomorrow's version of you to handle.",
    "Closing one loop before the day closes is usually worth the extra ten minutes.",
    "Not everything needs to be finished today to count as a good one.",
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