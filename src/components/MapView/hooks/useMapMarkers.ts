import { useState, useEffect, useCallback } from "react";
import { MapMarker, MapLocation } from "../types/map.types";
import { MapService } from "../../../services/MapService";

export const useMapMarkers = (
  initialMarkers: MapMarker[] = [],
  role: "client" | "driver" = "client",
  clientLocationActive: boolean = false,
  initialLocation?: MapLocation,
  onDriverVisibilityToggle?: (timestamp: number) => void,
) => {
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>(initialMarkers);
  const [clientMarker, setClientMarker] = useState<MapMarker | null>(null);

  // Обновление маркеров при изменении пропсов
  useEffect(() => {
    if (initialMarkers && initialMarkers.length > 0) {
      setMapMarkers(initialMarkers);
    }
  }, [initialMarkers]);

  // Обработка клиентской локации для водителей
  useEffect(() => {
    if (role === "driver" && clientLocationActive && initialLocation) {
      // Показываем клиентский маркер водителям
      setClientMarker({
        id: "active_client",
        coordinate: initialLocation,
        title: "Активный клиент",
        description: "Клиент готов к поездке",
      });
    } else if (!clientLocationActive || role !== "driver") {
      // Скрываем клиентский маркер только при изменении состояния
      setClientMarker(null);
    }
  }, [clientLocationActive, role, initialLocation]);

  const refreshMapMarkers = useCallback(async () => {
    try {
      // Обновляем только маркеры карты, не трогая состояние DriverModal
      if (typeof onDriverVisibilityToggle === "function") {
        // Вызываем колбэк для обновления видимости водителей
        onDriverVisibilityToggle(Date.now());
      }

      // Обновляем текущую локацию без влияния на другие состояния
      const location = await MapService.getCurrentLocation();
      if (location && !initialLocation) {
        // Здесь можно обновить регион карты
      }
    } catch (error) {
      console.warn('Failed to handle driver visibility toggle:', error);
    }
  }, [onDriverVisibilityToggle, initialLocation]);

  const handleMarkerPress = useCallback((marker: MapMarker) => {
    if (marker.onPress) {
      marker.onPress(marker);
    }
  }, []);

  return {
    mapMarkers,
    clientMarker,
    refreshMapMarkers,
    handleMarkerPress,
  };
};
