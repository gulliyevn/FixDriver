import { useEffect, useMemo, useState } from 'react';
import polyline from '@mapbox/polyline';
import { RoutePoint } from '../types/map.types';
import { ENV_CONFIG } from '../../../../../../../shared/config/environment';

interface DirectionsResult {
  coordinates: Array<{ latitude: number; longitude: number }>;
  durationInTrafficSec: number;
  distanceMeters: number;
  reorderedIndices?: number[]; // mapping from provided waypoints to optimized order
}

const buildDirectionsUrl = (
  points: RoutePoint[],
  opts: { optimize: boolean; avoidTolls: boolean; avoidHighways: boolean }
) => {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  const origin = `${points[0].coordinate.latitude},${points[0].coordinate.longitude}`;
  const destination = `${points[points.length - 1].coordinate.latitude},${points[points.length - 1].coordinate.longitude}`;
  const rawWaypoints = points.slice(1, -1).map(p => `${p.coordinate.latitude},${p.coordinate.longitude}`);
  const waypointPrefix = opts.optimize && rawWaypoints.length > 0 ? 'optimize:true|' : '';
  const waypoints = rawWaypoints.length > 0 ? `&waypoints=${encodeURIComponent(waypointPrefix + rawWaypoints.join('|'))}` : '';
  const avoid = [opts.avoidTolls ? 'tolls' : null, opts.avoidHighways ? 'highways' : null].filter(Boolean).join('|');
  const avoidParam = avoid ? `&avoid=${avoid}` : '';
  const departure = `&departure_time=now`;
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}${waypoints}&mode=driving${departure}&traffic_model=best_guess${avoidParam}&key=${apiKey}`;
  return url;
};

export const useDirections = (
  points: RoutePoint[] | undefined,
  plannedArrivalAtMs?: number,
  allowOptimizeWhenLate = true,
  tollsSpeedupThresholdMin = 5,
  enabled: boolean = true,
) => {
  const [route, setRoute] = useState<DirectionsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasEnough = useMemo(() => {
    return Boolean(points && points.length >= 2 && points.every(p => typeof p.coordinate?.latitude === 'number' && typeof p.coordinate?.longitude === 'number'));
  }, [points]);

  useEffect(() => {
    const fetchDirections = async () => {
      if (!hasEnough) { setRoute(null); return; }
      if (!enabled) { return; }
      setLoading(true);
      setError(null);
      try {
        // 1) Без платных, без оптимизации
        let url = buildDirectionsUrl(points!, { optimize: false, avoidTolls: true, avoidHighways: true });
        let resp = await fetch(url);
        let data = await resp.json();
        if (data.status !== 'OK' || !data.routes?.length) throw new Error(data.status || 'Directions failed');
        let best = data.routes[0];
        const decoded = polyline.decode(best.overview_polyline.points).map((p: number[]) => ({ latitude: p[0], longitude: p[1] }));
        const durationInTrafficSec = best.legs.reduce((acc: number, leg: any) => acc + (leg.duration_in_traffic?.value ?? leg.duration?.value ?? 0), 0);
        const distanceMeters = best.legs.reduce((acc: number, leg: any) => acc + (leg.distance?.value ?? 0), 0);
        let reorderedIndices: number[] | undefined = undefined;
        if (best.waypoint_order) reorderedIndices = best.waypoint_order as number[];

        // Проверка на опоздание
        const nowMs = Date.now();
        const etaMs = nowMs + durationInTrafficSec * 1000;
        const isLate = plannedArrivalAtMs ? etaMs > plannedArrivalAtMs : false;

        // Если опаздываем — пробуем optimize:true
        if (allowOptimizeWhenLate && (isLate || (best.waypoint_order?.length > 0))) {
          const urlOpt = buildDirectionsUrl(points!, { optimize: true, avoidTolls: true, avoidHighways: true });
          const respOpt = await fetch(urlOpt);
          const dataOpt = await respOpt.json();
          if (dataOpt.status === 'OK' && dataOpt.routes?.length) {
            const cand = dataOpt.routes[0];
            const dur = cand.legs.reduce((acc: number, leg: any) => acc + (leg.duration_in_traffic?.value ?? leg.duration?.value ?? 0), 0);
            if (dur < durationInTrafficSec) {
              best = cand;
            }
          }
        }

        // Если всё ещё опаздываем — разрешаем платные/трассы
        const recomputeDurationSec = best.legs.reduce((acc: number, leg: any) => acc + (leg.duration_in_traffic?.value ?? leg.duration?.value ?? 0), 0);
        const etaAfterOptMs = nowMs + recomputeDurationSec * 1000;
        const stillLate = plannedArrivalAtMs ? etaAfterOptMs > plannedArrivalAtMs : false;
        if (stillLate) {
          // Разрешаем платные
          const urlTolls = buildDirectionsUrl(points!, { optimize: true, avoidTolls: false, avoidHighways: false });
          const respTolls = await fetch(urlTolls);
          const dataTolls = await respTolls.json();
          if (dataTolls.status === 'OK' && dataTolls.routes?.length) {
            const bestTolls = dataTolls.routes[0];
            const durTolls = bestTolls.legs.reduce((acc: number, leg: any) => acc + (leg.duration_in_traffic?.value ?? leg.duration?.value ?? 0), 0);
            if (durTolls + tollsSpeedupThresholdMin * 60 <= recomputeDurationSec) {
              best = bestTolls;
            }
          }
        }

        const finalDecoded = polyline.decode(best.overview_polyline.points).map((p: number[]) => ({ latitude: p[0], longitude: p[1] }));
        const finalDurationSec = best.legs.reduce((acc: number, leg: any) => acc + (leg.duration_in_traffic?.value ?? leg.duration?.value ?? 0), 0);
        const finalDistanceMeters = best.legs.reduce((acc: number, leg: any) => acc + (leg.distance?.value ?? 0), 0);
        const finalOrder = best.waypoint_order as number[] | undefined;

        setRoute({ coordinates: finalDecoded, durationInTrafficSec: finalDurationSec, distanceMeters: finalDistanceMeters, reorderedIndices: finalOrder });
      } catch (e: any) {
        setError(e?.message || 'Directions error');
        setRoute(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDirections();
  }, [hasEnough, JSON.stringify(points), plannedArrivalAtMs, allowOptimizeWhenLate, tollsSpeedupThresholdMin, enabled]);

  return { route, loading, error };
};


