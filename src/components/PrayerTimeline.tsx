import { PrayerInfo } from "@/lib/prayerUtils";
import { Sun, Moon, Sunrise, Sunset, CloudSun } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrayerTimelineProps {
  prayers: PrayerInfo[];
  nextPrayerIndex: number;
  isNextDay: boolean;
}

const prayerIcons: Record<string, React.ReactNode> = {
  fajr: <Moon className="w-5 h-5" />,
  sunrise: <Sunrise className="w-5 h-5" />,
  dhuhr: <Sun className="w-5 h-5" />,
  asr: <CloudSun className="w-5 h-5" />,
  maghrib: <Sunset className="w-5 h-5" />,
  isha: <Moon className="w-5 h-5" />,
};

type Status = "past" | "current" | "upcoming";

export function PrayerTimeline({
  prayers,
  nextPrayerIndex,
  isNextDay,
}: PrayerTimelineProps) {
  const getStatus = (index: number): Status => {
    if (isNextDay || index < nextPrayerIndex) return "past";
    if (index === nextPrayerIndex) return "current";
    return "upcoming";
  };

  return (
    <ol className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
      {prayers.map((prayer, index) => {
        const status = getStatus(index);
        return (
          <li
            key={prayer.key}
            aria-current={status === "current" ? "time" : undefined}
            className={cn(
              "relative flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors",
              "sm:flex-col sm:gap-2 sm:py-5 sm:text-center",
              status === "current" &&
                "border-primary bg-primary/5 ring-1 ring-primary shadow-sm",
              status === "upcoming" && "border-border bg-card",
              status === "past" && "border-transparent bg-muted/60",
            )}
          >
            {/* Icon */}
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                status === "current" && "bg-primary text-primary-foreground",
                status === "upcoming" &&
                  (prayer.isPrayer
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-sunrise/15 text-sunrise"),
                status === "past" && "bg-background/70 text-muted-foreground",
              )}
            >
              {prayerIcons[prayer.key]}
            </div>

            {/* Name and time */}
            <div className="flex flex-1 items-center justify-between sm:flex-col sm:gap-0.5">
              <p
                className={cn(
                  "text-base font-semibold",
                  status === "current" && "text-primary",
                  status === "upcoming" && "text-foreground",
                  status === "past" && "text-muted-foreground",
                )}
              >
                {prayer.nameAr}
              </p>
              <p
                className={cn(
                  "text-base font-medium tabular-nums whitespace-nowrap",
                  status === "current" && "text-primary",
                  status === "upcoming" && "text-foreground/80",
                  status === "past" && "text-muted-foreground/80",
                )}
              >
                {prayer.time12}
              </p>
            </div>

            {status === "current" && (
              <span className="absolute -top-2 left-3 sm:left-1/2 sm:-translate-x-1/2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                القادمة
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
