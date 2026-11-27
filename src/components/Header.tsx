import { Moon, Sun, MoonStar, CalendarDays } from "lucide-react";
import { useDarkMode } from "@/hooks/useDarkMode";
import { SelectedLocation } from "@/hooks/useSelectedLocation";
import { Button } from "@/components/ui/button";
import { LocationPicker } from "@/components/LocationPicker";
import { FestiveOrnament } from "@/components/FestiveOrnament";
import { Occasion, occasionGreetings } from "@/lib/occasions";
import { cn } from "@/lib/utils";

interface HeaderProps {
  formattedDate: string;
  hijriDate: string;
  occasion: Occasion | null;
  currentTime: Date;
  location: SelectedLocation;
}

export function Header({ formattedDate, hijriDate, occasion, currentTime, location }: HeaderProps) {
  const { isDark, toggle } = useDarkMode();

  const hours = currentTime.getHours();
  const period = hours < 12 ? "صباحاً" : "مساءً";
  const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const hhmm = `${hours12}:${currentTime.getMinutes().toString().padStart(2, "0")}`;
  const ss = currentTime.getSeconds().toString().padStart(2, "0");

  return (
    <header className="relative w-full overflow-hidden bg-gradient-to-b from-primary/10 via-primary/[0.04] to-background">
      {/* Decorative pattern, fading out toward the content */}
      <div
        aria-hidden
        className="islamic-pattern pointer-events-none absolute inset-0 opacity-[0.07] dark:opacity-[0.09]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-b from-transparent to-background"
      />

      <div className="relative container mx-auto max-w-5xl px-4 pt-5 pb-2 sm:pt-6">
        {/* Brand and theme toggle */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-card shadow-sm ring-1 ring-border">
              <img src="/icon-192.png" alt="" className="h-8 w-8" />
              {occasion && <FestiveOrnament occasion={occasion} />}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h1 className="text-xl sm:text-2xl font-bold leading-tight text-foreground">
                  مواقيت الصلاة
                </h1>
                {occasion && (
                  <span className="rounded-full bg-festive/15 px-2 py-0.5 text-[11px] sm:text-xs font-semibold text-festive-foreground ring-1 ring-festive/30">
                    {occasionGreetings[occasion]}
                  </span>
                )}
              </div>
              <LocationPicker location={location} />
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={toggle}
            className="shrink-0 rounded-full bg-card/80 shadow-sm"
            aria-label={isDark ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>

        {/* Current time and dates */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-[1fr_auto_1fr] items-stretch rounded-2xl border border-border bg-card shadow-sm">
          <div
            className="col-span-2 sm:col-span-1 sm:col-start-2 sm:row-start-1 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-x border-border px-8 py-3 sm:py-4"
            aria-label="الوقت الحالي"
          >
            <p className="flex items-baseline gap-0.5 tabular-nums" dir="ltr">
              <span className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                {hhmm}
              </span>
              <span className="text-lg sm:text-xl font-semibold text-primary">
                :{ss}
              </span>
            </p>
            <p className="text-xs text-muted-foreground">{period}</p>
          </div>

          <DateItem
            icon={<MoonStar className="h-4 w-4" />}
            label="التاريخ الهجري"
            value={hijriDate}
            accent
            className="sm:col-start-1 sm:row-start-1 border-e sm:border-e-0 border-border"
          />
          <DateItem
            icon={<CalendarDays className="h-4 w-4" />}
            label="التاريخ الميلادي"
            value={formattedDate}
            className="sm:col-start-3 sm:row-start-1 sm:justify-end"
          />
        </div>
      </div>
    </header>
  );
}

function DateItem({
  icon,
  label,
  value,
  accent = false,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-center sm:justify-start gap-2.5 px-3 py-3 sm:px-5 text-center sm:text-start", className)}>
      <div
        className={cn(
          "hidden sm:flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
          accent ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p
          className={cn(
            "text-[13px] sm:text-base font-semibold leading-snug whitespace-nowrap",
            accent ? "text-primary" : "text-foreground/90",
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
