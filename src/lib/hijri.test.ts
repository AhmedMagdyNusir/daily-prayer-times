import { describe, it, expect } from "vitest";
import { computeHijriDateLocally, getHijriLookupDate, toApiDateKey } from "@/lib/hijri";

describe("getHijriLookupDate", () => {
  it("uses today before Maghrib and tomorrow after", () => {
    const now = new Date(2026, 10, 26, 15, 0);
    expect(toApiDateKey(getHijriLookupDate(now, false))).toBe("26-11-2026");
    expect(toApiDateKey(getHijriLookupDate(now, true))).toBe("27-11-2026");
  });

  it("rolls over month ends", () => {
    const now = new Date(2026, 11, 31, 18, 0);
    expect(toApiDateKey(getHijriLookupDate(now, true))).toBe("01-01-2027");
  });
});

describe("computeHijriDateLocally", () => {
  it("matches the Umm al-Qura calendar", () => {
    expect(computeHijriDateLocally(new Date(2026, 10, 26))).toEqual({
      day: 16,
      month: 6,
      year: 1448,
    });
  });
});
