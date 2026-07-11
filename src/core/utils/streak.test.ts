import { describe, expect, it } from "vitest";
import { calculateStreak } from "./streak";

const TODAY = "2026-01-10";

describe("calculateStreak", () => {
  it("returns 0 for no journal entries", () => {
    expect(calculateStreak([], TODAY)).toBe(0);
  });

  it("counts today alone", () => {
    expect(calculateStreak(["2026-01-10"], TODAY)).toBe(1);
  });

  it("counts consecutive days including today", () => {
    expect(
      calculateStreak(["2026-01-10", "2026-01-09", "2026-01-08"], TODAY),
    ).toBe(3);
  });

  it("does not break the streak just because today isn't filled in yet", () => {
    expect(calculateStreak(["2026-01-09", "2026-01-08"], TODAY)).toBe(2);
  });

  it("breaks on a real gap even if today is present", () => {
    // 01-09 missing between today and 01-08
    expect(calculateStreak(["2026-01-10", "2026-01-08"], TODAY)).toBe(1);
  });

  it("is 0 when the most recent entry is more than 1 day old", () => {
    expect(calculateStreak(["2026-01-07"], TODAY)).toBe(0);
  });
});
