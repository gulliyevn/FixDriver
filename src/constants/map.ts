import { ENV } from '../config/environment';

export const MAPTILER_API_KEY = ENV.MAPTILER_API_KEY;

export const MAP_CONFIG = {
  // MapTiler стили карт
  styles: {
    street: `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_API_KEY}`,
    satellite: `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_API_KEY}`,
    hybrid: `https://api.maptiler.com/maps/hybrid/style.json?key=${MAPTILER_API_KEY}`,
    dark: `https://api.maptiler.com/maps/streets-dark/style.json?key=${MAPTILER_API_KEY}`,
  },
  // Настройки по умолчанию (Баку)
  defaultRegion: {
    latitude: 40.4093,
    longitude: 49.8671,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  // Настройки для поиска водителей
  searchRadius: 5000, // метров
  // Настройки анимации
  animationDuration: 1000,
  // Настройки кластеринга
  clusterEnabled: true,
  clusterRadius: 50,
};

export const MARKER_TYPES = {
  DRIVER: 'driver',
  CLIENT: 'client',
  PICKUP: 'pickup',
  DESTINATION: 'destination',
} as const;

export const MAP_EVENTS = {
  REGION_CHANGE: 'regionChange',
  MARKER_PRESS: 'markerPress',
  MAP_PRESS: 'mapPress',
  USER_LOCATION: 'userLocation',
} as const; 