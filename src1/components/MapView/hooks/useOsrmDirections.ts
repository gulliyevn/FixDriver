import { useEffect, useMemo, useState } from 'react';
import { RoutePoint } from '../types/map.types';

interface OsrmResult {
  coordinates: Array<{ latitude: number; longitude: number }>;
  durationSec: number;
  distanceMeters: number;
}

const osrmPolylineDecode = (str: string) => {
  // Простая декодировка polyline5 (OSRM совместима) — чтобы не тянуть внешнюю зависимость
  let index = 0, lat = 0, lng = 0, coordinates: Array<{ latitude: number; longitude: number }> = [];
  while (index < str.length) {
    let b, shift = 0, result = 0;
    do { b = str.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    const dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
    lat += dlat;
    shift = 0; result = 0;
    do { b = str.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    const dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
    lng += dlng;
    coordinates.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return coordinates;
};

export const useOsrmDirections = (points: RoutePoint[] | undefined) => {
  const [route, setRoute] = useState<OsrmResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasEnough = useMemo(() => {
    return Boolean(points && points.length >= 2 && points.every(p => typeof p.coordinate?.latitude === 'number' && typeof p.coordinate?.longitude === 'number'));
  }, [points]);

  useEffect(() => {
    const run = async () => {
      if (!hasEnough) { setRoute(null); return; }
      setLoading(true);
      setError(null);
      try {
        const coords = (points as RoutePoint[]).map(p => `${p.coordinate.longitude},${p.coordinate.latitude}`).join(';');
        const steps = false; // достаточно overview
        const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=polyline${steps ? '&steps=true' : ''}`;
        const resp = await fetch(url);
        const data = await resp.json();
        if (data.code !== 'Ok' || !data.routes?.length) throw new Error('OSRM failed');
        const best = data.routes[0];
        const decoded = osrmPolylineDecode(best.geometry);
        setRoute({ coordinates: decoded, durationSec: Math.round(best.duration), distanceMeters: Math.round(best.distance) });
      } catch (e: any) {
        setError(e?.message || 'OSRM error');
        setRoute(null);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [hasEnough, JSON.stringify(points)]);

  return { route, loading, error };
};


