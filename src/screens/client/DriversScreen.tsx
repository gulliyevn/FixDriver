import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Alert,
  StatusBar,
  Modal,
  Linking,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AppCard from '../../components/AppCard';
import RatingStars from '../../components/RatingStars';
import { notificationService, Notification } from '../../services/NotificationService';
import { navigateToChat } from '../../utils/navigationHelpers';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../../types/navigation';
import Button from '../../components/Button';
import mockData from '../../utils/mockData';
import { DriversScreenStyles } from '../../styles/screens/DriversScreen.styles';

interface Driver {
  id: string;
  name: string;
  rating: number;
  totalRides: number;
  carModel: string;
  carNumber: string;
  isOnline: boolean;
  distance: string;
  estimatedTime: string;
  isAvailable: boolean;
  photo?: string;
  package: 'base' | 'plus' | 'premium';
  price: number;
  experience: number; // лет опыта
  vehicleYear: number;
  hasAirCondition: boolean;
  hasWifi: boolean;
  hasCharger: boolean;
  forMember: 'me' | 'daughter' | 'son' | 'wife' | 'husband'; // для кого водитель
  tripDays: string; // дни поездок
  addresses: string[]; // массив адресов для поездки
  departureTime: string; // время выезда
  arrivalTime: string; // время доезда
  schedule?: string; // расписание поездок (пн-пт, вт/чт/сб, etc)
}

// Используем централизованные мок-данные
const drivers: Driver[] = mockData.drivers.map(driver => ({
  id: driver.id,
  name: `${driver.first_name} ${driver.last_name}`,
  rating: driver.rating,
  totalRides: Math.floor(Math.random() * 1000) + 100, // Генерируем случайное количество поездок
  carModel: `${driver.vehicle_brand} ${driver.vehicle_model}`,
  carNumber: driver.vehicle_number,
  isOnline: driver.isAvailable,
  distance: `${(Math.random() * 3 + 0.5).toFixed(1)} км`,
  estimatedTime: `${Math.floor(Math.random() * 15 + 3)} мин`,
  isAvailable: driver.isAvailable,
  photo: driver.avatar,
  package: Math.random() > 0.7 ? 'premium' : Math.random() > 0.5 ? 'plus' : 'base',
  price: Math.floor(Math.random() * 10 + 5),
  experience: Math.floor(Math.random() * 15 + 2),
  vehicleYear: driver.vehicle_year,
  hasAirCondition: true,
  hasWifi: Math.random() > 0.3,
  hasCharger: Math.random() > 0.4,
  forMember: (['me', 'daughter', 'son', 'wife', 'husband'] as const)[Math.floor(Math.random() * 5)],
  tripDays: ['пн, ср, пт', 'вт, чт', 'пн-пт', 'сб, вс', 'пн, ср, пт, сб'][Math.floor(Math.random() * 5)],
  addresses: ['Дом ул. Низами 10', 'Офис БЦ Port Baku', 'Торговый центр 28 Mall'],
  departureTime: '08:00',
  arrivalTime: '18:30',
  schedule: 'пн, ср, пт (8:00-18:30)',
}));

