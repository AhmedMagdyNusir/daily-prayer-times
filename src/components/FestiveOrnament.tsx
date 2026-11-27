import { Occasion } from "@/lib/occasions";

// A lantern (Ramadan) or star (Eid) hanging on a string from the top of the
// header to the logo's corner. Place inside a relative wrapper around the logo.
export function FestiveOrnament({ occasion }: { occasion: Occasion }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -top-5 sm:-top-6 left-1.5 z-10 flex -translate-x-1/2 flex-col items-center text-festive"
    >
      <div className="flex origin-top animate-swing flex-col items-center motion-reduce:animate-none">
        <span className="h-2.5 sm:h-3.5 w-px bg-festive/70" />
        {occasion === "ramadan" ? <Lantern /> : <Star />}
      </div>
    </div>
  );
}

const glow = { filter: "drop-shadow(0 0 5px hsl(var(--festive) / 0.55))" };

function Lantern() {
  return (
    <svg viewBox="0 0 20 32" className="-mt-px h-8 w-5" style={glow}>
      <circle cx="10" cy="2.5" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6 7 L14 7 L12.5 4.3 L7.5 4.3 Z" fill="currentColor" />
      <rect x="5" y="7" width="10" height="2" rx="0.5" fill="currentColor" />
      <path
        d="M5.5 9 L2.5 15 L4.5 24 L15.5 24 L17.5 15 L14.5 9 Z"
        fill="currentColor"
        fillOpacity="0.22"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M10 9 V24 M7.5 9 L6 15 L7.5 24 M12.5 9 L14 15 L12.5 24 M2.5 15 H17.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <ellipse cx="10" cy="17.5" rx="1.8" ry="2.8" fill="currentColor" fillOpacity="0.8" />
      <rect x="4.5" y="24" width="11" height="2" rx="0.5" fill="currentColor" />
      <path d="M7 26 L13 26 L10 30.5 Z" fill="currentColor" />
    </svg>
  );
}

function Star() {
  return (
    <svg viewBox="0 0 24 24" className="-mt-0.5 h-6 w-6" style={glow}>
      <polygon
        points="12 2.4 13.76 7.75 18.79 5.21 16.25 10.24 21.6 12 16.25 13.76 18.79 18.79 13.76 16.25 12 21.6 10.24 16.25 5.21 18.79 7.75 13.76 2.4 12 7.75 10.24 5.21 5.21 10.24 7.75"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
