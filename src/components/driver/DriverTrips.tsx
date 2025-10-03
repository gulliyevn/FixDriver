import React from "react";
import { View, Text } from "react-native";

export type DriverTrip = {
  text: string;
  time: string;
  dotStyle?: "default" | "blue" | "location";
};

export type DriverTripsProps = {
  styles: any;
  driverId: string | undefined;
  trips: DriverTrip[];
};

const DriverTrips: React.FC<DriverTripsProps> = ({
  styles,
  driverId,
  trips,
}) => {
  return (
    <View style={styles.tripsContainer}>
      {trips.map((trip, index) => (
        <React.Fragment key={`trip-${driverId ?? "driver"}-${index}`}>
          <View style={styles.tripItem}>
            <View
              style={[
                styles.tripDot,
                trip.dotStyle === "blue" && styles.tripDotBlue,
                trip.dotStyle === "location" && styles.tripDotLocation,
              ]}
            />
            <Text style={styles.tripText}>{trip.text}</Text>
            <Text style={styles.tripTime}>{trip.time}</Text>
          </View>
        </React.Fragment>
      ))}
    </View>
  );
};

export default React.memo(DriverTrips);
