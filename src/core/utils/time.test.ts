import { describe, expect, it } from "vitest";
import { formatSecondsAsClock } from "./time";

describe("formatSecondsAsClock", () => {
  it("formats zero", () => {
    expect(formatSecondsAsClock(0)).toBe("00:00");
  });

  it("pads single-digit seconds", () => {
    expect(formatSecondsAsClock(65)).toBe("01:05");
  });

  it("formats a full 25-minute focus duration", () => {
    expect(formatSecondsAsClock(25 * 60)).toBe("25:00");
  });

  it("clamps negative values instead of showing a negative clock", () => {
    expect(formatSecondsAsClock(-5)).toBe("00:00");
  });
});
