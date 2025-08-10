import React, { useEffect, useMemo, useState } from 'react';
import { View, SafeAreaView } from 'react-native';
import MapViewComponent from '../../components/MapView';
import { MapService, MapLocation } from '../../services/MapService';
import { useTheme } from '../../context/ThemeContext';
import { createOrdersMapScreenStyles } from '../../styles/screens/OrdersMapScreen.styles';

const OrdersMapScreen: React.FC = () => {
  const { isDark } = useTheme();
  const styles = useMemo(() => createOrdersMapScreenStyles(isDark), [isDark]);

  const [currentLocation, setCurrentLocation] = useState<MapLocation | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;
    MapService.getCurrentLocationWithRetry(3).then((loc) => {
      if (isMounted) setCurrentLocation(loc);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        <MapViewComponent initialLocation={currentLocation} />
      </View>
    </SafeAreaView>
  );
};

export default OrdersMapScreen;