const DriversScreen: React.FC = () => {
  const { isDark } = useTheme();
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  const [expandedDrivers, setExpandedDrivers] = useState<string[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    package: 'all',
    maxDistance: 5,
    minRating: 0,
    maxPrice: 20,
    hasAirCondition: false,
    hasWifi: false,
    hasCharger: false,
    onlyAvailable: false,
    // Новые фильтры
    timeSlot: 'all', // утром, днем, вечером, круглосуточно
    workDays: 'all', // будни, выходные, все дни
    minExperience: 0, // минимальный опыт в годах
    maxCarAge: 10, // максимальный возраст авто (лет)
    familyMember: 'all', // для кого водитель (me, daughter, son, wife, husband)
    priceRange: 'all', // экономичные, стандартные, премиум
  });

  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  useEffect(() => {
    setNotifications(notificationService.getNotifications());
  }, []);

  const handleBookRide = () => {
    if (!selectedDriver) {
      Alert.alert('Ошибка', 'Выберите водителя для поездки');
      return;
    }
    
    navigation.navigate('Map', { selectedDriver });
  };

  const handleNotifications = () => {
    setNotifications(notificationService.getNotifications());
    setShowNotificationsModal(true);
    setIsSelectionMode(false);
    setSelectedNotifications([]);
  };

  const handleDeleteNotification = (notificationId: string) => {
    Alert.alert(
      'Удалить уведомление',
      'Вы уверены, что хотите удалить это уведомление?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            notificationService.removeNotification(notificationId);
            setNotifications(notificationService.getNotifications());
          },
        },
      ]
    );
  };

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead();
    setNotifications(notificationService.getNotifications());
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'trip':
        return 'car';
      case 'payment':
        return 'card';
      case 'driver':
        return 'person';
      case 'system':
        return 'settings';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'trip':
        return '#10B981';
      case 'payment':
        return '#F59E0B';
      case 'driver':
        return '#3B82F6';
      case 'system':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedNotifications([]);
  };

  const toggleNotificationSelection = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const selectAllNotifications = () => {
    if (selectedNotifications.length === notifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map(n => n.id));
    }
  };

  const deleteSelectedNotifications = () => {
    if (selectedNotifications.length === 0) return;
    
    Alert.alert(
      'Удалить уведомления',
      `Вы уверены, что хотите удалить ${selectedNotifications.length} уведомлений?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            selectedNotifications.forEach(id => {
              notificationService.removeNotification(id);
            });
            setNotifications(notificationService.getNotifications());
            setSelectedNotifications([]);
            setIsSelectionMode(false);
          },
        },
      ]
    );
  };

  const toggleDriverExpansion = (driverId: string) => {
    setExpandedDrivers(prev => 
      prev.includes(driverId) 
        ? prev.filter(id => id !== driverId)
        : [...prev, driverId]
    );
  };

  const handleCallDriver = (driver: Driver) => {
    const phoneNumber = '+994516995513'; // Номер водителя
    
    Alert.alert(
      'Позвонить водителю',
      `${driver.name}\n${phoneNumber}`,
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Позвонить', 
          onPress: () => {
            const telUrl = `tel:${phoneNumber}`;
            Linking.canOpenURL(telUrl)
              .then((supported) => {
                if (supported) {
                  return Linking.openURL(telUrl);
                } else {
                  Alert.alert('Ошибка', 'Не удалось открыть приложение для звонков');
                }
              })
              .catch((err) => console.error('Error opening phone app:', err));
          }
        }
      ]
    );
  };

  const handleChatDriver = (driver: Driver) => {
    try {
      // Формируем параметры для чата
      const chatParams = {
        driverId: driver.id,
        driverName: driver.name,
        driverCar: driver.carModel,
        driverNumber: driver.carNumber,
        driverRating: driver.rating.toString(),
        driverStatus: driver.isOnline ? 'online' : 'offline',
      };
      
      // Используем улучшенную функцию навигации
      const success = navigateToChat(navigation, chatParams);
      
      if (!success) {
        Alert.alert('Ошибка', 'Не удалось открыть чат. Попробуйте еще раз.');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
      Alert.alert('Ошибка', 'Не удалось открыть чат: ' + message);
    }
  };

  // Добавляем данные о семейных членах с адресами и расписанием
  const memberRoutes = {
    me: {
      addressA: 'Дом, ул. Низами, 10',
      addressB: 'Офис, БЦ "Port Baku"',
      schedule: 'пн-пт 08:00-18:00'
    },
    daughter: {
      addressA: 'Школа №132, Ясамал',
      addressB: 'Дом, ул. Низами, 10',
      schedule: 'пн-пт 08:00-16:00'
    },
    son: {
      addressA: 'Спорткомплекс, Наримановский р-н',
      addressB: 'Дом, ул. Низами, 10',
      schedule: 'пн-сб 10:00-20:00'
    },
    wife: {
      addressA: 'Салон красоты, ул. Физули',
      addressB: 'ТЦ "28 Mall"',
      schedule: 'пн-пт 09:00-19:00'
    },
    husband: {
      addressA: 'Автосервис, ул. Гянджа',
      addressB: 'Дом, ул. Низами, 10',
      schedule: 'пн-сб 08:00-18:00'
    },
  };

  const getMemberData = (memberId: string) => {
    const member = mockData.familyMembers.find(m => m.id === memberId);
    const route = memberRoutes[memberId as keyof typeof memberRoutes];
    return {
      name: member?.name || '',
      icon: member?.icon || 'person-circle',
      ...route
    };
  };

  const filters = [
    { id: 'all', label: 'Все', icon: 'car' },
    { id: 'online', label: 'Онлайн', icon: 'radio-button-on' },
    { id: 'nearby', label: 'Близко', icon: 'location' },
    { id: 'top', label: 'Топ', icon: 'star' },
    { id: 'available', label: 'Свободны', icon: 'checkmark-circle' },
    { id: 'morning', label: 'Утром', icon: 'sunny' },
    { id: 'evening', label: 'Вечером', icon: 'moon' },
    { id: 'weekdays', label: 'Будни', icon: 'calendar' },
    { id: 'premium', label: 'Премиум', icon: 'diamond' },
    { id: 'budget', label: 'Эконом', icon: 'wallet' },
  ];

  const filteredDrivers = drivers.filter(driver => {
    // Базовые фильтры
    if (selectedFilter === 'online' && !driver.isOnline) return false;
    if (selectedFilter === 'nearby' && parseFloat(driver.distance) > 1.0) return false;
    if (selectedFilter === 'top' && driver.rating < 4.8) return false;
    if (selectedFilter === 'available' && !driver.isAvailable) return false;
    
    // Новые быстрые фильтры
    if (selectedFilter === 'morning') {
      const departureHour = parseInt(driver.departureTime.split(':')[0]);
      if (!(departureHour >= 6 && departureHour <= 12)) return false;
    }
    if (selectedFilter === 'evening') {
      const departureHour = parseInt(driver.departureTime.split(':')[0]);
      if (!(departureHour >= 18 && departureHour <= 24)) return false;
    }
    if (selectedFilter === 'weekdays') {
      const tripDays = driver.tripDays.toLowerCase();
      if (!(tripDays.includes('пн') || tripDays.includes('вт') || tripDays.includes('ср') || tripDays.includes('чт') || tripDays.includes('пт') || tripDays.includes('пн-пт'))) return false;
    }
    if (selectedFilter === 'premium' && driver.package !== 'premium') return false;
    if (selectedFilter === 'budget' && driver.price > 8) return false;

    // Поиск по имени
    if (searchQuery && !driver.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;

    // Расширенные фильтры
    if (activeFilters.package !== 'all' && driver.package !== activeFilters.package) return false;
    if (parseFloat(driver.distance) > activeFilters.maxDistance) return false;
    if (driver.rating < activeFilters.minRating) return false;
    if (driver.price > activeFilters.maxPrice) return false;
    if (activeFilters.hasAirCondition && !driver.hasAirCondition) return false;
    if (activeFilters.hasWifi && !driver.hasWifi) return false;
    if (activeFilters.hasCharger && !driver.hasCharger) return false;
    if (activeFilters.onlyAvailable && !driver.isAvailable) return false;

    // Новые умные фильтры
    
    // Фильтр по времени работы
    if (activeFilters.timeSlot !== 'all') {
      const departureHour = parseInt(driver.departureTime.split(':')[0]);
      const arrivalHour = parseInt(driver.arrivalTime.split(':')[0]);
      
      if (activeFilters.timeSlot === 'morning' && !(departureHour >= 6 && departureHour <= 12)) return false;
      if (activeFilters.timeSlot === 'afternoon' && !(departureHour >= 12 && departureHour <= 18)) return false;
      if (activeFilters.timeSlot === 'evening' && !(departureHour >= 18 && departureHour <= 24)) return false;
      if (activeFilters.timeSlot === 'night' && !(departureHour >= 0 && departureHour <= 6)) return false;
      if (activeFilters.timeSlot === '24h' && !((arrivalHour - departureHour) >= 12 || (arrivalHour + 24 - departureHour) >= 12)) return false;
    }

    // Фильтр по дням недели
    if (activeFilters.workDays !== 'all') {
      const tripDays = driver.tripDays.toLowerCase();
      if (activeFilters.workDays === 'weekdays' && !(tripDays.includes('пн') || tripDays.includes('вт') || tripDays.includes('ср') || tripDays.includes('чт') || tripDays.includes('пт') || tripDays.includes('пн-пт'))) return false;
      if (activeFilters.workDays === 'weekends' && !(tripDays.includes('сб') || tripDays.includes('вс'))) return false;
      if (activeFilters.workDays === 'daily' && !tripDays.includes('ежедневно') && !tripDays.includes('пн-вс')) return false;
    }

    // Фильтр по опыту водителя
    if (driver.experience < activeFilters.minExperience) return false;

    // Фильтр по возрасту автомобиля
    const currentYear = new Date().getFullYear();
    const carAge = currentYear - driver.vehicleYear;
    if (carAge > activeFilters.maxCarAge) return false;

    // Фильтр по семейному члену
    if (activeFilters.familyMember !== 'all' && driver.forMember !== activeFilters.familyMember) return false;

    // Фильтр по ценовому диапазону
    if (activeFilters.priceRange !== 'all') {
      if (activeFilters.priceRange === 'budget' && driver.price > 8) return false;
      if (activeFilters.priceRange === 'standard' && (driver.price < 8 || driver.price > 12)) return false;
      if (activeFilters.priceRange === 'premium' && driver.price < 12) return false;
    }

    return true;
  });

  return (
    <SafeAreaView style={[DriversScreenStyles.container, { backgroundColor: isDark ? '#111827' : '#F8FAFC' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={DriversScreenStyles.header}>
        <Text style={[DriversScreenStyles.title, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
          Мои водители
        </Text>
        <Text style={[DriversScreenStyles.subtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
          Выберите водителя для поездки
        </Text>
      </View>

      {/* Search Bar */}
      <View style={DriversScreenStyles.content}>
        <View style={DriversScreenStyles.filterContainer}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[DriversScreenStyles.filterButton, selectedFilter === filter.id && DriversScreenStyles.filterButtonActive]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Text style={[
                DriversScreenStyles.filterButtonText,
                selectedFilter === filter.id && DriversScreenStyles.filterButtonTextActive
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView 
          style={DriversScreenStyles.driversList} 
          showsVerticalScrollIndicator={false}
        >
          {filteredDrivers.map((driver) => {
            const isExpanded = expandedDrivers.includes(driver.id);
            
            return (
              <AppCard key={driver.id} style={DriversScreenStyles.driverCard} margin={8}>
                <TouchableOpacity 
                  style={DriversScreenStyles.driverContent}
                  onPress={() => toggleDriverExpansion(driver.id)}
                  activeOpacity={0.9}
                >
                  {/* Компактная карточка водителя */}
                  <View style={DriversScreenStyles.driverCompactHeader}>
                    {/* Аватар слева */}
                    <View style={DriversScreenStyles.driverAvatar}>
                      <Ionicons name="person" size={32} color="#1E3A8A" />
                    </View>
                    
                    {/* Информация о водителе */}
                    <View style={DriversScreenStyles.driverInfo}>
                      {/* Имя и рейтинг в одной строке */}
                      <View style={DriversScreenStyles.nameRatingRow}>
                        <Text style={[DriversScreenStyles.driverName, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
                          {driver.name}
                        </Text>
                        <View style={DriversScreenStyles.driverRating}>
                          <RatingStars rating={driver.rating} />
                          <Text style={[DriversScreenStyles.ratingText, { color: isDark ? '#10B981' : '#059669' }]}>
                            {driver.rating}
                          </Text>
                        </View>
                      </View>
                      
                      {/* Автомобиль и номер */}
                      <View style={DriversScreenStyles.carInfoRow}>
                        <Text style={[DriversScreenStyles.carInfoText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                          {driver.carModel} • {driver.carNumber}
                        </Text>
                      </View>
                      
                      {/* Статус водителя */}
                      <View style={DriversScreenStyles.statusInfo}>
                        <View style={[
                          DriversScreenStyles.statusDot,
                          { backgroundColor: driver.isOnline ? '#10B981' : '#6B7280' }
                        ]} />
                        <Text style={[DriversScreenStyles.statusText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                          {driver.isOnline ? 'Онлайн' : 'Офлайн'}
                        </Text>
                      </View>
                       
                       {/* Тег для кого водитель - с большим отступом */}
                       <View style={DriversScreenStyles.memberTagRowSpaced}>
                          <View style={[DriversScreenStyles.memberTagCompact, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}>
                            <Ionicons 
                              name={getMemberData(driver.forMember).icon as any} 
                              size={16} 
                              color={isDark ? '#9CA3AF' : '#6B7280'} 
                              style={DriversScreenStyles.memberIcon}
                            />
                            <Text style={[DriversScreenStyles.memberName, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                              {getMemberData(driver.forMember).name}
                            </Text>
                          </View>
                       </View>
                    </View>
                    
                    {/* Стрелка раскрытия */}
                    <View style={DriversScreenStyles.expandArrow}>
                      <Ionicons 
                        name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"} 
                        size={20} 
                        color={isDark ? '#9CA3AF' : '#6B7280'} 
                      />
                    </View>
                  </View>

                  {/* Раскрывающиеся детали */}
                  {isExpanded && (
                    <View style={DriversScreenStyles.driverExpanded}>
                      {/* Маршрутная информация с временем справа от каждого адреса */}
                      <View style={DriversScreenStyles.routeSection}>
                        {driver.addresses.map((address, index) => {
                          // Определяем цвет и тип точки: зеленая для выезда, синие для промежуточных, синяя капля для финиша
                          let pinColor: string;
                          let pinIcon: string;
                          let timeToShow: string;
                          
                          if (index === 0) {
                            pinColor = '#10B981'; // зеленая для выезда
                            pinIcon = 'ellipse';
                            timeToShow = driver.departureTime;
                          } else if (index === driver.addresses.length - 1) {
                            pinColor = '#3B82F6'; // синяя для приезда
                            pinIcon = 'location';
                            timeToShow = driver.arrivalTime;
                          } else {
                            pinColor = '#3B82F6'; // синяя для промежуточных точек
                            pinIcon = 'ellipse';
                            // Для промежуточных точек можно показать примерное время или пустую строку
                            const hours = parseInt(driver.departureTime.split(':')[0]);
                            const minutes = parseInt(driver.departureTime.split(':')[1]);
                            const intermediateTime = new Date();
                            intermediateTime.setHours(hours + index, minutes + (index * 15));
                            timeToShow = `${intermediateTime.getHours().toString().padStart(2, '0')}:${intermediateTime.getMinutes().toString().padStart(2, '0')}`;
                          }
                          
                          return (
                            <View key={index} style={DriversScreenStyles.routePointWithTime}>
                              <View style={DriversScreenStyles.routeLeftSide}>
                                <View style={DriversScreenStyles.routePinContainer}>
                                  <Ionicons 
                                    name={pinIcon as any}
                                    size={pinIcon === 'ellipse' ? 12 : 20} 
                                    color={pinColor} 
                                  />
                                </View>
                                <Text style={[DriversScreenStyles.routeText, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
                                  {address}
                                </Text>
                              </View>
                              <Text style={[DriversScreenStyles.routeTime, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                                {timeToShow}
                              </Text>
                            </View>
                          );
                        })}
                      </View>

                      {/* Дополнительная информация */}
                      <View style={DriversScreenStyles.tripDetails}>
                        <View style={DriversScreenStyles.tripDetailItem}>
                          <Ionicons name="calendar" size={16} color="#6B7280" />
                          <Text style={[DriversScreenStyles.tripDetailText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                            {driver.tripDays}
                          </Text>
                        </View>
                        <View style={DriversScreenStyles.tripDetailItem}>
                          <Ionicons name="diamond" size={16} color="#6B7280" />
                          <Text style={[DriversScreenStyles.tripDetailText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                            {driver.package === 'base' ? 'Базовый' : 
                             driver.package === 'plus' ? 'Плюс' : 'Премиум'}
                          </Text>
                        </View>
                        <View style={DriversScreenStyles.tripDetailItem}>
                          <Text style={[DriversScreenStyles.tripDetailText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                            {driver.addresses.length} остановок
                          </Text>
                        </View>
                      </View>

                      {/* Кнопки действий */}
                      <View style={DriversScreenStyles.expandedActions}>
                        <TouchableOpacity 
                          style={DriversScreenStyles.callButtonExpanded}
                          onPress={() => handleCallDriver(driver)}
                        >
                          <Ionicons name="call" size={20} color="#FFFFFF" />
                          <Text style={DriversScreenStyles.callButtonText}>Позвонить</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[
                            DriversScreenStyles.chatButtonExpanded,
                            !driver.isOnline && DriversScreenStyles.chatButtonDisabled
                          ]}
                          onPress={() => handleChatDriver(driver)}
                          disabled={!driver.isOnline}
                        >
                          <Ionicons 
                            name="chatbubble" 
                            size={20} 
                            color={driver.isOnline ? "#1E3A8A" : "#9CA3AF"} 
                          />
                          <Text style={[
                            DriversScreenStyles.chatButtonText,
                            !driver.isOnline && DriversScreenStyles.chatButtonTextDisabled
                          ]}>
                            Чат
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              </AppCard>
            );
          })}
        </ScrollView>

        {selectedDriver && (
          <Button
            title={`Забронировать ${selectedDriver.name}`}
            onPress={handleBookRide}
            style={{ marginTop: 20 }}
          />
        )}
      </View>

      {/* Модал центра уведомлений */}
      <Modal
        visible={showNotificationsModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[DriversScreenStyles.modalContainer, { backgroundColor: isDark ? '#000000' : '#F2F2F7' }]}>
          <View style={[DriversScreenStyles.modalHeader, { borderBottomColor: isDark ? '#333333' : '#E5E5EA' }]}>
            <Text style={[DriversScreenStyles.modalTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              Центр уведомлений
            </Text>
            <View style={DriversScreenStyles.modalHeaderActions}>
              {!isSelectionMode ? (
                <>
                  <TouchableOpacity onPress={toggleSelectionMode} style={DriversScreenStyles.modalSelectButton}>
                    <Text style={[DriversScreenStyles.modalSelectButtonText, { color: isDark ? '#FFFFFF' : '#1E3A8A' }]}>
                      Выбрать
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowNotificationsModal(false)} style={DriversScreenStyles.closeButton}>
                    <Ionicons name="close" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity onPress={toggleSelectionMode} style={DriversScreenStyles.cancelButton}>
                  <Text style={[DriversScreenStyles.cancelButtonText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                    Отмена
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {!isSelectionMode && notifications.filter(n => !n.isRead).length > 0 && (
            <TouchableOpacity style={styles.markAllButton} onPress={handleMarkAllAsRead}>
              <Text style={styles.markAllButtonText}>
                Прочитать все ({notifications.filter(n => !n.isRead).length})
              </Text>
            </TouchableOpacity>
          )}

          <ScrollView style={styles.notificationsList} showsVerticalScrollIndicator={false}>
            {notifications.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons 
                  name="notifications-off" 
                  size={64} 
                  color={isDark ? '#6B7280' : '#9CA3AF'} 
                />
                <Text style={[styles.emptyStateText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                  Нет уведомлений
                </Text>
                <Text style={[styles.emptyStateSubtext, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  Все уведомления будут отображаться здесь
                </Text>
              </View>
            ) : (
              notifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  style={[
                    styles.notificationItem,
                    { 
                      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                      borderColor: isDark ? '#374151' : '#E5E5EA'
                    },
                    !notification.isRead && styles.unreadNotification,
                    isSelectionMode && selectedNotifications.includes(notification.id) && styles.selectedNotification,
                  ]}
                  onPress={() => isSelectionMode ? toggleNotificationSelection(notification.id) : null}
                  disabled={!isSelectionMode}
                >
                  <View style={styles.notificationContent}>
                    {isSelectionMode && (
                      <TouchableOpacity
                        style={styles.checkbox}
                        onPress={() => toggleNotificationSelection(notification.id)}
                      >
                        <Ionicons
                          name={selectedNotifications.includes(notification.id) ? "checkbox" : "square-outline"}
                          size={24}
                          color={selectedNotifications.includes(notification.id) ? "#1E3A8A" : "#9CA3AF"}
                        />
                      </TouchableOpacity>
                    )}

                    <View
                      style={[
                        styles.notificationIcon,
                        { backgroundColor: getNotificationColor(notification.type) + '20' },
                      ]}
                    >
                      <Ionicons
                        name={getNotificationIcon(notification.type)}
                        size={20}
                        color={getNotificationColor(notification.type)}
                      />
                    </View>

                    <View style={styles.notificationTextContainer}>
                      <Text
                        style={[
                          styles.notificationTitle,
                          { color: isDark ? '#FFFFFF' : '#000000' },
                          !notification.isRead && styles.unreadTitle,
                        ]}
                      >
                        {notification.title}
                      </Text>
                      <Text
                        style={[
                          styles.notificationMessage,
                          { color: isDark ? '#9CA3AF' : '#6B7280' }
                        ]}
                      >
                        {notification.message}
                      </Text>
                      <Text
                        style={[
                          styles.notificationTime,
                          { color: isDark ? '#6B7280' : '#9CA3AF' }
                        ]}
                      >
                        {new Date(notification.createdAt).toLocaleString('ru-RU')}
                      </Text>
                    </View>

                    {!isSelectionMode && (
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteNotification(notification.id)}
                      >
                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>

          {/* Кнопки снизу модала */}
          {isSelectionMode && (
            <View style={[styles.bottomActions, { borderTopColor: isDark ? '#333333' : '#E5E5EA' }]}>
              <TouchableOpacity 
                style={[styles.bottomButton, styles.selectAllButton]} 
                onPress={selectAllNotifications}
              >
                <Text style={[styles.bottomButtonText, { color: '#1E3A8A' }]}>
                  {selectedNotifications.length === notifications.length ? 'Снять все' : 'Выбрать все'}
                </Text>
              </TouchableOpacity>
              
              {selectedNotifications.length > 0 && (
                <TouchableOpacity 
                  style={[styles.bottomButton, styles.deleteAllButton]} 
                  onPress={deleteSelectedNotifications}
                >
                  <Text style={[styles.bottomButtonText, { color: '#FFFFFF' }]}>
                    Удалить ({selectedNotifications.length})
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </Modal>

      {/* Модал фильтров */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: isDark ? '#111827' : '#F8FAFC' }]}>
          <View style={styles.modalHeaderEmpty}>
            <TouchableOpacity 
              style={styles.closeButtonCustom} 
              onPress={() => setShowFilterModal(false)}
            >
              <Ionicons name="close" size={24} color={isDark ? '#F9FAFB' : '#1F2937'} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterModalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.filterSection}>
              <View style={styles.filterGrid}>
                {filters.map((filter) => (
                  <TouchableOpacity
                    key={filter.id}
                    style={[
                      styles.filterGridItem,
                      selectedFilter === filter.id && styles.filterGridItemActive,
                      { backgroundColor: isDark ? '#374151' : '#F3F4F6' }
                    ]}
                    onPress={() => setSelectedFilter(filter.id)}
                  >
                    <Ionicons 
                      name={filter.icon as any} 
                      size={20} 
                      color={selectedFilter === filter.id ? '#FFFFFF' : (isDark ? '#9CA3AF' : '#1E3A8A')} 
                    />
                    <Text style={[
                      styles.filterGridText,
                      { color: selectedFilter === filter.id ? '#FFFFFF' : (isDark ? '#9CA3AF' : '#1E3A8A') }
                    ]}>
                      {filter.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Кнопки действий */}
          <View style={[styles.filterModalActions, { borderTopColor: isDark ? '#374151' : '#E5E7EB' }]}>
            <TouchableOpacity 
              style={[styles.filterResetButton, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}
              onPress={() => setSelectedFilter('all')}
            >
              <Text style={[styles.filterResetButtonText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                Сбросить
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.filterApplyButton}
              onPress={() => setShowFilterModal(false)}
            >
              <Text style={styles.filterApplyButtonText}>Применить</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default DriversScreen;
