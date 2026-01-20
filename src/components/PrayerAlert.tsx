import { PrayerInfo } from "@/lib/prayerUtils";
import { Bell } from "lucide-react";

interface PrayerAlertProps {
  prayer: PrayerInfo;
}

export function PrayerAlert({ prayer }: PrayerAlertProps) {
  return (
    <div className="fixed top-4 left-4 right-4 z-50 animate-fade-in-up">
      <div className="max-w-md mx-auto bg-primary text-primary-foreground p-4 rounded-xl shadow-2xl flex items-center gap-4">
        <div className="w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center animate-bounce-soft">
          <Bell className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold">حان وقت الصلاة</h3>
          <p className="text-sm opacity-90">صلاة {prayer.nameAr}</p>
        </div>
      </div>
    </div>
  );
}
