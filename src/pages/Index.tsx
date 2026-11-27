import { useParams } from "react-router-dom";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { useSelectedLocation } from "@/hooks/useSelectedLocation";
import { usePageSeo } from "@/hooks/usePageSeo";
import { getCityById } from "@/data/cities";
import { citySeo, homeSeo } from "@/lib/seo";
import { Header } from "@/components/Header";
import { PrayerTimeline } from "@/components/PrayerTimeline";
import { CountdownDisplay } from "@/components/CountdownDisplay";
import { PrayerAlert } from "@/components/PrayerAlert";
import { CityDirectory } from "@/components/CityDirectory";
import { LocationPrompt } from "@/components/LocationPrompt";
import NotFound from "@/pages/NotFound";

const Index = () => {
  const { citySlug } = useParams();
  const urlCity = citySlug ? getCityById(citySlug) : undefined;
  const location = useSelectedLocation(urlCity?.id);
  const {
    currentTime,
    prayersArray,
    nextPrayer,
    nextPrayerIndex,
    isNextDay,
    timeRemaining,
    progress,
    currentPrayerAlert,
    formattedDate,
    hijriDate,
    occasion,
    isSummerTime,
  } = usePrayerTimes(location.point);

  const isUnknownCity = Boolean(citySlug) && !urlCity;
  usePageSeo(isUnknownCity ? null : urlCity ? citySeo(urlCity) : homeSeo());

  if (isUnknownCity) return <NotFound />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Prayer time alert */}
      {currentPrayerAlert && <PrayerAlert prayer={currentPrayerAlert} />}

      {/* Header */}
      <Header
        formattedDate={formattedDate}
        hijriDate={hijriDate}
        occasion={occasion}
        currentTime={currentTime}
        location={location}
      />

      {/* Main content */}
      <main className="flex-1 container mx-auto max-w-5xl px-4 py-6 sm:py-10 flex flex-col gap-6 sm:gap-8">
        {location.showLocationPrompt && <LocationPrompt location={location} />}

        {/* Re-keyed per location so switching cities plays an entrance animation */}
        <div
          key={location.isCurrentLocation ? "gps" : location.city.id}
          className="flex flex-col gap-6 sm:gap-8 animate-fade-in-up motion-reduce:animate-none"
        >
          {/* Countdown section */}
          <section>
            <CountdownDisplay
              nextPrayer={nextPrayer}
              timeRemaining={timeRemaining}
              progress={progress}
              isNextDay={isNextDay}
            />
          </section>

          {/* Today's prayers */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {location.isCurrentLocation
                ? "مواقيت الصلاة اليوم في موقعك"
                : `مواقيت الصلاة اليوم في ${location.city.name}`}
            </h2>
            <PrayerTimeline
              prayers={prayersArray}
              nextPrayerIndex={nextPrayerIndex}
              isNextDay={isNextDay}
            />
          </section>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground mt-auto pt-6 border-t border-border space-y-1.5">
          <p>أوقات الصلاة محسوبة حسب الهيئة المصرية العامة للمساحة</p>
          <p>
            زاوية الفجر: ١٩.٥° | زاوية العشاء: ١٧.٥°
            {isSummerTime && " | التوقيت الصيفي مُفعّل (+١ ساعة)"}
          </p>
          <CityDirectory
            city={location.city}
            activeCityId={location.isCurrentLocation ? undefined : location.city.id}
            onSelectCity={location.selectCity}
          />
        </footer>
      </main>
    </div>
  );
};

export default Index;
