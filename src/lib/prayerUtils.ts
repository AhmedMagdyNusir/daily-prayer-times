import { prayerTimesData, DayPrayerTimes } from "@/data/prayerTimes";

export type PrayerName =
  | "fajr"
  | "sunrise"
  | "dhuhr"
  | "asr"
  | "maghrib"
  | "isha";

export interface PrayerInfo {
  key: PrayerName;
  nameAr: string;
  time: string;
  time12: string; // 12-hour format
  isPrayer: boolean; // false for sunrise (informational only)
}

export const prayerNames: Record<PrayerName, string> = {
  fajr: "الفجر",
  sunrise: "الشروق",
  dhuhr: "الظهر",
  asr: "العصر",
  maghrib: "المغرب",
  isha: "العشاء",
};

// Convert 24-hour time to 12-hour format with Arabic AM/PM
export function to12HourFormat(time24: string): string {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours < 12 ? "صـ" : "مـ";
  const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
}

// Get day of year (1-365)
export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  let dayOfYear = Math.floor(diff / oneDay);

  // Handle leap year - if after Feb 28 in leap year, subtract 1
  const isLeapYear =
    (date.getFullYear() % 4 === 0 && date.getFullYear() % 100 !== 0) ||
    date.getFullYear() % 400 === 0;
  if (isLeapYear && dayOfYear > 59) {
    dayOfYear -= 1;
  }

  // Clamp to valid range
  return Math.max(1, Math.min(365, dayOfYear));
}

// Get prayer times for a specific day
export function getTodayPrayerTimes(date: Date = new Date()): DayPrayerTimes {
  const doy = getDayOfYear(date);
  return prayerTimesData[doy - 1]; // Array is 0-indexed
}

// Convert time string (HH:MM) to Date object for today
export function timeStringToDate(
  timeStr: string,
  baseDate: Date = new Date()
): Date {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date(baseDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

// Get all prayers for a day as an array
export function getPrayersArray(dayTimes: DayPrayerTimes): PrayerInfo[] {
  return [
    {
      key: "fajr",
      nameAr: prayerNames.fajr,
      time: dayTimes.fajr,
      time12: to12HourFormat(dayTimes.fajr),
      isPrayer: true,
    },
    {
      key: "sunrise",
      nameAr: prayerNames.sunrise,
      time: dayTimes.sunrise,
      time12: to12HourFormat(dayTimes.sunrise),
      isPrayer: false,
    },
    {
      key: "dhuhr",
      nameAr: prayerNames.dhuhr,
      time: dayTimes.dhuhr,
      time12: to12HourFormat(dayTimes.dhuhr),
      isPrayer: true,
    },
    {
      key: "asr",
      nameAr: prayerNames.asr,
      time: dayTimes.asr,
      time12: to12HourFormat(dayTimes.asr),
      isPrayer: true,
    },
    {
      key: "maghrib",
      nameAr: prayerNames.maghrib,
      time: dayTimes.maghrib,
      time12: to12HourFormat(dayTimes.maghrib),
      isPrayer: true,
    },
    {
      key: "isha",
      nameAr: prayerNames.isha,
      time: dayTimes.isha,
      time12: to12HourFormat(dayTimes.isha),
      isPrayer: true,
    },
  ];
}

// Find the next prayer based on current time
export function getNextPrayer(
  prayers: PrayerInfo[],
  currentTime: Date = new Date()
): { prayer: PrayerInfo | null; index: number; isNextDay: boolean } {
  const now = currentTime;

  for (let i = 0; i < prayers.length; i++) {
    const prayerTime = timeStringToDate(prayers[i].time, now);
    if (prayerTime > now) {
      return { prayer: prayers[i], index: i, isNextDay: false };
    }
  }

  // All prayers have passed, next is tomorrow's Fajr
  return { prayer: null, index: -1, isNextDay: true };
}

// Calculate time remaining until a prayer
export function getTimeRemaining(
  targetTime: string,
  currentTime: Date = new Date(),
  isNextDay: boolean = false
): { hours: number; minutes: number; seconds: number; totalSeconds: number } {
  const target = timeStringToDate(targetTime, currentTime);

  if (isNextDay) {
    target.setDate(target.getDate() + 1);
  }

  const diff = target.getTime() - currentTime.getTime();

  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds, totalSeconds };
}

// Check if current time matches a prayer time (within 1 minute)
export function isPrayerTime(
  prayers: PrayerInfo[],
  currentTime: Date = new Date()
): PrayerInfo | null {
  for (const prayer of prayers) {
    if (!prayer.isPrayer) continue; // Skip sunrise

    const prayerTime = timeStringToDate(prayer.time, currentTime);
    const diff = Math.abs(currentTime.getTime() - prayerTime.getTime());

    if (diff <= 60 * 1000) {
      // Within 1 minute
      return prayer;
    }
  }
  return null;
}

// Format Arabic date
export function formatArabicDate(date: Date): string {
  const days = [
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];
  const months = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  const dayName = days[date.getDay()];
  const dayNum = date.getDate();
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();

  return `${dayName}، ${dayNum} ${monthName} ${year}`;
}

// Convert Gregorian to Hijri date (Umm al-Qura approximation)
export function formatHijriDate(date: Date): string {
  const hijriMonths = [
    "محرم", "صفر", "ربيع الأول", "ربيع الآخر",
    "جمادى الأولى", "جمادى الآخرة", "رجب", "شعبان",
    "رمضان", "شوال", "ذو القعدة", "ذو الحجة",
  ];

  // Kuwaiti algorithm for Gregorian to Hijri conversion
  const d = date.getDate();
  const m = date.getMonth();
  const y = date.getFullYear();

  let jd =
    Math.floor((11 * y + 3) / 30) +
    354 * y +
    30 * m -
    Math.floor((m - 1) / 2) +
    d +
    1948440 -
    385;

  if (m < 2 || (m === 1 && d <= 28)) {
    // Use direct Julian Day calculation
  }

  // Julian Day Number
  const a = Math.floor((14 - (m + 1)) / 12);
  const yy = y + 4800 - a;
  const mm = (m + 1) + 12 * a - 3;
  jd = d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;

  // Convert Julian Day to Hijri
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const hijriMonth = Math.floor((24 * l3) / 709);
  const hijriDay = l3 - Math.floor((709 * hijriMonth) / 24);
  const hijriYear = 30 * n + j - 30;

  return `${toArabicNumerals(hijriDay)} ${hijriMonths[hijriMonth - 1]} ${toArabicNumerals(hijriYear)}`;
}

// Convert number to Arabic numerals
export function toArabicNumerals(num: number): string {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return num
    .toString()
    .split("")
    .map((digit) => arabicNumerals[parseInt(digit)] || digit)
    .join("");
}

// Format time remaining in Arabic
export function formatTimeRemainingArabic(
  hours: number,
  minutes: number,
  seconds: number
): string {
  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${toArabicNumerals(hours)} ساعة`);
  }
  if (minutes > 0) {
    parts.push(`${toArabicNumerals(minutes)} دقيقة`);
  }
  if (hours === 0 && minutes < 5) {
    parts.push(`${toArabicNumerals(seconds)} ثانية`);
  }

  return parts.join(" و ");
}
