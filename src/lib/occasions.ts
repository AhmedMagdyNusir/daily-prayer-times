import { HijriDate } from "@/lib/hijri";

export type Occasion = "ramadan" | "eid-fitr" | "eid-adha";

export const occasionGreetings: Record<Occasion, string> = {
  ramadan: "رمضان كريم",
  "eid-fitr": "عيد فطر مبارك",
  "eid-adha": "عيد أضحى مبارك",
};

const OCCASIONS = Object.keys(occasionGreetings) as Occasion[];

// The festive season a Hijri day falls in: all of Ramadan, the three days of
// Eid al-Fitr, and Eid al-Adha through the days of Tashreeq
export function getOccasion({ day, month }: HijriDate): Occasion | null {
  if (month === 9) return "ramadan";
  if (month === 10 && day <= 3) return "eid-fitr";
  if (month === 12 && day >= 10 && day <= 13) return "eid-adha";
  return null;
}

// Dev-only preview, e.g. /?occasion=ramadan (or ?occasion=none)
export function readOccasionOverride(): Occasion | null | undefined {
  if (!import.meta.env.DEV) return undefined;
  const value = new URLSearchParams(window.location.search).get("occasion");
  if (value === "none") return null;
  return OCCASIONS.find((o) => o === value);
}
