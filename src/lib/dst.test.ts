import { describe, it, expect } from "vitest";
import { isDstActive, isEgyptSummerTime, shiftTime } from "@/lib/dst";

describe("isEgyptSummerTime", () => {
  // 2026: last Friday of April = Apr 24, last Thursday of October = Oct 29
  it("starts on the last Friday of April", () => {
    expect(isEgyptSummerTime(new Date(2026, 3, 23, 23, 0))).toBe(false);
    expect(isEgyptSummerTime(new Date(2026, 3, 24, 0, 30))).toBe(true);
  });

  it("ends after the last Thursday of October", () => {
    expect(isEgyptSummerTime(new Date(2026, 9, 29, 22, 0))).toBe(true);
    expect(isEgyptSummerTime(new Date(2026, 9, 30, 0, 30))).toBe(false);
  });

  it("is off in winter", () => {
    expect(isEgyptSummerTime(new Date(2026, 0, 15))).toBe(false);
    expect(isEgyptSummerTime(new Date(2026, 10, 26))).toBe(false);
  });
});

describe("isDstActive", () => {
  it("respects manual modes", () => {
    const winter = new Date(2026, 0, 15);
    const summer = new Date(2026, 6, 15);
    expect(isDstActive(winter, "on")).toBe(true);
    expect(isDstActive(summer, "off")).toBe(false);
    expect(isDstActive(summer, "auto")).toBe(true);
  });
});

describe("shiftTime", () => {
  it("adds an hour and wraps past midnight", () => {
    expect(shiftTime("04:05", 60)).toBe("05:05");
    expect(shiftTime("23:30", 60)).toBe("00:30");
  });
});
