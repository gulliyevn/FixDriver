/**
 * Share Route Service Constants
 * 
 * Constants for Share Route service functionality
 */

export const SHARE_ROUTE_CONSTANTS = {
  MIN_POINTS: 2,
  IOS: {
    CLIENT_ORDER: [
      { key: 'google', title: 'Google Maps', url: 'googleApp' },
      { key: 'yandexMaps', title: 'Yandex Maps', url: 'yandexMaps' },
      { key: 'waze', title: 'Waze', url: 'waze' },
      { key: 'yandexNavi', title: 'Yandex Navigator', url: 'yandexNavi' },
    ],
    DRIVER_ORDER: [
      { key: 'yandexNavi', title: 'Yandex Navigator', url: 'yandexNavi' },
      { key: 'yandexMaps', title: 'Yandex Maps', url: 'yandexMaps' },
      { key: 'google', title: 'Google Maps', url: 'googleApp' },
      { key: 'waze', title: 'Waze', url: 'waze' },
    ],
    ACTION_SHEET_TITLE: 'Open route in',
  },
  ANDROID: {
    CLIENT_ORDER: ['googleApp', 'yandexMaps', 'waze', 'yandexNavi'],
    DRIVER_ORDER: ['yandexNavi', 'yandexMaps', 'googleApp', 'waze'],
  }
} as const;
