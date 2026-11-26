import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { City, DEFAULT_CITY_ID, findNearestCity, getCityById } from "@/data/cities";
import { GeoPoint } from "@/lib/prayerCalc";
import { getCurrentPosition, getLocationPermission } from "@/lib/geolocation";

type SavedLocation =
  | { type: "city"; cityId: string }
  | { type: "gps"; lat: number; lng: number };

const STORAGE_KEY = "location";
const PROMPT_DISMISSED_KEY = "location-prompt-dismissed";

// null when the user has never chosen a location
function readSavedLocation(): SavedLocation | null {
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
    // Treated as no saved choice
  }
  return null;
}

function readPromptDismissed(): boolean {
  try {
    return localStorage.getItem(PROMPT_DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
}

export interface SelectedLocation {
  point: GeoPoint;
  // The chosen city, or the nearest listed city for a GPS position
  city: City;
  isCurrentLocation: boolean;
  isLocating: boolean;
  // Offer GPS to first-time visitors on the home page
  showLocationPrompt: boolean;
  selectCity: (cityId: string) => void;
  locateMe: () => Promise<void>;
  dismissLocationPrompt: () => void;
}

// A city in the URL (e.g. /alexandria) takes precedence over the saved choice.
// Picking a city navigates to its page; using GPS goes back to the home page.
// Without a saved choice the home page shows Cairo, unless location access was
// already granted, in which case GPS is used without asking.
export function useSelectedLocation(urlCityId?: string): SelectedLocation {
  const navigate = useNavigate();
  const [saved, setSaved] = useState<SavedLocation | null>(readSavedLocation);
  const [isLocating, setIsLocating] = useState(false);
  const [permission, setPermission] = useState<PermissionState | null>(null);
  const [promptDismissed, setPromptDismissed] = useState(readPromptDismissed);

  const save = useCallback((location: SavedLocation) => {
    setSaved(location);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
    } catch {
      // Not persisted; still applies for this session
    }
  }, []);

  // On load: if location access is already granted and the user hasn't picked
  // a city, use (or refresh) the GPS position silently, so it follows them
  // when they travel. Failures keep the current location.
  useEffect(() => {
    let cancelled = false;
    getLocationPermission().then((state) => {
      if (cancelled) return;
      setPermission(state);
      const initial = readSavedLocation();
      if (state !== "granted" || initial?.type === "city") return;
      getCurrentPosition()
        .then((point) => {
          if (!cancelled) save({ type: "gps", ...point });
        })
        .catch(() => {});
    });
    return () => {
      cancelled = true;
    };
  }, [save]);

  const selectCity = useCallback(
    (cityId: string) => {
      save({ type: "city", cityId });
      navigate(`/${cityId}`);
    },
    [save, navigate],
  );

  const locateMe = useCallback(async () => {
    setIsLocating(true);
    try {
      const point = await getCurrentPosition();
      save({ type: "gps", ...point });
      setPermission("granted");
      navigate("/");
    } finally {
      setIsLocating(false);
    }
  }, [save, navigate]);

  const dismissLocationPrompt = useCallback(() => {
    setPromptDismissed(true);
    try {
      localStorage.setItem(PROMPT_DISMISSED_KEY, "1");
    } catch {
      // Hidden for this session only
    }
  }, []);

  const urlCity = urlCityId ? getCityById(urlCityId) : undefined;
  const showLocationPrompt =
    !urlCity && saved === null && permission === "prompt" && !promptDismissed;
  const common = {
    isLocating,
    showLocationPrompt,
    selectCity,
    locateMe,
    dismissLocationPrompt,
  };

  if (urlCity) {
    return {
      point: { lat: urlCity.lat, lng: urlCity.lng },
      city: urlCity,
      isCurrentLocation: false,
      ...common,
    };
  }

  if (saved?.type === "gps") {
    return {
      point: { lat: saved.lat, lng: saved.lng },
      city: findNearestCity(saved.lat, saved.lng),
      isCurrentLocation: true,
      ...common,
    };
  }

  const city = (saved && getCityById(saved.cityId)) || getCityById(DEFAULT_CITY_ID)!;
  return {
    point: { lat: city.lat, lng: city.lng },
    city,
    isCurrentLocation: false,
    ...common,
  };
}
