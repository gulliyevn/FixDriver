import React, { useEffect, useMemo, useState, useRef } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapViewComponent from '../../components/MapView';
import { MapService, MapLocation } from '../../services/MapService';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../hooks/useI18n';
import { useAuth } from '../../context/AuthContext';
import { createOrdersMapScreenStyles } from '../../styles/screens/OrdersMapScreen.styles';

const OrdersMapScreen: React.FC = () => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const { user } = useAuth();
  const styles = useMemo(() => createOrdersMapScreenStyles(isDark), [isDark]);

  const [currentLocation, setCurrentLocation] = useState<MapLocation | undefined>(undefined);
  const [isExpanded, setIsExpanded] = useState(false);
  const [driverVisibilityTrigger, setDriverVisibilityTrigger] = useState(0);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const settingsRotateAnim = useRef(new Animated.Value(0)).current;
  const settingsPanelAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isMounted = true;
    MapService.getCurrentLocationWithRetry(3).then((loc) => {
      if (isMounted) setCurrentLocation(loc);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChevronPress = () => {
    const toValue = isExpanded ? 0 : 1;

    Animated.timing(rotateAnim, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start();

    setIsExpanded(!isExpanded);
    
    // Триггерим изменение видимости карточки водителя
    setDriverVisibilityTrigger(prev => prev + 1);
  };

  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);

  const handleSettingsPress = () => {
    const toValue = isSettingsExpanded ? 0 : 1;
    setIsSettingsExpanded(!isSettingsExpanded);
    
    Animated.parallel([
      Animated.timing(settingsRotateAnim, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(settingsPanelAnim, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      })
    ]).start();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const settingsRotate = settingsRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const settingsPanelWidth = settingsPanelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 280],
  });

  const settingsPanelOpacity = settingsPanelAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0, 1],
  });

  const headerTitleOpacity = settingsPanelAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.3, 0],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Animated.Text style={[styles.headerTitle, { opacity: headerTitleOpacity }]}>
          {t('client.map.title')}
        </Animated.Text>
        <View style={styles.headerActions}>
          <View style={{ position: 'relative' }}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleSettingsPress}
              accessibilityLabel={t('common.settings')}
            >
              <Animated.View style={{ transform: [{ rotate: settingsRotate }] }}>
                <Ionicons
                  name="settings-outline"
                  size={22}
                  color={isDark ? '#F9FAFB' : '#111827'}
                />
              </Animated.View>
            </TouchableOpacity>
            
            {/* Выпадающая панель настроек */}
            <Animated.View
              style={[
                styles.settingsPanel,
                {
                  width: settingsPanelWidth,
                  opacity: settingsPanelOpacity,
                  right: 16, // Сдвигаем налево
                  top: 2, // Положительный отступ сверху
                }
              ]}
            >
              <TouchableOpacity style={styles.settingsButton}>
                <Ionicons name="refresh-outline" size={18} color={isDark ? '#F9FAFB' : '#111827'} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingsButton}>
                <Ionicons name="location-sharp" size={18} color={isDark ? '#F9FAFB' : '#111827'} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingsButton}>
                <Ionicons name="locate-outline" size={18} color={isDark ? '#F9FAFB' : '#111827'} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingsButton}>
                <Ionicons name="layers-outline" size={18} color={isDark ? '#F9FAFB' : '#111827'} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingsButton}>
                <Ionicons name="add-outline" size={18} color={isDark ? '#F9FAFB' : '#111827'} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingsButton}>
                <Ionicons name="remove-outline" size={18} color={isDark ? '#F9FAFB' : '#111827'} />
              </TouchableOpacity>
            </Animated.View>
          </View>
          
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleChevronPress}
            accessibilityLabel={t('common.menu')}
          >
            <Animated.View style={{ transform: [{ rotate }] }}>
              <Ionicons
                name="chevron-down"
                size={22}
                color={isDark ? '#F9FAFB' : '#111827'}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mapContainer}>
        <MapViewComponent 
          initialLocation={currentLocation}
          onDriverVisibilityToggle={driverVisibilityTrigger}
          role={user?.role === 'driver' ? 'driver' : 'client'}
        />
      </View>
    </SafeAreaView>
  );
};

export default OrdersMapScreen;


