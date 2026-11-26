import { GeoPoint } from "@/lib/prayerCalc";

// Rough bounding box of Egypt. Times are calculated in Egypt's time zone, so
// positions outside it would give wrong results.
export function isInEgypt({ lat, lng }: GeoPoint): boolean {
  return lat >= 21.7 && lat <= 31.8 && lng >= 24.6 && lng <= 37;
}

export class LocationError extends Error {
  constructor(public reason: "unsupported" | "outside-egypt") {
    super(reason);
  }
}

export function getCurrentPosition(): Promise<GeoPoint> {
  if (!("geolocation" in navigator)) {
    return Promise.reject(new LocationError("unsupported"));
  }
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const point = { lat: coords.latitude, lng: coords.longitude };
        if (isInEgypt(point)) resolve(point);
        else reject(new LocationError("outside-egypt"));
      },
      reject,
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10 * 60 * 1000 },
    );
  });
}

// "granted" | "denied" | "prompt", or "prompt" when the Permissions API is
// unavailable (the browser will ask on first use)
export async function getLocationPermission(): Promise<PermissionState> {
  try {
    const status = await navigator.permissions.query({ name: "geolocation" });
    return status.state;
  } catch {
    return "prompt";
  }
}

export function locationErrorMessage(error: unknown): string {
  if (error instanceof LocationError) {
    return error.reason === "outside-egypt"
      ? "موقعك خارج مصر، والتطبيق يدعم مدن مصر فقط. اختر مدينة من القائمة."
      : "المتصفح لا يدعم تحديد الموقع.";
  }
  if (error instanceof GeolocationPositionError) {
    if (error.code === error.PERMISSION_DENIED) {
      return "لم يتم السماح بالوصول إلى الموقع. فعّل إذن الموقع من إعدادات المتصفح.";
    }
    if (error.code === error.TIMEOUT) return "استغرق تحديد الموقع وقتاً طويلاً، حاول مرة أخرى.";
  }
  return "تعذّر تحديد موقعك الحالي.";
}
