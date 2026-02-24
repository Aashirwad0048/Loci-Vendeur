import env from "../config/env.js";

const geocodeCache = new Map();

const normalize = (value) => (value || "").trim().toLowerCase();

const buildLocationQuery = ({ city, state }) => {
  const parts = [city, state, "India"].filter(Boolean).map((p) => p.trim());
  return parts.join(", ");
};

const withTimeout = async (promise, ms = 8000) => {
  let timer = null;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error("Request timed out")), ms);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timer);
  }
};

const haversineDistanceKm = (a, b) => {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const latDiff = toRad(b.lat - a.lat);
  const lngDiff = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(latDiff / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(lngDiff / 2) ** 2;
  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

export const geocodeLocation = async ({ city, state }) => {
  const query = buildLocationQuery({ city, state });
  if (!query) {
    return null;
  }

  const cacheKey = normalize(query);
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey);
  }

  try {
    const response = await withTimeout(
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`,
        {
          headers: {
            "User-Agent": env.geocodeUserAgent,
            Accept: "application/json",
          },
        }
      )
    );

    if (!response.ok) {
      geocodeCache.set(cacheKey, null);
      return null;
    }

    const data = await response.json();
    const result = data?.[0];
    if (!result?.lat || !result?.lon) {
      geocodeCache.set(cacheKey, null);
      return null;
    }

    const coordinates = {
      lat: Number(result.lat),
      lng: Number(result.lon),
    };

    geocodeCache.set(cacheKey, coordinates);
    return coordinates;
  } catch {
    geocodeCache.set(cacheKey, null);
    return null;
  }
};

export const getDistanceAndDuration = async ({ from, to }) => {
  if (!from || !to) {
    return { distanceKm: Number.POSITIVE_INFINITY, durationMinutes: null, source: "none" };
  }

  if (!env.orsApiKey) {
    return {
      distanceKm: haversineDistanceKm(from, to),
      durationMinutes: null,
      source: "haversine",
    };
  }

  try {
    const response = await withTimeout(
      fetch("https://api.openrouteservice.org/v2/directions/driving-car", {
        method: "POST",
        headers: {
          Authorization: env.orsApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coordinates: [
            [from.lng, from.lat],
            [to.lng, to.lat],
          ],
        }),
      })
    );

    if (!response.ok) {
      return {
        distanceKm: haversineDistanceKm(from, to),
        durationMinutes: null,
        source: "haversine",
      };
    }

    const data = await response.json();
    const summary = data?.routes?.[0]?.summary;

    if (!summary?.distance) {
      return {
        distanceKm: haversineDistanceKm(from, to),
        durationMinutes: null,
        source: "haversine",
      };
    }

    return {
      distanceKm: summary.distance / 1000,
      durationMinutes: summary.duration ? summary.duration / 60 : null,
      source: "ors",
    };
  } catch {
    return {
      distanceKm: haversineDistanceKm(from, to),
      durationMinutes: null,
      source: "haversine",
    };
  }
};
