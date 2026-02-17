import { useState, useEffect, useCallback } from "react";
import {
  getTodayPrayerTimes,
  getPrayersArray,
  getNextPrayer,
  getTimeRemaining,
  isPrayerTime,
  formatArabicDate,
  formatHijriDate,
  PrayerInfo,
} from "@/lib/prayerUtils";
import { DayPrayerTimes } from "@/data/prayerTimes";

export interface UsePrayerTimesReturn {
  currentTime: Date;
  todayPrayers: DayPrayerTimes;
  prayersArray: PrayerInfo[];
  nextPrayer: PrayerInfo | null;
  nextPrayerIndex: number;
  isNextDay: boolean;
  timeRemaining: { hours: number; minutes: number; seconds: number };
  currentPrayerAlert: PrayerInfo | null;
  formattedDate: string;
  hijriDate: string;
}

export function usePrayerTimes(): UsePrayerTimesReturn {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentDay, setCurrentDay] = useState(new Date().toDateString());
  
  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Check if day has changed
      const newDay = now.toDateString();
      if (newDay !== currentDay) {
        setCurrentDay(newDay);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [currentDay]);
  
  // Get today's prayer times (recalculates when day changes)
  const todayPrayers = getTodayPrayerTimes(currentTime);
  const prayersArray = getPrayersArray(todayPrayers);
  
  // Find next prayer
  const { prayer: nextPrayer, index: nextPrayerIndex, isNextDay } = getNextPrayer(
    prayersArray,
    currentTime
  );
  
  // If next day, get tomorrow's Fajr
  const tomorrowPrayers = isNextDay
    ? getPrayersArray(getTodayPrayerTimes(new Date(currentTime.getTime() + 24 * 60 * 60 * 1000)))
    : null;
  
  const actualNextPrayer = isNextDay && tomorrowPrayers ? tomorrowPrayers[0] : nextPrayer;
  
  // Calculate time remaining
  const timeRemaining = actualNextPrayer
    ? getTimeRemaining(actualNextPrayer.time, currentTime, isNextDay)
    : { hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 };
  
  // Check for prayer time alert
  const currentPrayerAlert = isPrayerTime(prayersArray, currentTime);
  
  // Format date
  const formattedDate = formatArabicDate(currentTime);
  const hijriDate = formatHijriDate(currentTime);
  
  return {
    currentTime,
    todayPrayers,
    prayersArray,
    nextPrayer: actualNextPrayer,
    nextPrayerIndex: isNextDay ? 0 : nextPrayerIndex,
    isNextDay,
    timeRemaining,
    currentPrayerAlert,
    formattedDate,
    hijriDate,
  };
}
