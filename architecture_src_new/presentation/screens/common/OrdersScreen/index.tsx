import React, { useState } from 'react';
import { View, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../../core/context/ThemeContext';
import { useAuth } from '../../../../core/context/AuthContext';
import OrdersHeader from './components/OrdersHeader';
import { UserRole } from './types/orders-header.types';
import DriverModal from '../../../components/DriverModal/DriverModal';
import { NotificationsModal } from '../../../components/notifications';

const OrdersScreen: React.FC = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  
  // Определяем роль пользователя
  const role: UserRole = user?.role === 'driver' ? 'driver' : 'client';
  
  // Состояние для DriverModal
  const [isDriverModalVisible, setIsDriverModalVisible] = useState(true);
  
  // Состояние для NotificationsModal
  const [isNotificationsModalVisible, setIsNotificationsModalVisible] = useState(false);
  
  // Состояние для фильтров
  const [filterExpandAnim] = useState(new Animated.Value(0));
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({
    all: true,
    online: false,
    priceDesc: false,
    priceAsc: false,
    rating45: false,
  });

  const handleBackPress = () => {
    // Логика возврата назад
    console.log('Back pressed');
  };

  const handleToggleFilter = () => {
    // Анимация раскрытия/скрытия фильтров
    const currentValue = filterExpandAnim as any;
    const toValue = currentValue._value === 0 ? 1 : 0;
    Animated.timing(filterExpandAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleSelectFilter = (key: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
    console.log('Filter selected:', key);
  };

  const handleNotificationsPress = () => {
    setIsNotificationsModalVisible(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <OrdersHeader
        role={role}
        isDark={isDark}
        onBackPress={handleBackPress}
        onToggleFilter={handleToggleFilter}
        onNotificationsPress={handleNotificationsPress}
        showBackButton={false}
        showFilterButton={true}
        showNotificationsButton={true}
        filterExpandAnim={filterExpandAnim}
        onSelectFilter={handleSelectFilter}
        activeFilters={activeFilters}
      />
      
        <ScrollView style={{ flex: 1, paddingTop: 16 }}>
          {/* DriverModal как карточка */}
          <DriverModal
            isVisible={isDriverModalVisible}
            onClose={() => setIsDriverModalVisible(false)}
            onOverlayClose={() => setIsDriverModalVisible(false)}
            role={role}
            onChat={() => console.log('Chat pressed')}
            isModal={false} // Используем как карточку, а не модальное окно
          />
        </ScrollView>

        {/* NotificationsModal */}
        <NotificationsModal
          visible={isNotificationsModalVisible}
          onClose={() => setIsNotificationsModalVisible(false)}
        />
      </SafeAreaView>
    );
  };

export default OrdersScreen;
