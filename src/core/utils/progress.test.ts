import { describe, expect, it } from "vitest";
import { calculateProgress } from "./progress";

describe("calculateProgress", () => {
  it("returns 0 when total is 0 (avoids division by zero)", () => {
    expect(calculateProgress(0, 0)).toBe(0);
  });

  it("returns 0 when done is 0", () => {
    expect(calculateProgress(0, 5)).toBe(0);
  });

  it("returns 100 when all items done", () => {
    expect(calculateProgress(5, 5)).toBe(100);
  });

  it("rounds to nearest integer", () => {
    // 1/3 = 33.33...
    expect(calculateProgress(1, 3)).toBe(33);
    // 2/3 = 66.66...
    expect(calculateProgress(2, 3)).toBe(67);
  });

  it("handles negative total defensively (treated as 0)", () => {
    expect(calculateProgress(0, -1)).toBe(0);
  });
});
