import { useEffect, useState } from 'react';

import DriverService from '../../services/DriverService';

export const useDriverTripsData = (driverId: string) => {
  const [trips, setTrips] = useState<Array<{ text: string; time: string; dotStyle?: 'default' | 'blue' | 'location' }>>([]);

  useEffect(() => {
    const loadTrips = async () => {
      const result = await DriverService.getDriverTrips(driverId);
      const formattedTrips = result.map(trip => ({
        text: trip.text,
        time: trip.time,
        dotStyle: trip.dotStyle
      }));
      setTrips(formattedTrips);
    };

    loadTrips();
  }, [driverId]);

  return trips;
};
