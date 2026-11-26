import { Moon, Sun, MapPin } from "lucide-react";
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
    <header className="w-full border-b border-border bg-card">
      <div className="container mx-auto max-w-5xl px-4 pt-4 pb-4 sm:pt-5">
        {/* Brand and theme toggle */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15">
              <img src="/icon-192.png" alt="" className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold leading-tight text-foreground">
                مواقيت الصلاة
              </h1>
              <div className="mt-0.5 flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-xs sm:text-sm">القاهرة، مصر</span>
              </div>
            </div>
          </div>

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

        {/* Dates and current time */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-[1fr_auto_1fr] items-center gap-y-2 rounded-2xl bg-muted/70 px-4 py-3">
          <p
            className="col-span-2 sm:col-span-1 sm:col-start-2 sm:row-start-1 text-center text-2xl sm:text-3xl font-bold text-foreground tabular-nums sm:px-6"
            aria-label="الوقت الحالي"
          >
            {formattedTime}
            <span className="ms-1.5 text-sm font-medium text-muted-foreground">
              {period}
            </span>
          </p>

          <div className="sm:col-start-1 sm:row-start-1 text-start">
            <p className="text-[11px] text-muted-foreground">التاريخ الهجري</p>
            <p className="text-sm sm:text-base font-semibold text-primary">
              {hijriDate}
            </p>
          </div>

          <div className="sm:col-start-3 sm:row-start-1 text-end">
            <p className="text-[11px] text-muted-foreground">التاريخ الميلادي</p>
            <p className="text-sm sm:text-base font-medium text-foreground/85">
              {formattedDate}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
