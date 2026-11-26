import { useQuery } from "@tanstack/react-query";
import {
  computeHijriDateLocally,
  fetchHijriDate,
  hijriMonths,
  readCachedHijriDate,
  toApiDateKey,
} from "@/lib/hijri";
import { toArabicNumerals } from "@/lib/prayerUtils";

// Formatted Hijri date for a Gregorian day: fetched from the API and cached,
// with the local Umm al-Qura calculation shown until (or if never) it arrives.
export function useHijriDate(lookupDate: Date): string {
  const key = toApiDateKey(lookupDate);

  const { data } = useQuery({
    queryKey: ["hijri", key],
    queryFn: () => fetchHijriDate(key),
    initialData: () => readCachedHijriDate(key) ?? undefined,
    staleTime: Infinity,
    retry: 2,
  });

  const hijri = data ?? computeHijriDateLocally(lookupDate);
  return `${toArabicNumerals(hijri.day)} ${hijriMonths[hijri.month - 1]} ${toArabicNumerals(hijri.year)} هـ`;
}
