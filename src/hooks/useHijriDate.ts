import { useQuery } from "@tanstack/react-query";
import {
  computeHijriDateLocally,
  fetchHijriDate,
  HijriDate,
  hijriMonths,
  readCachedHijriDate,
  toApiDateKey,
} from "@/lib/hijri";
import { toArabicNumerals } from "@/lib/prayerUtils";

// Hijri date for a Gregorian day, with its formatted text: fetched from the API
// and cached, with the local Umm al-Qura calculation used until (or if never) it arrives.
export function useHijriDate(lookupDate: Date): { hijri: HijriDate; formatted: string } {
  const key = toApiDateKey(lookupDate);

  const { data } = useQuery({
    queryKey: ["hijri", key],
    queryFn: () => fetchHijriDate(key),
    initialData: () => readCachedHijriDate(key) ?? undefined,
    staleTime: Infinity,
    retry: 2,
  });

  const hijri = data ?? computeHijriDateLocally(lookupDate);
  const formatted = `${toArabicNumerals(hijri.day)} ${hijriMonths[hijri.month - 1]} ${toArabicNumerals(hijri.year)} هـ`;
  return { hijri, formatted };
}
