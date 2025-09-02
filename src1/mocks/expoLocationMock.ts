export const getCurrentPositionAsync = jest.fn(() => 
  Promise.resolve({
    coords: {
      latitude: 55.7558,
      longitude: 37.6176,
      altitude: 156,
      accuracy: 5,
      altitudeAccuracy: 5,
      heading: 0,
      speed: 0,
    },
    timestamp: Date.now(),
  })
);

export const requestForegroundPermissionsAsync = jest.fn(() => 
  Promise.resolve({ status: 'granted' })
);

export const requestBackgroundPermissionsAsync = jest.fn(() => 
  Promise.resolve({ status: 'granted' })
);

export const getForegroundPermissionsAsync = jest.fn(() => 
  Promise.resolve({ status: 'granted' })
);

export const getBackgroundPermissionsAsync = jest.fn(() => 
  Promise.resolve({ status: 'granted' })
);

export const LocationAccuracy = {
  Lowest: 1,
  Low: 2,
  Balanced: 3,
  High: 4,
  Highest: 5,
  BestForNavigation: 6,
};

export const LocationActivityType = {
  Other: 1,
  AutomotiveNavigation: 2,
  Fitness: 3,
  OtherNavigation: 4,
  Airborne: 5,
}; 