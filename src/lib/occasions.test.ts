import { describe, it, expect } from "vitest";
import { getOccasion } from "@/lib/occasions";

describe("getOccasion", () => {
  it("covers all of Ramadan", () => {
    expect(getOccasion({ day: 1, month: 9, year: 1448 })).toBe("ramadan");
    expect(getOccasion({ day: 30, month: 9, year: 1448 })).toBe("ramadan");
    expect(getOccasion({ day: 29, month: 8, year: 1448 })).toBeNull();
  });

  it("covers the three days of Eid al-Fitr", () => {
    expect(getOccasion({ day: 1, month: 10, year: 1448 })).toBe("eid-fitr");
    expect(getOccasion({ day: 3, month: 10, year: 1448 })).toBe("eid-fitr");
    expect(getOccasion({ day: 4, month: 10, year: 1448 })).toBeNull();
  });

  it("covers Eid al-Adha through the days of Tashreeq", () => {
    expect(getOccasion({ day: 9, month: 12, year: 1448 })).toBeNull();
    expect(getOccasion({ day: 10, month: 12, year: 1448 })).toBe("eid-adha");
    expect(getOccasion({ day: 13, month: 12, year: 1448 })).toBe("eid-adha");
    expect(getOccasion({ day: 14, month: 12, year: 1448 })).toBeNull();
  });
});
