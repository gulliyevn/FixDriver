import React, { useRef, useCallback } from "react";
import MapView from "react-native-maps";

export const useMapZoom = (mapRef: React.RefObject<MapView>) => {
  const isZoomingRef = useRef(false);

  const handleZoomIn = useCallback(() => {
    if (!mapRef.current || isZoomingRef.current) return;

    isZoomingRef.current = true;
    mapRef.current
      .getCamera()
      .then((camera) => {
        if (camera && camera.zoom) {
          mapRef.current?.animateCamera({
            ...camera,
            zoom: Math.min(camera.zoom + 1, 20),
          });
        }
      })
      .finally(() => {
        setTimeout(() => {
          isZoomingRef.current = false;
        }, 300);
      });
  }, [mapRef]);

  const handleZoomOut = useCallback(() => {
    if (!mapRef.current || isZoomingRef.current) return;

    isZoomingRef.current = true;
    mapRef.current
      .getCamera()
      .then((camera) => {
        if (camera && camera.zoom) {
          mapRef.current?.animateCamera({
            ...camera,
            zoom: Math.max(camera.zoom - 1, 5),
          });
        }
      })
      .finally(() => {
        setTimeout(() => {
          isZoomingRef.current = false;
        }, 300);
      });
  }, [mapRef]);

  return {
    handleZoomIn,
    handleZoomOut,
  };
};
