import { CalculationMethod, Coordinates, PrayerTimes } from "adhan";

export interface GeoPoint {
  lat: number;
  lng: number;
}

// Times of day as "HH:MM", in Egypt standard time (UTC+2, before any DST shift)
export interface DayPrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

const EGYPT_STANDARD_OFFSET_MS = 2 * 60 * 60 * 1000;

// Egyptian General Authority of Survey: Fajr 19.5°, Isha 17.5°, Shafi'i Asr
const params = CalculationMethod.Egyptian();

function toEgyptStandardTime(instant: Date): string {
  const t = new Date(instant.getTime() + EGYPT_STANDARD_OFFSET_MS);
  const hh = t.getUTCHours().toString().padStart(2, "0");
  const mm = t.getUTCMinutes().toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

// Prayer times for the calendar day of `date` at the given location
export function calculatePrayerTimes(date: Date, point: GeoPoint): DayPrayerTimes {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const times = new PrayerTimes(new Coordinates(point.lat, point.lng), day, params);
  return {
    fajr: toEgyptStandardTime(times.fajr),
    sunrise: toEgyptStandardTime(times.sunrise),
    dhuhr: toEgyptStandardTime(times.dhuhr),
    asr: toEgyptStandardTime(times.asr),
    maghrib: toEgyptStandardTime(times.maghrib),
    isha: toEgyptStandardTime(times.isha),
  };
}
