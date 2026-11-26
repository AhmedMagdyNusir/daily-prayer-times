import { useCallback, useState } from "react";
import { City, DEFAULT_CITY_ID, findNearestCity, getCityById } from "@/data/cities";
import { GeoPoint } from "@/lib/prayerCalc";

type SavedLocation =
  | { type: "city"; cityId: string }
  | { type: "gps"; lat: number; lng: number };

const STORAGE_KEY = "location";

function readSavedLocation(): SavedLocation {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as SavedLocation;
      if (saved.type === "gps" && Number.isFinite(saved.lat) && Number.isFinite(saved.lng)) {
        return saved;
      }
      if (saved.type === "city" && getCityById(saved.cityId)) return saved;
    }
  } catch {
    // Fall through to the default city
  }
  return { type: "city", cityId: DEFAULT_CITY_ID };
}

export interface SelectedLocation {
  point: GeoPoint;
  // The chosen city, or the nearest listed city for a GPS position
  city: City;
  isCurrentLocation: boolean;
  isLocating: boolean;
  selectCity: (cityId: string) => void;
  locateMe: () => Promise<void>;
}

export function useSelectedLocation(): SelectedLocation {
  const [saved, setSaved] = useState<SavedLocation>(readSavedLocation);
  const [isLocating, setIsLocating] = useState(false);

  const save = useCallback((location: SavedLocation) => {
    setSaved(location);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
    } catch {
      // Not persisted; still applies for this session
    }
  }, []);

  const selectCity = useCallback(
    (cityId: string) => save({ type: "city", cityId }),
    [save],
  );

  const locateMe = useCallback(() => {
    if (!("geolocation" in navigator)) {
      return Promise.reject(new Error("unsupported"));
    }
    setIsLocating(true);
    return new Promise<void>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          save({ type: "gps", lat: coords.latitude, lng: coords.longitude });
          setIsLocating(false);
          resolve();
        },
        (error) => {
          setIsLocating(false);
          reject(error);
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 10 * 60 * 1000 },
      );
    });
  }, [save]);

  if (saved.type === "gps") {
    return {
      point: { lat: saved.lat, lng: saved.lng },
      city: findNearestCity(saved.lat, saved.lng),
      isCurrentLocation: true,
      isLocating,
      selectCity,
      locateMe,
    };
  }

  const city = getCityById(saved.cityId) ?? getCityById(DEFAULT_CITY_ID)!;
  return {
    point: { lat: city.lat, lng: city.lng },
    city,
    isCurrentLocation: false,
    isLocating,
    selectCity,
    locateMe,
  };
}
