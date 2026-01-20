import { Moon, Sun, MapPin } from "lucide-react";
import { useDarkMode } from "@/hooks/useDarkMode";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  formattedDate: string;
  currentTime: Date;
}

export function Header({ formattedDate, currentTime }: HeaderProps) {
  const { isDark, toggle } = useDarkMode();

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

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
            <div className="text-left">
              <p className="text-xs sm:text-sm text-muted-foreground">{formattedDate}</p>
              <p className="text-lg sm:text-xl font-bold text-primary font-mono" dir="ltr">
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
      </div>
    </header>
  );
}
