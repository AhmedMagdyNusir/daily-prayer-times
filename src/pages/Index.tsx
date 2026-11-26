import { useEffect } from "react";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { useSelectedLocation } from "@/hooks/useSelectedLocation";
import { Header } from "@/components/Header";
import { PrayerTimeline } from "@/components/PrayerTimeline";
import { CountdownDisplay } from "@/components/CountdownDisplay";
import { PrayerAlert } from "@/components/PrayerAlert";

const Index = () => {
  const location = useSelectedLocation();
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
    isSummerTime,
  } = usePrayerTimes(location.point);

  const cityName = location.city.name;
  useEffect(() => {
    document.title = `مواقيت الصلاة - ${cityName}`;
  }, [cityName]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Prayer time alert */}
      {currentPrayerAlert && <PrayerAlert prayer={currentPrayerAlert} />}

      {/* Header */}
      <Header
        formattedDate={formattedDate}
        hijriDate={hijriDate}
        currentTime={currentTime}
        location={location}
      />

      {/* Main content */}
      <main className="flex-1 container mx-auto max-w-5xl px-4 py-6 sm:py-10 flex flex-col gap-6 sm:gap-8">
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
            أوقات الصلاة اليوم
          </h2>
          <PrayerTimeline
            prayers={prayersArray}
            nextPrayerIndex={nextPrayerIndex}
            isNextDay={isNextDay}
          />
        </section>

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground mt-auto pt-6 border-t border-border space-y-1.5">
          <p>أوقات الصلاة محسوبة حسب الهيئة المصرية العامة للمساحة</p>
          <p>
            زاوية الفجر: ١٩.٥° | زاوية العشاء: ١٧.٥°
            {isSummerTime && " | التوقيت الصيفي مُفعّل (+١ ساعة)"}
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
