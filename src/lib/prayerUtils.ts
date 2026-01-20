import { prayerTimesData, DayPrayerTimes } from "@/data/prayerTimes";

export type PrayerName = "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";

export interface PrayerInfo {
  key: PrayerName;
  nameAr: string;
  time: string;
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

// Get day of year (1-365)
export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  let dayOfYear = Math.floor(diff / oneDay);
  
  // Handle leap year - if after Feb 28 in leap year, subtract 1
  const isLeapYear = (date.getFullYear() % 4 === 0 && date.getFullYear() % 100 !== 0) || (date.getFullYear() % 400 === 0);
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
export function timeStringToDate(timeStr: string, baseDate: Date = new Date()): Date {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date(baseDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

// Get all prayers for a day as an array
export function getPrayersArray(dayTimes: DayPrayerTimes): PrayerInfo[] {
  return [
    { key: "fajr", nameAr: prayerNames.fajr, time: dayTimes.fajr, isPrayer: true },
    { key: "sunrise", nameAr: prayerNames.sunrise, time: dayTimes.sunrise, isPrayer: false },
    { key: "dhuhr", nameAr: prayerNames.dhuhr, time: dayTimes.dhuhr, isPrayer: true },
    { key: "asr", nameAr: prayerNames.asr, time: dayTimes.asr, isPrayer: true },
    { key: "maghrib", nameAr: prayerNames.maghrib, time: dayTimes.maghrib, isPrayer: true },
    { key: "isha", nameAr: prayerNames.isha, time: dayTimes.isha, isPrayer: true },
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
  let target = timeStringToDate(targetTime, currentTime);
  
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
    
    if (diff <= 60 * 1000) { // Within 1 minute
      return prayer;
    }
  }
  return null;
}

// Format Arabic date
export function formatArabicDate(date: Date): string {
  const days = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  const months = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ];
  
  const dayName = days[date.getDay()];
  const dayNum = date.getDate();
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${dayName}، ${dayNum} ${monthName} ${year}`;
}

// Convert number to Arabic numerals
export function toArabicNumerals(num: number): string {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return num.toString().split("").map(digit => arabicNumerals[parseInt(digit)] || digit).join("");
}

// Format time remaining in Arabic
export function formatTimeRemainingArabic(hours: number, minutes: number, seconds: number): string {
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
