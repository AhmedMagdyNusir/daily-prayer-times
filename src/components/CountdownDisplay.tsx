import { PrayerInfo } from "@/lib/prayerUtils";
import { formatTimeRemainingArabic, toArabicNumerals } from "@/lib/prayerUtils";
import { Clock } from "lucide-react";

interface CountdownDisplayProps {
  nextPrayer: PrayerInfo | null;
  timeRemaining: { hours: number; minutes: number; seconds: number };
  isNextDay: boolean;
}

export function CountdownDisplay({
  nextPrayer,
  timeRemaining,
  isNextDay,
}: CountdownDisplayProps) {
  if (!nextPrayer) return null;

  const { hours, minutes, seconds } = timeRemaining;
  const formattedRemaining = formatTimeRemainingArabic(hours, minutes, seconds);

  return (
    <div className="text-center flex-1 p-6 sm:p-8 bg-card rounded-2xl shadow border border-border flex flex-col gap-2 justify-center">
      {/* Next day indicator */}
      {isNextDay && (
        <p className="text-sm text-muted-foreground">الصلاة القادمة غداً</p>
      )}

      {/* Prayer name */}
      <h2 className="text-2xl sm:text-3xl font-bold text-primary">
        {nextPrayer.isPrayer ? `صلاة ${nextPrayer.nameAr}` : nextPrayer.nameAr}
      </h2>

      {/* Prayer time */}
      <p className="text-lg sm:text-xl text-muted-foreground mb-4">
        {nextPrayer.time12}
      </p>

      {/* Countdown timer */}
      <div className="flex items-center justify-center gap-3 mb-2">
        <Clock className="w-5 h-5 text-primary" />
        <span className="text-muted-foreground">باقي</span>
      </div>

      {/* Time boxes */}
      <div
        className="flex items-center justify-center gap-3 sm:gap-4"
        dir="ltr"
      >
        <TimeBox value={hours} label="ساعة" />
        <span className="text-2xl sm:text-3xl font-bold text-primary">:</span>
        <TimeBox value={minutes} label="دقيقة" />
        <span className="text-2xl sm:text-3xl font-bold text-primary">:</span>
        <TimeBox value={seconds} label="ثانية" />
      </div>

      {/* Text format */}
      <p className="mt-6 text-lg text-foreground font-medium">
        {formattedRemaining}
      </p>
    </div>
  );
}

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 sm:w-20 h-16 sm:h-20 bg-secondary rounded-xl flex items-center justify-center shadow-inner">
        <span className="text-2xl sm:text-3xl font-bold text-secondary-foreground">
          {value.toString().padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs sm:text-sm text-muted-foreground mt-1">
        {label}
      </span>
    </div>
  );
}
