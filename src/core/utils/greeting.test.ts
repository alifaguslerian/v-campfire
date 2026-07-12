import { describe, expect, it } from "vitest";
import { getTimeBand, getTimeAwareMessage } from "./greeting";

describe("getTimeBand", () => {
  it("classifies the night band boundaries", () => {
    expect(getTimeBand(0)).toBe("night");
    expect(getTimeBand(4)).toBe("night");
    expect(getTimeBand(5)).toBe("morning");
  });

  it("classifies the morning band boundaries", () => {
    expect(getTimeBand(5)).toBe("morning");
    expect(getTimeBand(8)).toBe("morning");
    expect(getTimeBand(9)).toBe("day");
  });

  it("classifies the day band boundaries", () => {
    expect(getTimeBand(9)).toBe("day");
    expect(getTimeBand(17)).toBe("day");
    expect(getTimeBand(18)).toBe("evening");
  });

  it("classifies the evening band boundaries", () => {
    expect(getTimeBand(18)).toBe("evening");
    expect(getTimeBand(23)).toBe("evening");
  });
});

describe("getTimeAwareMessage", () => {
  it("always returns a non-empty string for any hour of the day", () => {
    for (let hour = 0; hour < 24; hour++) {
      const date = new Date(2026, 0, 5, hour);
      const message = getTimeAwareMessage(date);
      expect(typeof message).toBe("string");
      expect(message.length).toBeGreaterThan(0);
    }
  });
});
