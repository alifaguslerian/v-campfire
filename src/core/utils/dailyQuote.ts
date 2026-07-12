// Original short lines, not attributed to anyone - avoids any risk of
// misquoting or misattributing a real historical figure. Rotates by day
// of week, so it's stable through the day but changes daily, not random
// on every refresh.
const QUOTES = [
  "Small progress is still progress.",
  "The fire doesn't need to roar to keep you warm.",
  "Today is enough. Tomorrow will wait its turn.",
  "Rest is part of the work, not a break from it.",
  "One page, one checklist, one quiet hour at a time.",
  "You don't have to see the whole staircase, just the next step.",
  "Consistency is a kindness you do for your future self.",
];

export function getDailyQuote(date: Date = new Date()): string {
  return QUOTES[date.getDay() % QUOTES.length];
}
