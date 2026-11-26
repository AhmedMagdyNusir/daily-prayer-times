// App configuration read from environment variables (see .env.example).
// Vite inlines these at build time, so changing them requires a rebuild.

export type DstMode = "auto" | "on" | "off";

function parseDstMode(value: string | undefined): DstMode {
  const mode = value?.trim().toLowerCase();
  if (mode === "on" || mode === "off") return mode;
  return "auto";
}

function parseHijriAdjustment(value: string | undefined): number {
  const n = Number.parseInt(value ?? "", 10);
  if (Number.isNaN(n)) return 0;
  // A sighting difference is never more than a couple of days
  return Math.max(-2, Math.min(2, n));
}

export const DST_MODE = parseDstMode(import.meta.env.VITE_DST_MODE);
export const HIJRI_ADJUSTMENT = parseHijriAdjustment(
  import.meta.env.VITE_HIJRI_ADJUSTMENT,
);
