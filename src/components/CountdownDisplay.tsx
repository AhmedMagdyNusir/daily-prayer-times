import { PrayerInfo } from "@/lib/prayerUtils";
import { formatTimeRemainingArabic } from "@/lib/prayerUtils";
import { Clock } from "lucide-react";

interface CountdownDisplayProps {
  nextPrayer: PrayerInfo | null;
  timeRemaining: { hours: number; minutes: number; seconds: number };
  progress: number;
  isNextDay: boolean;
}

export function CountdownDisplay({
  nextPrayer,
  timeRemaining,
  progress,
  isNextDay,
}: CountdownDisplayProps) {
  if (!nextPrayer) return null;

  const { hours, minutes, seconds } = timeRemaining;
  const formattedRemaining = formatTimeRemainingArabic(hours, minutes, seconds);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[hsl(205_85%_42%)] to-[hsl(218_70%_28%)] p-6 sm:p-10 text-white shadow-xl">
      {/* Decorative rings */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full border-[28px] border-white/5"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-20 h-72 w-72 rounded-full border-[36px] border-white/5"
      />

      <div className="relative flex flex-col items-center text-center gap-2">
        <p className="text-sm text-white/75">
          {isNextDay ? "الصلاة القادمة غداً" : "الصلاة القادمة"}
        </p>

        <h2 className="text-3xl sm:text-4xl font-bold">
          {nextPrayer.isPrayer ? `صلاة ${nextPrayer.nameAr}` : nextPrayer.nameAr}
        </h2>

        <p className="text-lg sm:text-xl text-white/85 tabular-nums">
          {nextPrayer.time12}
        </p>

        {/* Time boxes */}
        <div
          className="mt-4 flex items-start justify-center gap-2 sm:gap-4"
          dir="ltr"
          role="timer"
          aria-label={`باقي ${formattedRemaining}`}
        >
          <TimeBox value={hours} label="ساعة" />
          <Separator />
          <TimeBox value={minutes} label="دقيقة" />
          <Separator />
          <TimeBox value={seconds} label="ثانية" />
        </div>

        {/* Progress between previous and next prayer */}
        <div className="mt-6 w-full max-w-sm">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-white/80 transition-[width] duration-1000 ease-linear"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-white/85">
            <Clock className="w-4 h-4" />
            باقي {formattedRemaining}
          </p>
        </div>
      </div>
    </div>
  );
}

function Separator() {
  return (
    <span className="pt-3 sm:pt-5 text-2xl sm:text-3xl font-bold text-white/50">
      :
    </span>
  );
}

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 sm:w-24 h-16 sm:h-24 rounded-2xl bg-white/10 ring-1 ring-white/15 flex items-center justify-center">
        <span className="text-3xl sm:text-5xl font-bold tabular-nums">
          {value.toString().padStart(2, "0")}
        </span>
      </div>
      <span className="mt-1.5 text-xs sm:text-sm text-white/70">{label}</span>
    </div>
  );
}
