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

export function PrayerTimeline({
  prayers,
  nextPrayerIndex,
  isNextDay,
}: PrayerTimelineProps) {
  const getNodeStatus = (index: number) => {
    if (isNextDay) return "past";
    if (index < nextPrayerIndex) return "past";
    if (index === nextPrayerIndex) return "current";
    return "upcoming";
  };

  return (
    <div className="w-full">
      {/* Mobile: Vertical Timeline */}
      <div className="flex flex-col gap-4 md:hidden">
        {prayers.map((prayer, index) => (
          <div key={prayer.key} className="flex flex-col items-center">
            {/* Prayer Node */}
            <div className="flex items-center gap-4 w-full max-w-xs">
              <div
                className={cn(
                  "prayer-node-circle flex-shrink-0",
                  getNodeStatus(index) === "past" && "prayer-node-past",
                  getNodeStatus(index) === "current" && "prayer-node-current",
                  getNodeStatus(index) === "upcoming" && "prayer-node-upcoming",
                )}
              >
                {prayerIcons[prayer.key]}
              </div>

              {/* Prayer name and time */}
              <div className="flex-1 flex justify-between items-center">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    getNodeStatus(index) === "past" && "text-muted-foreground",
                    getNodeStatus(index) === "current" && "text-primary",
                    getNodeStatus(index) === "upcoming" && "text-foreground",
                  )}
                >
                  {prayer.nameAr}
                </p>
                <p
                  className={cn(
                    "text-sm font-medium",
                    getNodeStatus(index) === "past" &&
                      "text-muted-foreground/70",
                    getNodeStatus(index) === "current" && "text-primary",
                    getNodeStatus(index) === "upcoming" &&
                      "text-muted-foreground",
                  )}
                >
                  {prayer.time12}
                </p>
              </div>
            </div>

            {/* Vertical Connector removed as per request */}
          </div>
        ))}
      </div>

      {/* Desktop: Horizontal Timeline */}
      <div className="hidden md:flex items-start justify-between">
        {prayers.map((prayer, index) => (
          <div
            key={prayer.key}
            className="flex items-start flex-1 last:flex-none"
          >
            {/* Prayer Node */}
            <div className="prayer-timeline-node flex-shrink-0">
              <div
                className={cn(
                  "prayer-node-circle",
                  getNodeStatus(index) === "past" && "prayer-node-past",
                  getNodeStatus(index) === "current" && "prayer-node-current",
                  getNodeStatus(index) === "upcoming" && "prayer-node-upcoming",
                )}
              >
                {prayerIcons[prayer.key]}
              </div>

              {/* Prayer name and time */}
              <div className="mt-2 text-center">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    getNodeStatus(index) === "past" && "text-muted-foreground",
                    getNodeStatus(index) === "current" && "text-primary",
                    getNodeStatus(index) === "upcoming" && "text-foreground",
                  )}
                >
                  {prayer.nameAr}
                </p>
                <p
                  className={cn(
                    "text-sm mt-0.5 font-medium whitespace-nowrap",
                    getNodeStatus(index) === "past" &&
                      "text-muted-foreground/70",
                    getNodeStatus(index) === "current" && "text-primary",
                    getNodeStatus(index) === "upcoming" &&
                      "text-muted-foreground",
                  )}
                >
                  {prayer.time12}
                </p>
              </div>
            </div>

            {/* Horizontal Connector */}
            {index < prayers.length - 1 && (
              <div
                className={cn(
                  "timeline-connector-horizontal mt-[27.5px]",
                  index < nextPrayerIndex || isNextDay
                    ? "connector-past"
                    : "connector-upcoming",
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
