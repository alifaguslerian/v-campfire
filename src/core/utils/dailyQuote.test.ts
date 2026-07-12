import { describe, expect, it } from "vitest";
import { getDailyQuote } from "./dailyQuote";

describe("getDailyQuote", () => {
  it("returns the same quote for the same day", () => {
    const date = new Date(2026, 0, 5);
    expect(getDailyQuote(date)).toBe(getDailyQuote(date));
  });

  it("returns a non-empty string for every day of the week", () => {
    for (let offset = 0; offset < 7; offset++) {
      const date = new Date(2026, 0, 4 + offset);
      const quote = getDailyQuote(date);
      expect(typeof quote).toBe("string");
      expect(quote.length).toBeGreaterThan(0);
    }
  });
});
