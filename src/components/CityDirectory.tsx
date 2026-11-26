import { MouseEvent, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronLeft, MapPinned } from "lucide-react";
import { cities, City } from "@/data/cities";
import { cityPath } from "@/lib/seo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Governorates grouped into broad regions, one tab each
const regions: { id: string; name: string; governorates: string[] }[] = [
  {
    id: "greater-cairo",
    name: "القاهرة الكبرى",
    governorates: ["القاهرة", "الجيزة", "القليوبية"],
  },
  {
    id: "alexandria",
    name: "الإسكندرية والساحل",
    governorates: ["الإسكندرية", "البحيرة", "مطروح"],
  },
  {
    id: "delta",
    name: "الدلتا",
    governorates: [
      "الدقهلية",
      "الشرقية",
      "الغربية",
      "المنوفية",
      "كفر الشيخ",
      "دمياط",
    ],
  },
  {
    id: "canal-sinai",
    name: "القناة وسيناء",
    governorates: [
      "بورسعيد",
      "الإسماعيلية",
      "السويس",
      "شمال سيناء",
      "جنوب سيناء",
    ],
  },
  { id: "red-sea", name: "البحر الأحمر", governorates: ["البحر الأحمر"] },
  {
    id: "upper-egypt",
    name: "الصعيد",
    governorates: [
      "الفيوم",
      "بني سويف",
      "المنيا",
      "أسيوط",
      "سوهاج",
      "قنا",
      "الأقصر",
      "أسوان",
    ],
  },
  { id: "new-valley", name: "الوادي الجديد", governorates: ["الوادي الجديد"] },
];

const citiesInRegion = (governorates: string[]): City[] =>
  governorates.flatMap((g) => cities.filter((city) => city.governorate === g));

const regionOf = (city: City) =>
  regions.find((r) => r.governorates.includes(city.governorate))?.id ??
  regions[0].id;

interface CityDirectoryProps {
  // City whose region opens first
  city: City;
  // Highlighted as the page being viewed (unset when using GPS)
  activeCityId?: string;
  onSelectCity: (cityId: string) => void;
}

// Center the active tab in the strip on narrow screens. scrollBy (rather than
// scrollIntoView) keeps the page itself from scrolling.
function centerActiveTab(list: HTMLElement | null) {
  const tab = list?.querySelector<HTMLElement>('[data-state="active"]');
  if (!list || !tab) return;
  const listRect = list.getBoundingClientRect();
  const tabRect = tab.getBoundingClientRect();
  list.scrollBy({
    left:
      tabRect.left + tabRect.width / 2 - (listRect.left + listRect.width / 2),
  });
}

// Links to every city page in region tabs, inside a footer disclosure that is
// collapsed by default. Collapsed content and inactive panels stay in the DOM
// so search engines can follow every link.
export function CityDirectory({
  city,
  activeCityId,
  onSelectCity,
}: CityDirectoryProps) {
  const tabListRef = useRef<HTMLDivElement>(null);

  // Re-center when switching cities while the list is open
  useEffect(() => centerActiveTab(tabListRef.current), [city.id]);

  const handleClick = (
    event: MouseEvent<HTMLAnchorElement>,
    cityId: string,
  ) => {
    // Let modified clicks open a new tab as usual
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    onSelectCity(cityId);
  };

  return (
    <details
      className="group/details pt-4 text-start"
      onToggle={(event) => {
        if (event.currentTarget.open) centerActiveTab(tabListRef.current);
      }}
    >
      <summary className="mx-auto flex w-fit cursor-pointer list-none items-center gap-1.5 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm transition-colors hover:border-primary/40 hover:text-primary [&::-webkit-details-marker]:hidden">
        <MapPinned className="h-3.5 w-3.5" />
        مواقيت الصلاة في مدن مصر
        <ChevronDown className="h-3.5 w-3.5 transition-transform group-open/details:rotate-180" />
      </summary>

      <nav
        aria-label="مدن مصر"
        className="mt-4 animate-fade-in-up motion-reduce:animate-none"
      >
        <Tabs key={city.id} defaultValue={regionOf(city)} dir="rtl">
          <TabsList
            ref={tabListRef}
            className="h-auto w-full justify-start gap-2 overflow-x-auto rounded-none bg-transparent p-0 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_left,transparent,black_2rem)] lg:[mask-image:none]"
          >
            {regions.map((region) => (
              <TabsTrigger
                key={region.id}
                value={region.id}
                className="shrink-0 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-none transition-colors hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
              >
                {region.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {regions.map((region) => (
            <TabsContent
              key={region.id}
              value={region.id}
              forceMount
              className="mt-3 data-[state=inactive]:hidden data-[state=active]:animate-fade-in-up"
            >
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {citiesInRegion(region.governorates).map((c) => {
                  const isActive = c.id === activeCityId;
                  return (
                    <li key={c.id}>
                      <Link
                        to={cityPath(c)}
                        onClick={(event) => handleClick(event, c.id)}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "group/card flex items-center justify-between gap-2 rounded-xl border px-3.5 py-3 transition-colors",
                          isActive
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border bg-card hover:border-primary/40 hover:bg-primary/5",
                        )}
                      >
                        <span className="min-w-0">
                          <span
                            className={cn(
                              "block truncate text-sm font-semibold",
                              isActive ? "text-primary" : "text-foreground",
                            )}
                          >
                            <span className="sr-only">مواقيت الصلاة في </span>
                            {c.name}
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {isActive
                              ? "المدينة الحالية"
                              : `محافظة ${c.governorate}`}
                          </span>
                        </span>
                        <ChevronLeft
                          className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isActive
                              ? "text-primary"
                              : "text-muted-foreground/60 group-hover/card:text-primary",
                          )}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </TabsContent>
          ))}
        </Tabs>
      </nav>
    </details>
  );
}
