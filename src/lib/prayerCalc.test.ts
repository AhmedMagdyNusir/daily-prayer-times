import { describe, it, expect } from "vitest";
import { calculatePrayerTimes } from "@/lib/prayerCalc";
import { prayerTimesData } from "@/data/archive/cairoPrayerTimes";
import { getCityById } from "@/data/cities";

const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

describe("calculatePrayerTimes", () => {
  const cairo = { lat: 30.0444, lng: 31.2357 };

  it("matches the archived Cairo table within rounding for the whole year", () => {
    for (const row of prayerTimesData) {
      const calculated = calculatePrayerTimes(new Date(2025, row.month - 1, row.day), cairo);
      for (const key of ["fajr", "sunrise", "asr", "maghrib", "isha"] as const) {
        const diff = toMinutes(calculated[key]) - toMinutes(row[key]);
        expect(Math.abs(diff), `${key} on ${row.month}/${row.day}`).toBeLessThanOrEqual(1);
      }
      // The Egyptian method adds one precautionary minute to Dhuhr
      const dhuhrDiff = toMinutes(calculated.dhuhr) - toMinutes(row.dhuhr);
      expect(dhuhrDiff, `dhuhr on ${row.month}/${row.day}`).toBeGreaterThanOrEqual(0);
      expect(dhuhrDiff, `dhuhr on ${row.month}/${row.day}`).toBeLessThanOrEqual(2);
    }
  });

  it("gives later times further west", () => {
    const alexandria = getCityById("alexandria")!;
    const date = new Date(2026, 10, 26);
    const cairoTimes = calculatePrayerTimes(date, cairo);
    const alexTimes = calculatePrayerTimes(date, alexandria);
    expect(toMinutes(alexTimes.maghrib)).toBeGreaterThan(toMinutes(cairoTimes.maghrib));
  });
});
