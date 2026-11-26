import { describe, it, expect } from "vitest";
import { isInEgypt } from "@/lib/geolocation";
import { cities } from "@/data/cities";

describe("isInEgypt", () => {
  it("accepts every listed city", () => {
    for (const city of cities) expect(isInEgypt(city), city.name).toBe(true);
  });

  it("rejects positions abroad", () => {
    expect(isInEgypt({ lat: 24.71, lng: 46.68 })).toBe(false); // Riyadh
    expect(isInEgypt({ lat: 51.51, lng: -0.13 })).toBe(false); // London
  });
});
