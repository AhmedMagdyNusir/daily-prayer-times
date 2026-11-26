import { useState } from "react";
import { Check, ChevronDown, LocateFixed, Loader2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { cities } from "@/data/cities";
import { SelectedLocation } from "@/hooks/useSelectedLocation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

// Cities grouped by governorate, in list order
const governorates = cities.reduce<Map<string, typeof cities>>((groups, city) => {
  groups.set(city.governorate, [...(groups.get(city.governorate) ?? []), city]);
  return groups;
}, new Map());

function locationErrorMessage(error: unknown): string {
  if (error instanceof GeolocationPositionError) {
    if (error.code === error.PERMISSION_DENIED) {
      return "لم يتم السماح بالوصول إلى الموقع. فعّل إذن الموقع من إعدادات المتصفح.";
    }
    if (error.code === error.TIMEOUT) return "استغرق تحديد الموقع وقتاً طويلاً، حاول مرة أخرى.";
  }
  if (error instanceof Error && error.message === "unsupported") {
    return "المتصفح لا يدعم تحديد الموقع.";
  }
  return "تعذّر تحديد موقعك الحالي.";
}

export function LocationPicker({ location }: { location: SelectedLocation }) {
  const [open, setOpen] = useState(false);
  const { city, isCurrentLocation, isLocating } = location;

  const handleLocateMe = async () => {
    setOpen(false);
    try {
      await location.locateMe();
      toast.success("تم تحديد موقعك الحالي");
    } catch (error) {
      toast.error(locationErrorMessage(error));
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="mt-0.5 -ms-1.5 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs sm:text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="تغيير المدينة"
        >
          {isLocating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : isCurrentLocation ? (
            <LocateFixed className="w-3.5 h-3.5 text-primary" />
          ) : (
            <MapPin className="w-3.5 h-3.5" />
          )}
          <span>
            {isLocating
              ? "جارٍ تحديد موقعك…"
              : isCurrentLocation
                ? `موقعي الحالي (قرب ${city.name})`
                : `${city.name}، مصر`}
          </span>
          <ChevronDown className="w-3.5 h-3.5 opacity-60" />
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-72 p-0">
        <Command>
          <CommandInput placeholder="ابحث عن مدينة أو محافظة…" />
          <CommandList className="scrollbar-thin max-h-[320px] overscroll-contain py-1">
            <CommandEmpty>لا توجد نتائج</CommandEmpty>

            <CommandGroup>
              <CommandItem
                value="موقعي الحالي gps"
                onSelect={handleLocateMe}
                className="gap-2 font-medium text-primary data-[selected=true]:text-primary"
              >
                <LocateFixed className="h-4 w-4" />
                استخدام موقعي الحالي
                {isCurrentLocation && <Check className="ms-auto h-4 w-4" />}
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />

            {[...governorates].map(([governorate, list]) => (
              <CommandGroup key={governorate} heading={governorate}>
                {list.map((c) => {
                  const selected = !isCurrentLocation && c.id === city.id;
                  return (
                    <CommandItem
                      key={c.id}
                      value={`${c.name} ${c.governorate}`}
                      onSelect={() => {
                        location.selectCity(c.id);
                        setOpen(false);
                      }}
                      className={cn(selected && "font-semibold")}
                    >
                      {c.name}
                      {selected && <Check className="ms-auto h-4 w-4 text-primary" />}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
