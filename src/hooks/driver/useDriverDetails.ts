import { useEffect, useState } from "react";

import DriverService from "../../services/DriverService";

export interface DriverDetails {
  driver: {
    id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    schedule: string;
    price: string;
    distance: string;
    time: string;
    rating: number;
  };
  client: {
    name: string;
    childName: string;
    childAge: number;
    childType: string;
  };
  trips: Array<{
    text: string;
    time: string;
    dotStyle?: "blue" | "location" | "default";
  }>;
}

export const useDriverDetails = (driverId: string) => {
  const [driverInfo, setDriverInfo] = useState<DriverDetails["driver"] | null>(
    null,
  );
  const [clientInfo, setClientInfo] = useState<DriverDetails["client"] | null>(
    null,
  );
  const [trips, setTrips] = useState<DriverDetails["trips"]>([]);

  useEffect(() => {
    const loadDetails = async () => {
      const [profile, tripsData] = await Promise.all([
        DriverService.getDriverProfile(driverId),
        DriverService.getDriverTrips(driverId),
      ]);

      if (profile) {
        setDriverInfo({
          id: profile.id,
          first_name: profile.first_name || "",
          last_name: profile.last_name || "",
          phone_number: profile.phone_number || "",
          schedule: profile.schedule ?? "",
          price: profile.price ?? "",
          distance: profile.distance ?? "",
          time: profile.time ?? "",
          rating: profile.rating ?? 0,
        });
        setClientInfo({
          name: profile.client?.name ?? "",
          childName: profile.client?.childName ?? "",
          childAge: profile.client?.childAge ?? 0,
          childType: profile.client?.childType ?? "",
        });
      }

      setTrips(tripsData ?? []);
    };

    loadDetails();
  }, [driverId]);

  return {
    driverInfo: driverInfo ?? {
      id: driverId,
      first_name: "",
      last_name: "",
      phone_number: "",
      schedule: "",
      price: "",
      distance: "",
      time: "",
      rating: 0,
    },
    clientInfo: clientInfo ?? {
      name: "",
      childName: "",
      childAge: 0,
      childType: "",
    },
    trips,
  };
};
