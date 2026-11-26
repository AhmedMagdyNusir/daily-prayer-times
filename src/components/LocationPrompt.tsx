import { LocateFixed, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { SelectedLocation } from "@/hooks/useSelectedLocation";
import { Button } from "@/components/ui/button";
import { locationErrorMessage } from "@/lib/geolocation";

// First-visit offer to use GPS. The browser's permission dialog only appears
// after the user taps the button.
export function LocationPrompt({ location }: { location: SelectedLocation }) {
  const handleLocateMe = async () => {
    try {
      await location.locateMe();
      toast.success("تم تحديد موقعك الحالي");
    } catch (error) {
      toast.error(locationErrorMessage(error));
    }
  };

  return (
    <div className="relative flex flex-col gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 pe-10 sm:flex-row sm:items-center sm:justify-between animate-fade-in-up motion-reduce:animate-none">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <LocateFixed className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">اعرض مواقيت مكانك بالظبط؟</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            المواقيت المعروضة الآن للقاهرة. موقعك يُستخدم على جهازك فقط.
          </p>
        </div>
      </div>

      <Button
        size="sm"
        onClick={handleLocateMe}
        disabled={location.isLocating}
        className="shrink-0 rounded-full sm:me-2"
      >
        {location.isLocating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LocateFixed className="h-4 w-4" />
        )}
        استخدم موقعي
      </Button>

      <button
        type="button"
        onClick={location.dismissLocationPrompt}
        className="absolute end-2 top-2 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
        aria-label="إخفاء"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
