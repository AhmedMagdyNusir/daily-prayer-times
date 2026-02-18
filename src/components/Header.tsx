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
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${period}`;

  return (
    <header className="w-full bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Title and location */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              مواقيت الصلاة
            </h1>
            <div className="flex items-center gap-1 mt-1 text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span className="text-xs sm:text-sm">القاهرة، مصر</span>
            </div>
          </div>

          {/* Current time and dark mode toggle */}
          <div className="flex items-center gap-3">
<<<<<<< HEAD
            <div className="flex flex-col">
=======
            <div className="flex flex-col items-center justify-center">
>>>>>>> af5a4e2bfa35c8ca776801d4fbd68c87aa3dac60
              <span className="text-[10px] sm:text-xs text-muted-foreground">
                الوقت | كل ثانية تُكتب
              </span>

              <p className="text-lg sm:text-xl font-bold text-primary font-mono">
                {formattedTime}
              </p>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={toggle}
              className="shrink-0"
              aria-label={isDark ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <hr className="my-4" />

        {/* Date bar */}
        <div className="flex items-center justify-center gap-3 text-xs sm:text-sm text-muted-foreground">
          <span className="text-primary font-medium">{hijriDate}</span>
          <span className="text-border">|</span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </header>
  );
}
