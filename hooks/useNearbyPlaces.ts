import { useState, useEffect } from 'react';

export interface NearbyPlace {
  id: number;
  name: string;
  dist: number;       // meter
  distLabel: string;  // "1.2 km" atau "800 m"
  timeLabel: string;  // estimasi berkendara
  lat: number;
  lng: number;
}

export interface NearbyCategories {
  transport: NearbyPlace[];
  school: NearbyPlace[];
  shopping: NearbyPlace[];
  health: NearbyPlace[];
  tourism: NearbyPlace[];
  worship: NearbyPlace[];
}

// Overpass API query builder - Menggunakan nwr (node, way, relation) agar lebih akurat
const OSM_QUERIES: Record<keyof NearbyCategories, string> = {
  transport: `
    nwr["public_transport"~"stop_position|station"](around:3000,LAT,LNG);
    nwr["railway"~"station|halt|tram_stop"](around:3000,LAT,LNG);
    nwr["highway"~"bus_stop|bus_station"](around:3000,LAT,LNG);
    nwr["amenity"="bus_station"](around:3000,LAT,LNG);
  `,
  school: `
    nwr["amenity"~"school|university|college|kindergarten"](around:3000,LAT,LNG);
    nwr["building"~"school|university"](around:3000,LAT,LNG);
  `,
  shopping: `
    nwr["shop"~"mall|supermarket|convenience|department_store|clothes|electronics"](around:3000,LAT,LNG);
    nwr["amenity"~"marketplace|food_court"](around:3000,LAT,LNG);
    nwr["building"~"retail|commercial|mall"](around:3000,LAT,LNG);
  `,
  health: `
    nwr["amenity"~"hospital|clinic|pharmacy|doctors|dentist"](around:5000,LAT,LNG);
    nwr["healthcare"~"hospital|clinic|pharmacy"](around:5000,LAT,LNG);
  `,
  tourism: `
    nwr["tourism"~"attraction|museum|viewpoint|theme_park|hotel|gallery"](around:5000,LAT,LNG);
    nwr["leisure"~"park|water_park|sports_centre|garden|pitch"](around:4000,LAT,LNG);
  `,
  worship: `
    nwr["amenity"="place_of_worship"](around:2000,LAT,LNG);
    nwr["building"~"mosque|church|temple"](around:2000,LAT,LNG);
  `,
};

const haversineMeters = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371000;
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLng = (lng2 - lng1) * rad;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
};

const formatDist = (m: number): string => {
  if (m < 1000) return `${Math.round(m)} m`;
  return `${(m / 1000).toFixed(1).replace('.0', '')} km`;
};

const estimateDriveTime = (m: number): string => {
  // Asumsi kecepatan rata2 25 km/jam di perkotaan Indonesia (lebih macet)
  const minutes = Math.ceil((m / 25000) * 60);
  if (minutes < 1) return '< 1 Menit';
  if (minutes > 60) return `${Math.floor(minutes / 60)} Jam ${minutes % 60} Menit`;
  return `${minutes} Menit`;
};

async function fetchCategory(
  cat: keyof NearbyCategories,
  lat: number,
  lng: number
): Promise<NearbyPlace[]> {
  const rawQuery = OSM_QUERIES[cat]
    .replace(/LAT/g, String(lat))
    .replace(/LNG/g, String(lng));

  // Menggunakan out center untuk way/relation agar kita dapat koordinat tengahnya
  const query = `[out:json][timeout:15];(${rawQuery});out center;`;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) return [];
    const json = await res.json();

    const places: NearbyPlace[] = json.elements
      .filter((el: any) => {
        const elLat = el.lat ?? el.center?.lat;
        const elLng = el.lon ?? el.center?.lon;
        // Ambil nama dari tags, coba berbagai tag nama yang umum
        const name = el.tags?.name || el.tags?.["name:id"] || el.tags?.brand || el.tags?.operator;
        return name && elLat && elLng;
      })
      .map((el: any) => {
        const elLat = el.lat ?? el.center?.lat;
        const elLng = el.lon ?? el.center?.lon;
        const name = el.tags?.name || el.tags?.["name:id"] || el.tags?.brand || el.tags?.operator;
        const dist = haversineMeters(lat, lng, elLat, elLng);
        return {
          id: el.id,
          name: name,
          dist,
          distLabel: formatDist(dist),
          timeLabel: estimateDriveTime(dist),
          lat: elLat,
          lng: elLng,
        };
      })
      // Hilangkan duplikat nama dalam jarak dekat (biasanya stasiun/mall punya banyak entry)
      .filter((place: NearbyPlace, index: number, self: NearbyPlace[]) =>
        index === self.findIndex((p) => p.name === place.name && Math.abs(p.dist - place.dist) < 50)
      )
      .sort((a: NearbyPlace, b: NearbyPlace) => a.dist - b.dist)
      .slice(0, 8); // Ambil 8 terdekat biar lebih rame

    return places;
  } catch (err) {
    console.error(`Error fetching OSM data for ${cat}:`, err);
    return [];
  }
}

export function useNearbyPlaces(lat: number | null, lng: number | null) {
  const [data, setData] = useState<NearbyCategories>({
    transport: [], school: [], shopping: [], health: [], tourism: [], worship: [],
  });
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!lat || !lng) {
      setData({ transport: [], school: [], shopping: [], health: [], tourism: [], worship: [] });
      setLoaded(false);
      return;
    }

    setLoading(true);
    setLoaded(false);

    const cats = Object.keys(OSM_QUERIES) as (keyof NearbyCategories)[];

    // Fetch semua kategori secara paralel
    Promise.all(
      cats.map(cat => fetchCategory(cat, Number(lat), Number(lng)).then(places => ({ cat, places })))
    ).then(results => {
      const newData: NearbyCategories = {
        transport: [], school: [], shopping: [], health: [], tourism: [], worship: [],
      };
      results.forEach(({ cat, places }) => {
        newData[cat] = places;
      });
      setData(newData);
      setLoading(false);
      setLoaded(true);
    }).catch(err => {
      console.error("Failed to fetch all nearby places:", err);
      setLoading(false);
    });
  }, [lat, lng]);

  return { data, loading, loaded };
}
