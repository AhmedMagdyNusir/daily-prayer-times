import { HIJRI_ADJUSTMENT } from "@/lib/config";

export interface HijriDate {
  day: number;
  month: number; // 1-12
  year: number;
}

export const hijriMonths = [
  "محرم",
  "صفر",
  "ربيع الأول",
  "ربيع الآخر",
  "جمادى الأولى",
  "جمادى الآخرة",
  "رجب",
  "شعبان",
  "رمضان",
  "شوال",
  "ذو القعدة",
  "ذو الحجة",
];

const API_URL = "https://api.aladhan.com/v1/gToH";
const CACHE_PREFIX = "hijri:";

// "DD-MM-YYYY", the format the Aladhan API expects
export function toApiDateKey(date: Date): string {
  const dd = date.getDate().toString().padStart(2, "0");
  const mm = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${dd}-${mm}-${date.getFullYear()}`;
}

// The Gregorian day whose Hijri date should be shown. The Hijri day starts
// at Maghrib, so after sunset we look up tomorrow. The env adjustment
// accounts for local moon sighting differing from the API's calendar.
export function getHijriLookupDate(now: Date, isAfterMaghrib: boolean): Date {
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  date.setDate(date.getDate() + (isAfterMaghrib ? 1 : 0) + HIJRI_ADJUSTMENT);
  return date;
}

// Offline fallback using the browser's built-in Umm al-Qura calendar
export function computeHijriDateLocally(date: Date): HijriDate {
  const parts = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura-nu-latn", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).formatToParts(date);
  const get = (type: string) =>
    Number.parseInt(parts.find((p) => p.type === type)?.value ?? "", 10);
  return { day: get("day"), month: get("month"), year: get("year") };
}

export function readCachedHijriDate(key: string): HijriDate | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    return raw ? (JSON.parse(raw) as HijriDate) : null;
  } catch {
    return null;
  }
}

function writeCachedHijriDate(key: string, value: HijriDate) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable; the API will be asked again next time
  }
}

export async function fetchHijriDate(key: string): Promise<HijriDate> {
  const cached = readCachedHijriDate(key);
  if (cached) return cached;

  const res = await fetch(`${API_URL}/${key}`);
  if (!res.ok) throw new Error(`Hijri API responded with ${res.status}`);
  const json = await res.json();
  const hijri = json?.data?.hijri;
  const value: HijriDate = {
    day: Number(hijri?.day),
    month: Number(hijri?.month?.number),
    year: Number(hijri?.year),
  };
  if (!value.day || !value.month || !value.year) {
    throw new Error("Unexpected Hijri API response");
  }

  writeCachedHijriDate(key, value);
  return value;
}
