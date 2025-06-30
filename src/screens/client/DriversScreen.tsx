import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Alert,
  TextInput,
  StatusBar,
  Modal,
  Linking
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AppCard from '../../components/AppCard';
import RatingStars from '../../components/RatingStars';
import { notificationService, Notification } from '../../services/NotificationService';
import { isDriverAvailableForChat } from '../../utils/navigationHelpers';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { ClientStackParamList } from '../../types/navigation';

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

// Добавляем определение familyMembers с иконками (как в MapScreen)
const familyMembers = [
  { id: 'me', name: 'Я', icon: 'person-circle' },
  { id: 'daughter', name: 'Дочь', icon: 'flower' },
  { id: 'son', name: 'Сын', icon: 'football' },
  { id: 'wife', name: 'Жена', icon: 'heart' },
  { id: 'husband', name: 'Муж', icon: 'car-sport' },
];

const drivers: Driver[] = [
  {
    id: 'driver1',
    name: 'Рашад Алиев',
    rating: 4.8,
    totalRides: 1247,
    carModel: 'Toyota Camry',
    carNumber: '10-AA-123',
    isOnline: true,
    distance: '0.8 км',
    estimatedTime: '5 мин',
    isAvailable: true,
    package: 'premium' as const,
    price: 12,
    experience: 8,
    vehicleYear: 2020,
    hasAirCondition: true,
    hasWifi: true,
    hasCharger: true,
    forMember: 'me',
    tripDays: 'пн, ср, пт',
    addresses: ['Дом ул. Низами 10', 'Офис БЦ Port Baku', 'Торговый центр 28 Mall'],
    departureTime: '08:00',
    arrivalTime: '18:30',
    schedule: 'пн, ср, пт (8:00-18:30)',
  },
  {
    id: 'driver2',
    name: 'Эльхан Мустафаев',
    rating: 4.9,
    totalRides: 892,
    carModel: 'Mercedes E-Class',
    carNumber: '90-MB-789',
    isOnline: true,
    distance: '1.2 км',
    estimatedTime: '7 мин',
    isAvailable: true,
    package: 'premium' as const,
    price: 15,
    experience: 12,
    vehicleYear: 2021,
    hasAirCondition: true,
    hasWifi: true,
    hasCharger: true,
    forMember: 'me',
    tripDays: 'вт, чт',
    addresses: ['БЦ Port Baku', 'Аэропорт', 'ТЦ 28 Mall', 'Вокзал'],
    departureTime: '09:00',
    arrivalTime: '19:00',
    schedule: 'вт, чт (деловые поездки)',
  },
  {
    id: 'driver3',
    name: 'Эльнур Мамедов',
    rating: 4.9,
    totalRides: 654,
    carModel: 'Hyundai Elantra',
    carNumber: '90-BB-456',
    isOnline: true,
    distance: '1.5 км',
    estimatedTime: '8 мин',
    isAvailable: true,
    package: 'plus' as const,
    price: 8,
    experience: 5,
    vehicleYear: 2019,
    hasAirCondition: true,
    hasWifi: false,
    hasCharger: true,
    forMember: 'daughter',
    tripDays: 'пн-пт',
    addresses: ['Школа №132 Ясамал', 'Дом ул. Низами 10'],
    departureTime: '07:30',
    arrivalTime: '16:00',
    schedule: 'пн-пт (школьные поездки)',
  },
  {
    id: 'driver4',
    name: 'Фарид Джафаров',
    rating: 4.7,
    totalRides: 423,
    carModel: 'Kia Rio',
    carNumber: '77-KR-321',
    isOnline: false,
    distance: '2.1 км',
    estimatedTime: '12 мин',
    isAvailable: false,
    package: 'base' as const,
    price: 6,
    experience: 3,
    vehicleYear: 2018,
    hasAirCondition: true,
    hasWifi: false,
    hasCharger: false,
    forMember: 'daughter',
    tripDays: 'сб, вс',
    addresses: ['Дом ул. Низами 10', 'Парк Bulvar', 'Торговый центр'],
    departureTime: '10:00',
    arrivalTime: '18:00',
  },
  {
    id: 'driver5',
    name: 'Орхан Гасанов',
    rating: 4.7,
    totalRides: 789,
    carModel: 'Kia Cerato',
    carNumber: '77-CC-789',
    isOnline: true,
    distance: '0.9 км',
    estimatedTime: '6 мин',
    isAvailable: true,
    package: 'plus' as const,
    price: 9,
    experience: 6,
    vehicleYear: 2020,
    hasAirCondition: true,
    hasWifi: true,
    hasCharger: false,
    forMember: 'son',
    tripDays: 'пн, ср, пт, сб',
    addresses: ['Спорткомплекс Наримановский', 'Дом ул. Низами 10', 'Стадион'],
    departureTime: '15:00',
    arrivalTime: '20:00',
  },
  {
    id: 'driver6',
    name: 'Самир Исмаилов',
    rating: 4.6,
    totalRides: 567,
    carModel: 'Nissan Altima',
    carNumber: '99-DD-321',
    isOnline: true,
    distance: '1.8 км',
    estimatedTime: '10 мин',
    isAvailable: true,
    package: 'plus' as const,
    price: 10,
    experience: 7,
    vehicleYear: 2019,
    hasAirCondition: true,
    hasWifi: false,
    hasCharger: true,
    forMember: 'wife',
    tripDays: 'вт, чт, сб',
    addresses: ['Салон красоты ул. Физули', 'ТЦ 28 Mall', 'Торговый квартал'],
    departureTime: '09:00',
    arrivalTime: '19:00',
  },
  {
    id: 'driver7',
    name: 'Ровшан Алиев',
    rating: 4.5,
    totalRides: 234,
    carModel: 'Volkswagen Polo',
    carNumber: '55-VW-654',
    isOnline: false,
    distance: '3.2 км',
    estimatedTime: '18 мин',
    isAvailable: false,
    package: 'base' as const,
    price: 7,
    experience: 2,
    vehicleYear: 2017,
    hasAirCondition: false,
    hasWifi: false,
    hasCharger: false,
    forMember: 'wife',
    tripDays: 'пн-вс',
    addresses: ['Дом ул. Низами 10', 'Аптека', 'Продуктовый'],
    departureTime: '08:00',
    arrivalTime: '22:00',
  },
  {
    id: 'driver8',
    name: 'Турал Мамедов',
    rating: 4.8,
    totalRides: 1103,
    carModel: 'Volkswagen Jetta',
    carNumber: '55-EE-654',
    isOnline: true,
    distance: '1.0 км',
    estimatedTime: '6 мин',
    isAvailable: true,
    package: 'premium' as const,
    price: 13,
    experience: 10,
    vehicleYear: 2021,
    hasAirCondition: true,
    hasWifi: true,
    hasCharger: true,
    forMember: 'husband',
    tripDays: 'ежедневно',
    addresses: ['Автосервис ул. Гянджа', 'Дом ул. Низами 10', 'Заправка', 'Рынок', 'Банк'],
    departureTime: '07:00',
    arrivalTime: '20:00',
  },
];

