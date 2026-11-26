import { Moon, Sun, MapPin, CalendarDays } from "lucide-react";
import { useDarkMode } from "@/hooks/useDarkMode";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  formattedDate: string;
  hijriDate: string;
  currentTime: Date;
}

export function Header({ formattedDate, hijriDate, currentTime }: HeaderProps) {
  const { isDark, toggle } = useDarkMode();

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  const period = hours < 12 ? "صـ" : "مـ";
  const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const formattedTime = `${hours12}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <header className="w-full border-b border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/70">
      <div className="container mx-auto max-w-5xl px-4 py-4 sm:py-5">
        <div className="flex items-center justify-between gap-4">
          {/* Title and location */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              مواقيت الصلاة
            </h1>
            <div className="flex items-center gap-1 mt-1 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-xs sm:text-sm">القاهرة، مصر</span>
            </div>
          </div>

          {/* Current time and dark mode toggle */}
          <div className="flex items-center gap-3">
            <p
              className="text-xl sm:text-2xl font-bold text-foreground tabular-nums"
              aria-label="الوقت الحالي"
            >
              {formattedTime}
              <span className="ms-1.5 text-sm font-medium text-muted-foreground">
                {period}
              </span>
            </p>

            <Button
              variant="outline"
              size="icon"
              onClick={toggle}
              className="shrink-0 rounded-full"
              aria-label={isDark ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Date bar */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
            <CalendarDays className="w-3.5 h-3.5" />
            {hijriDate}
          </span>
          <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
            {formattedDate}
          </span>
        </div>
      </div>
    </header>
  );
}
