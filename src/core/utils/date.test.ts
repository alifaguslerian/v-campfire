import { describe, expect, it } from "vitest";
import { getLocalDateString } from "./date";

describe("getLocalDateString", () => {
  it("formats as YYYY-MM-DD", () => {
    // Local time constructor - not UTC - so this reflects whatever
    // timezone the test runs in, which is exactly the point.
    const date = new Date(2026, 0, 5); // Jan 5 2026, local time
    expect(getLocalDateString(date)).toBe("2026-01-05");
  });

  it("pads single-digit month and day", () => {
    const date = new Date(2026, 8, 3); // Sep 3 2026
    expect(getLocalDateString(date)).toBe("2026-09-03");
  });

  it("does not shift day near local midnight (would fail if using toISOString/UTC)", () => {
    // 23:30 local time on Jan 5 must stay Jan 5, not roll to Jan 6 (which
    // toISOString() would do for any timezone behind UTC).
    const date = new Date(2026, 0, 5, 23, 30);
    expect(getLocalDateString(date)).toBe("2026-01-05");
  });
});
