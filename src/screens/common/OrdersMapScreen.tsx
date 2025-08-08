import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapViewComponent from '../../components/MapView';
import { MapService, MapLocation } from '../../services/MapService';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { createOrdersMapScreenStyles } from '../../styles/screens/OrdersMapScreen.styles';
import { useAuth } from '../../context/AuthContext';

const OrdersMapScreen: React.FC = () => {
  const { isDark } = useTheme();
  const styles = useMemo(() => createOrdersMapScreenStyles(isDark), [isDark]);
  const { t } = useLanguage();
  const { user } = useAuth();

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

  const handleRefresh = async () => {
    const loc = await MapService.getCurrentLocationWithRetry(3);
    setCurrentLocation(loc);
  };

  const handleAddOrder = () => {
    // TODO: навигация подключена в навигаторе, по кнопке - переход
  };

  const isDriver = user?.role === 'driver';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {isDriver ? t('navigation.tabs.orders') : t('navigation.tabs.map')}
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton} onPress={handleRefresh}>
            <Ionicons name="refresh" size={20} color={isDark ? '#F9FAFB' : '#111827'} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconButton, styles.iconButtonPrimary]} onPress={handleAddOrder}>
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mapContainer}>
        <MapViewComponent initialLocation={currentLocation} />
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>
            {isDriver ? t('driver.orders.refresh') : t('client.plus.title')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OrdersMapScreen;


