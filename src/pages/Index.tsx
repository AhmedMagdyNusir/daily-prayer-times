import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { Header } from "@/components/Header";
import { PrayerTimeline } from "@/components/PrayerTimeline";
import { CountdownDisplay } from "@/components/CountdownDisplay";
import { PrayerAlert } from "@/components/PrayerAlert";

const Index = () => {
  const {
    currentTime,
    prayersArray,
    nextPrayer,
    nextPrayerIndex,
    isNextDay,
    timeRemaining,
    currentPrayerAlert,
    formattedDate,
  } = usePrayerTimes();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Prayer time alert */}
      {currentPrayerAlert && <PrayerAlert prayer={currentPrayerAlert} />}

      {/* Header */}
      <Header formattedDate={formattedDate} currentTime={currentTime} />

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6 sm:py-10 flex flex-col gap-8">
        {/* Timeline section */}
        <section className="bg-card rounded-2xl p-4 sm:p-6 shadow-lg border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-6 text-center">
            أوقات الصلاة اليوم
          </h2>
          <PrayerTimeline
            prayers={prayersArray}
            nextPrayerIndex={nextPrayerIndex}
            isNextDay={isNextDay}
          />
        </section>

        {/* Countdown section */}
        <section>
          <CountdownDisplay
            nextPrayer={nextPrayer}
            timeRemaining={timeRemaining}
            isNextDay={isNextDay}
          />
        </section>

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground mt-auto pt-4 border-t border-border">
          <p>أوقات الصلاة محسوبة حسب الهيئة المصرية العامة للمساحة</p>
          <p className="mt-1">زاوية الفجر: ١٩.٥° | زاوية العشاء: ١٧.٥°</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
