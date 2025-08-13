import React, { useEffect, useMemo, useState, useRef } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Animated, Alert, Modal, TextInput } from 'react-native';
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
  const [mapRefreshKey, setMapRefreshKey] = useState(0); // Ключ для перезагрузки карты
  const [isRefreshing, setIsRefreshing] = useState(false); // Состояние обновления
  const [isClientLocationActive, setIsClientLocationActive] = useState(false); // Активна ли клиентская локация
  const [isDriverModalVisible, setIsDriverModalVisible] = useState(false); // Видимость модалки водителя
  const [isReportModalVisible, setIsReportModalVisible] = useState(false); // Видимость модалки репорта
  const [reportComment, setReportComment] = useState(''); // Комментарий к репорту
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
    console.log('Chevron pressed - opening driver modal');
    setIsDriverModalVisible(true);
  };

  const handleDriverModalClose = () => {
    console.log('Closing driver modal');
    setIsDriverModalVisible(false);
  };

  const handleReportPress = () => {
    console.log('Report button pressed');
    setIsReportModalVisible(true);
  };

  const handleReportSubmit = () => {
    console.log('Report submitted:', reportComment);
    // Здесь можно добавить логику отправки репорта на сервер
    setIsReportModalVisible(false);
    setReportComment('');
    Alert.alert(t('common.success'), t('common.report.success'));
  };

  const handleReportCancel = () => {
    setIsReportModalVisible(false);
    setReportComment('');
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

  const handleRefreshMap = async () => {
    if (isRefreshing) return; // Предотвращаем множественные обновления
    
    setIsRefreshing(true);
    
    try {
      // Обновляем текущую локацию
      const newLocation = await MapService.getCurrentLocationWithRetry(3);
      if (newLocation) {
        setCurrentLocation(newLocation);
      }
      
      // Обновляем триггер видимости водителей (перезагружает маркеры)
      setDriverVisibilityTrigger(prev => prev + 1);
      
      // Обновляем ключ карты для полной перезагрузки
      setMapRefreshKey(prev => prev + 1);
      
      // Закрываем панель настроек после обновления
      if (isSettingsExpanded) {
        handleSettingsPress();
      }
      
    } catch (error) {
      console.error('Error refreshing map:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleClientLocationToggle = async () => {
    if (user?.role !== 'client') return; // Только для клиентов
    
    try {
      if (!isClientLocationActive) {
        // Активируем клиентскую локацию
        const location = await MapService.getCurrentLocationWithRetry(3);
        if (location) {
          setIsClientLocationActive(true);
          setCurrentLocation(location);
          
          // Здесь можно добавить отправку локации на сервер для водителей
          console.log('Client location activated:', location);
          
          // Показываем уведомление
          // Alert.alert('Успех', 'Ваша локация теперь видна водителям');
        }
      } else {
        // Деактивируем клиентскую локацию
        setIsClientLocationActive(false);
        
        // Здесь можно добавить отправку запроса на сервер для скрытия локации
        console.log('Client location deactivated');
        
        // Показываем уведомление
        // Alert.alert('Информация', 'Ваша локация скрыта от водителей');
      }
    } catch (error) {
      console.error('Error toggling client location:', error);
      Alert.alert('Ошибка', 'Не удалось обновить локацию');
    }
  };

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
              <TouchableOpacity 
                style={[styles.settingsButton, isRefreshing && { opacity: 0.5 }]}
                onPress={handleRefreshMap}
                disabled={isRefreshing}
              >
                <Ionicons 
                  name="refresh-outline" 
                  size={18} 
                  color={isDark ? '#F9FAFB' : '#111827'} 
                />
              </TouchableOpacity>
              
              {user?.role === 'client' ? (
                <TouchableOpacity 
                  style={[
                    styles.settingsButton, 
                    isClientLocationActive && { backgroundColor: isDark ? '#10B981' : '#10B981' }
                  ]}
                  onPress={handleClientLocationToggle}
                >
                  <Ionicons 
                    name="location-sharp" 
                    size={18} 
                    color={
                      isClientLocationActive 
                        ? '#FFFFFF' 
                        : (isDark ? '#F9FAFB' : '#111827')
                    } 
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={styles.settingsButton}
                  onPress={handleReportPress}
                >
                  <Ionicons 
                    name="warning" 
                    size={18} 
                    color={isDark ? '#F9FAFB' : '#111827'}
                  />
                </TouchableOpacity>
              )}
              
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
            <Ionicons
              name="chevron-down"
              size={22}
              color={isDark ? '#F9FAFB' : '#111827'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mapContainer}>
        <MapViewComponent 
          key={mapRefreshKey} // Ключ для перезагрузки компонента
          initialLocation={currentLocation}
          onDriverVisibilityToggle={driverVisibilityTrigger}
          role={user?.role === 'driver' ? 'driver' : 'client'}
          clientLocationActive={isClientLocationActive}
          isDriverModalVisible={isDriverModalVisible}
          onDriverModalClose={handleDriverModalClose}
        />
      </View>

      {/* Модалка репорта */}
      <Modal
        visible={isReportModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleReportCancel}
      >
        <View style={styles.reportModalOverlay}>
          <View style={styles.reportModalContainer}>
            <View style={styles.reportModalHeader}>
              <View style={styles.reportIconContainer}>
                <Ionicons name="warning" size={32} color="#DC2626" />
              </View>
              <Text style={styles.reportModalTitle}>{t('common.report.title')}</Text>
            </View>
            
            <Text style={styles.reportModalSubtitle}>
              {t('common.report.subtitle')}
            </Text>
            
            <TextInput
              style={styles.reportCommentInput}
              placeholder={t('common.report.commentPlaceholder')}
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
              value={reportComment}
              onChangeText={setReportComment}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            
            <View style={styles.reportModalButtons}>
              <TouchableOpacity 
                style={styles.reportCancelButton}
                onPress={handleReportCancel}
              >
                <Text style={styles.reportCancelButtonText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.reportSubmitButton}
                onPress={handleReportSubmit}
              >
                <Text style={styles.reportSubmitButtonText}>{t('common.report.submit')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default OrdersMapScreen;


