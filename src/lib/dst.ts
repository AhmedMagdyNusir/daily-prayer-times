import { DST_MODE, DstMode } from "@/lib/config";

// Last occurrence of a weekday (0 = Sunday) in a month (0-indexed)
function lastWeekdayOfMonth(year: number, month: number, weekday: number): Date {
  const date = new Date(year, month + 1, 0); // last day of the month
  date.setDate(date.getDate() - ((date.getDay() - weekday + 7) % 7));
  return date;
}

// Egypt's summer time (Law 24/2023): from the last Friday of April
// through the last Thursday of October.
export function isEgyptSummerTime(date: Date): boolean {
  const year = date.getFullYear();
  const start = lastWeekdayOfMonth(year, 3, 5);
  const end = lastWeekdayOfMonth(year, 9, 4);
  end.setHours(23, 59, 59, 999);
  return date >= start && date <= end;
}

export function isDstActive(date: Date, mode: DstMode = DST_MODE): boolean {
  if (mode === "on") return true;
  if (mode === "off") return false;
  return isEgyptSummerTime(date);
}

// Shift an "HH:MM" string by a number of minutes
export function shiftTime(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = (((h * 60 + m + minutes) % 1440) + 1440) % 1440;
  const hh = Math.floor(total / 60).toString().padStart(2, "0");
  const mm = (total % 60).toString().padStart(2, "0");
  return `${hh}:${mm}`;
}