const DriversScreen: React.FC = () => {
  const { isDark } = useTheme();
  const navigation = useNavigation<BottomTabNavigationProp<ClientStackParamList, 'Drivers'>>();
  const [searchQuery, setSearchQuery] = useState('');
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

  useEffect(() => {
    setNotifications(notificationService.getNotifications());
  }, []);

  const handleDriverSelect = (driver: Driver) => {
    Alert.alert(
      'Выбор водителя',
      `Выбрать ${driver.name}?\n${driver.carModel} • ${driver.carNumber}\nРейтинг: ${driver.rating} ⭐`,
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Выбрать', onPress: () => Alert.alert('Успешно', 'Водитель выбран!') }
      ]
    );
  };

  const handleBookDriver = (driver: Driver) => {
    Alert.alert(
      'Бронирование',
      `Забронировать ${driver.name} на завтра?\n${driver.carModel} • ${driver.carNumber}`,
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Забронировать', onPress: () => Alert.alert('Успешно', 'Водитель забронирован!') }
      ]
    );
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
    console.log('💬 Переход в главный список чатов из списка водителей');
    
    try {
      // Переключаемся на таб Chat (главный список чатов)
      navigation.navigate('Chat' as never);
      
      console.log('✅ Успешная навигация в главный список чатов из списка водителей');
    } catch (error) {
      console.error('❌ Ошибка навигации в чат:', error);
      const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
      Alert.alert('Ошибка', 'Не удалось открыть чат: ' + message);
    }
  };

  // Заменяем getMemberDisplayName на getMemberIcon
  const getMemberIcon = (memberId: string): string => {
    const member = familyMembers.find(m => m.id === memberId);
    return member?.icon || 'person-circle';
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
    const member = familyMembers.find(m => m.id === memberId);
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
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111827' : '#F8FAFC' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
          Мои водители
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilterModal(true)}>
            <Ionicons name="filter-outline" size={24} color={isDark ? '#F9FAFB' : '#1F2937'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.notificationBtn} onPress={handleNotifications}>
            <Ionicons name="notifications-outline" size={24} color={isDark ? '#F9FAFB' : '#1F2937'} />
            {notificationService.getUnreadCount() > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{notificationService.getUnreadCount()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarWrapper}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск водителей..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#6B7280"
            underlineColorAndroid="transparent"
            returnKeyType="search"
          />
        </View>
      </View>







      {/* Drivers List */}
      <ScrollView 
        style={styles.driversList} 
        showsVerticalScrollIndicator={false}
      >
        {filteredDrivers.map((driver) => {
          const isExpanded = expandedDrivers.includes(driver.id);
          
          return (
            <AppCard key={driver.id} style={styles.driverCard} margin={8}>
              <TouchableOpacity 
                style={styles.driverContent}
                onPress={() => toggleDriverExpansion(driver.id)}
                activeOpacity={0.9}
              >
                {/* Компактная карточка водителя */}
                <View style={styles.driverCompactHeader}>
                  {/* Аватар слева */}
                  <View style={styles.driverAvatar}>
                    <Ionicons name="person" size={32} color="#1E3A8A" />
                  </View>
                  
                  {/* Информация о водителе */}
                  <View style={styles.driverInfo}>
                                        {/* Имя и рейтинг в одной строке */}
                    <View style={styles.nameRatingRow}>
                      <Text style={[styles.driverName, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
                        {driver.name}
                      </Text>
                      <Text style={[styles.ratingNumber, { color: isDark ? '#10B981' : '#059669' }]}>
                        {driver.rating}
                      </Text>
                    </View>
                    
                    {/* Автомобиль и номер */}
                    <View style={styles.carInfoRow}>
                      <Text style={[styles.carInfoText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                        {driver.carModel} • {driver.carNumber}
                      </Text>
                    </View>
                    
                    {/* Статус водителя */}
                    <View style={styles.statusInfo}>
                      <View style={[
                        styles.statusDot,
                        { backgroundColor: driver.isOnline ? '#10B981' : '#6B7280' }
                      ]} />
                      <Text style={[styles.statusText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                        {driver.isOnline ? 'Онлайн' : 'Офлайн'}
                      </Text>
                    </View>
                     
                     {/* Тег для кого водитель - с большим отступом */}
                     <View style={styles.memberTagRowSpaced}>
                        <View style={[styles.memberTagCompact, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}>
                          <Ionicons 
                            name={getMemberIcon(driver.forMember) as any} 
                            size={16} 
                            color={isDark ? '#9CA3AF' : '#6B7280'} 
                            style={styles.memberIcon}
                          />
                          <Text style={[styles.memberName, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                            {getMemberData(driver.forMember).name}
                          </Text>
                        </View>
                     </View>
                  </View>
                  
                  {/* Стрелка раскрытия */}
                  <View style={styles.expandArrow}>
                    <Ionicons 
                      name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"} 
                      size={20} 
                      color={isDark ? '#9CA3AF' : '#6B7280'} 
                    />
                  </View>
                </View>

                {/* Раскрывающиеся детали */}
                {isExpanded && (
                  <View style={styles.driverExpanded}>
                    {/* Маршрутная информация с временем справа от каждого адреса */}
                    <View style={styles.routeSection}>
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
                          <View key={index} style={styles.routePointWithTime}>
                            <View style={styles.routeLeftSide}>
                              <View style={styles.routePinContainer}>
                                <Ionicons 
                                  name={pinIcon as any}
                                  size={pinIcon === 'ellipse' ? 12 : 20} 
                                  color={pinColor} 
                                />
                              </View>
                              <Text style={[styles.routeText, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
                                {address}
                              </Text>
                            </View>
                            <Text style={[styles.routeTime, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                              {timeToShow}
                            </Text>
                          </View>
                        );
                      })}
                    </View>

                    {/* Дополнительная информация */}
                    <View style={styles.tripDetails}>
                      <View style={styles.tripDetailItem}>
                        <Ionicons name="calendar" size={16} color="#6B7280" />
                        <Text style={[styles.tripDetailText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                          {driver.tripDays}
                        </Text>
                      </View>
                      <View style={styles.tripDetailItem}>
                        <Ionicons name="diamond" size={16} color="#6B7280" />
                        <Text style={[styles.tripDetailText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                          {driver.package === 'base' ? 'Базовый' : 
                           driver.package === 'plus' ? 'Плюс' : 'Премиум'}
                        </Text>
                      </View>
                      <View style={styles.tripDetailItem}>
                        <Text style={[styles.tripDetailText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                          {driver.addresses.length} остановок
                        </Text>
                      </View>
                    </View>

                    {/* Кнопки действий */}
                    <View style={styles.expandedActions}>
                      <TouchableOpacity 
                        style={styles.callButtonExpanded}
                        onPress={() => handleCallDriver(driver)}
                      >
                        <Ionicons name="call" size={20} color="#FFFFFF" />
                        <Text style={styles.callButtonText}>Позвонить</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[
                          styles.chatButtonExpanded,
                          !driver.isOnline && styles.chatButtonDisabled
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
                          styles.chatButtonText,
                          !driver.isOnline && styles.chatButtonTextDisabled
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

      {/* Модал центра уведомлений */}
      <Modal
        visible={showNotificationsModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.modalContainer, { backgroundColor: isDark ? '#000000' : '#F2F2F7' }]}>
          <View style={[styles.modalHeader, { borderBottomColor: isDark ? '#333333' : '#E5E5EA' }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              Центр уведомлений
            </Text>
            <View style={styles.modalHeaderActions}>
              {!isSelectionMode ? (
                <>
                  <TouchableOpacity onPress={toggleSelectionMode} style={styles.modalSelectButton}>
                    <Text style={[styles.modalSelectButtonText, { color: isDark ? '#FFFFFF' : '#1E3A8A' }]}>
                      Выбрать
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowNotificationsModal(false)} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity onPress={toggleSelectionMode} style={styles.cancelButton}>
                  <Text style={[styles.cancelButtonText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
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
                        {notification.time.toLocaleString('ru-RU')}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  filterBtn: {
    padding: 8,
  },
  filterButton: {
    padding: 8,
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 3,
    right: 3,
    backgroundColor: '#EF4444',
    borderRadius: 6,
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchBarWrapper: {
    paddingHorizontal: 16,
    marginBottom: 0,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    height: 44,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    paddingVertical: 0,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
  },

  driversList: {
    flex: 1,
    paddingHorizontal: 8,
    marginTop: 0,
    paddingTop: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },
  driverCard: {
    marginBottom: 8,
  },
  driverContent: {
    paddingVertical: 8,
    borderRadius: 12,
  },
  driverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  driverInfo: {
    flex: 1,
    marginLeft: 12,
  },
  driverAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
    marginTop: 10,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  carInfo: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  driverStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
  },
  driverStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  driverFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
  selectButton: {
    backgroundColor: '#1E3A8A',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bookButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  bookButtonText: {
    color: '#1E3A8A',
    fontSize: 14,
    fontWeight: '600',
  },
  unavailableButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  unavailableButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  notificationBtn: {
    padding: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalSelectButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  modalSelectButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  modalHeaderEmpty: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  closeButtonCustom: {
    padding: 8,
    marginLeft: 8,
    marginTop: 8,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  markAllButton: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  markAllButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  notificationsList: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  notificationItem: {
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#1E3A8A',
  },
  selectedNotification: {
    borderColor: '#1E3A8A',
    borderWidth: 2,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 12,
    padding: 4,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  unreadTitle: {
    fontWeight: '700',
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 4,
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  bottomButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectAllButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#1E3A8A',
  },
  deleteAllButton: {
    backgroundColor: '#EF4444',
  },
  bottomButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Новые стили для компактной карточки водителя
  driverCompactHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  expandArrow: {
    position: 'absolute',
    right: 8, // сдвигаем еще правее на 8px
    bottom: 12, // в самом низу карточки
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  nameRatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  carInfoRow: {
    marginBottom: 6,
  },
  carInfoText: {
    fontSize: 13,
    fontWeight: '500',
  },
  ratingNumber: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusExpandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  unavailableText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  expandButton: {
    padding: 4,
    marginLeft: 8,
  },
  driverExpanded: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingTop: 16,
    marginTop: 12,
  },
  carInfoSection: {
    marginBottom: 16,
  },
  routeSection: {
    marginBottom: 16,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  routeIconText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  routeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tripDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tripDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tripDetailText: {
    fontSize: 12,
    fontWeight: '500',
  },
  expandedActions: {
    flexDirection: 'row',
    gap: 12,
  },
  callButtonExpanded: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E3A8A',
    borderRadius: 8,
    paddingVertical: 12,
  },
  callButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  chatButtonExpanded: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
  },
  chatButtonText: {
    color: '#1E3A8A',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  chatButtonDisabled: {
    backgroundColor: '#F9FAFB',
    opacity: 0.6,
  },
  chatButtonTextDisabled: {
    color: '#9CA3AF',
  },
  unavailableButtonExpanded: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
  },
  memberTagRow: {
    flexDirection: 'row',
  },
  memberTag: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 6,
  },
  memberTagCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  memberTagContent: {
    flex: 1,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  memberIcon: {
    marginRight: 6,
  },
  memberName: {
    fontSize: 12,
    fontWeight: '600',
  },
  memberRoute: {
    fontSize: 10,
    fontWeight: '400',
    marginBottom: 2,
    lineHeight: 14,
  },
  memberSchedule: {
    fontSize: 10,
    fontWeight: '500',
  },
  memberDetailSection: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  memberDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 8,
  },
  memberDetailName: {
    fontSize: 14,
    fontWeight: '600',
  },
  memberDetailRoute: {
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 4,
    lineHeight: 16,
  },
  memberDetailSchedule: {
    fontSize: 12,
    fontWeight: '500',
  },
  memberTagText: {
    fontSize: 11,
    fontWeight: '500',
  },
  // Новые стили для адресов с временем
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    opacity: 0.7,
  },
  addAddressText: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 8,
  },
  routePinContainer: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  routePointWithTime: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  routeLeftSide: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  routeTime: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12,
  },
  memberTagRowSpaced: {
    flexDirection: 'row',
    marginTop: 8,
    marginLeft: -4, // сдвигаем левее для выравнивания с "Онлайн"
  },
  
  // Стили модала фильтров
  filterContent: {
    flex: 1,
    padding: 16,
  },
  filterGroup: {
    marginBottom: 24,
  },
  filterGroupTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  filterOptionText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  filterActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#1E3A8A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Стили для модала фильтров
  filterModalContent: {
    flex: 1,
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  filterGridItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: '45%',
    gap: 8,
  },
  filterGridItemActive: {
    backgroundColor: '#1E3A8A',
  },
  filterGridText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterModalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
  },
  filterResetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterResetButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  filterApplyButton: {
    flex: 1,
    backgroundColor: '#1E3A8A',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterApplyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

});

export default DriversScreen;
