import { useState, useEffect } from "react";
import {
  getTodayPrayerTimes,
  getPrayersArray,
  getNextPrayer,
  getTimeRemaining,
  isPrayerTime,
  formatArabicDate,
  timeStringToDate,
  PrayerInfo,
} from "@/lib/prayerUtils";
import { DayPrayerTimes, GeoPoint } from "@/lib/prayerCalc";
import { isDstActive } from "@/lib/dst";
import { getHijriLookupDate } from "@/lib/hijri";
import { getOccasion, Occasion, readOccasionOverride } from "@/lib/occasions";
import { useHijriDate } from "@/hooks/useHijriDate";

const ONE_DAY = 24 * 60 * 60 * 1000;

export interface UsePrayerTimesReturn {
  currentTime: Date;
  todayPrayers: DayPrayerTimes;
  prayersArray: PrayerInfo[];
  nextPrayer: PrayerInfo | null;
  nextPrayerIndex: number;
  isNextDay: boolean;
  timeRemaining: { hours: number; minutes: number; seconds: number };
  progress: number; // 0-1, elapsed share of the time between previous and next prayer
  currentPrayerAlert: PrayerInfo | null;
  formattedDate: string;
  hijriDate: string;
  occasion: Occasion | null; // festive season shown in the header
  isSummerTime: boolean;
}

export function usePrayerTimes(point: GeoPoint): UsePrayerTimesReturn {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const todayPrayers = getTodayPrayerTimes(currentTime, point);
  const prayersArray = getPrayersArray(todayPrayers, currentTime);

  // Find next prayer
  const { prayer: nextPrayer, index: nextPrayerIndex, isNextDay } = getNextPrayer(
    prayersArray,
    currentTime
  );

  // If all of today's prayers have passed, the next one is tomorrow's Fajr
  const tomorrow = new Date(currentTime.getTime() + ONE_DAY);
  const actualNextPrayer = isNextDay
    ? getPrayersArray(getTodayPrayerTimes(tomorrow, point), tomorrow)[0]
    : nextPrayer;

  const timeRemaining = actualNextPrayer
    ? getTimeRemaining(actualNextPrayer.time, currentTime, isNextDay)
    : { hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 };

  // Previous prayer: earlier today, or yesterday's Isha before Fajr
  const yesterday = new Date(currentTime.getTime() - ONE_DAY);
  const previousAt =
    nextPrayerIndex > 0
      ? timeStringToDate(prayersArray[nextPrayerIndex - 1].time, currentTime)
      : isNextDay
        ? timeStringToDate(prayersArray[prayersArray.length - 1].time, currentTime)
        : timeStringToDate(getTodayPrayerTimes(yesterday, point).isha, yesterday);
  const nextAt = currentTime.getTime() + timeRemaining.totalSeconds * 1000;
  const span = nextAt - previousAt.getTime();
  const progress =
    span > 0 ? Math.min(1, Math.max(0, (currentTime.getTime() - previousAt.getTime()) / span)) : 0;

  const currentPrayerAlert = isPrayerTime(prayersArray, currentTime);

  // The Hijri day begins at Maghrib
  const isAfterMaghrib = currentTime >= timeStringToDate(todayPrayers.maghrib, currentTime);
  const { hijri, formatted: hijriDate } = useHijriDate(
    getHijriLookupDate(currentTime, isAfterMaghrib),
  );
  const override = readOccasionOverride();
  const occasion = override !== undefined ? override : getOccasion(hijri);

  return {
    currentTime,
    todayPrayers,
    prayersArray,
    nextPrayer: actualNextPrayer,
    nextPrayerIndex: isNextDay ? 0 : nextPrayerIndex,
    isNextDay,
    timeRemaining,
    progress,
    currentPrayerAlert,
    formattedDate: formatArabicDate(currentTime),
    hijriDate,
    occasion,
    isSummerTime: isDstActive(currentTime),
  };
}
