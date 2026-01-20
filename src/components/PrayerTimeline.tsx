import { PrayerInfo } from "@/lib/prayerUtils";
import { Sun, Moon, Sunrise, Sunset, CloudSun, Clock } from "lucide-react";
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

export function PrayerTimeline({ prayers, nextPrayerIndex, isNextDay }: PrayerTimelineProps) {
  const getNodeStatus = (index: number) => {
    if (isNextDay) {
      // All prayers are past if we're waiting for tomorrow's Fajr
      return "past";
    }
    if (index < nextPrayerIndex) return "past";
    if (index === nextPrayerIndex) return "current";
    return "upcoming";
  };

  return (
    <div className="w-full px-2 sm:px-4">
      {/* Timeline container */}
      <div className="flex items-center justify-between gap-1 sm:gap-2">
        {prayers.map((prayer, index) => (
          <div key={prayer.key} className="flex items-center flex-1 last:flex-none">
            {/* Prayer Node */}
            <div className="prayer-timeline-node flex-shrink-0">
              <div
                className={cn(
                  "prayer-node-circle",
                  getNodeStatus(index) === "past" && "prayer-node-past",
                  getNodeStatus(index) === "current" && "prayer-node-current",
                  getNodeStatus(index) === "upcoming" && "prayer-node-upcoming",
                  prayer.key === "sunrise" && getNodeStatus(index) !== "current" && "prayer-node-sunrise"
                )}
              >
                {prayerIcons[prayer.key]}
              </div>
              
              {/* Prayer name and time */}
              <div className="mt-2 text-center">
                <p
                  className={cn(
                    "text-xs sm:text-sm font-semibold",
                    getNodeStatus(index) === "past" && "text-muted-foreground",
                    getNodeStatus(index) === "current" && "text-primary",
                    getNodeStatus(index) === "upcoming" && "text-foreground"
                  )}
                >
                  {prayer.nameAr}
                </p>
                <p
                  className={cn(
                    "text-xs sm:text-sm mt-0.5 font-medium",
                    getNodeStatus(index) === "past" && "text-muted-foreground/70",
                    getNodeStatus(index) === "current" && "text-primary",
                    getNodeStatus(index) === "upcoming" && "text-muted-foreground"
                  )}
                  dir="ltr"
                >
                  {prayer.time}
                </p>
              </div>
            </div>

            {/* Connector line (except after last item) */}
            {index < prayers.length - 1 && (
              <div
                className={cn(
                  "timeline-connector",
                  index < nextPrayerIndex || isNextDay ? "connector-past" : "connector-upcoming"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
