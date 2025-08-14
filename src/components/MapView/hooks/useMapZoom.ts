import { useRef, useCallback } from 'react';
import { MapRef } from '../types/map.types';

export const useMapZoom = (mapRef: React.RefObject<MapRef>) => {
  const isZoomingRef = useRef(false);

  const handleZoomIn = useCallback(() => {
    if (isZoomingRef.current) {
      return;
    }
    
    isZoomingRef.current = true;
    
    if (mapRef.current) {
      // Плавный зум с animateCamera
      mapRef.current.getCamera().then((camera) => {
        const newZoom = Math.min(camera.zoom + 1, 20);
        mapRef.current?.animateCamera({
          ...camera,
          zoom: newZoom,
        });
        
        setTimeout(() => {
          isZoomingRef.current = false;
        }, 600);
      }).catch(() => {
        isZoomingRef.current = false;
      });
    } else {
      isZoomingRef.current = false;
    }
  }, [mapRef]);

  const handleZoomOut = useCallback(() => {
    if (isZoomingRef.current) {
      return;
    }
    
    isZoomingRef.current = true;
    
    if (mapRef.current) {
      // Плавный зум с animateCamera
      mapRef.current.getCamera().then((camera) => {
        const newZoom = Math.max(camera.zoom - 1, 5);
        mapRef.current?.animateCamera({
          ...camera,
          zoom: newZoom,
        });
        
        setTimeout(() => {
          isZoomingRef.current = false;
        }, 600);
      }).catch(() => {
        isZoomingRef.current = false;
      });
    } else {
      isZoomingRef.current = false;
    }
  }, [mapRef]);

  return {
    handleZoomIn,
    handleZoomOut,
  };
};
