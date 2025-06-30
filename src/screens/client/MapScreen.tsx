import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Animated,
  Easing,
  Alert,
  Linking,
  Modal,
  ScrollView
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AppCard from '../../components/AppCard';
import MapViewComponent, { MapViewRef } from '../../components/MapView';
import AppAvatar from '../../components/AppAvatar';
import RouteService, { RouteResponse } from '../../services/RouteService';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../../types/navigation';
import * as Location from 'expo-location';
import { notificationService, Notification } from '../../services/NotificationService';


const familyMembers = [
  { id: 'me', name: 'Я', icon: 'person-circle' },
  { id: 'daughter', name: 'Дочь', icon: 'flower' },
  { id: 'son', name: 'Сын', icon: 'football' },
  { id: 'wife', name: 'Жена', icon: 'heart' },
  { id: 'husband', name: 'Муж', icon: 'car-sport' },
];

const memberDrivers = {
  me: {
    name: 'Рашад Алиев',
    car: 'Toyota Camry',
    number: '10-AA-123',
    rating: 4.8,
    avatar: '',
  },
  daughter: {
    name: 'Эльнур Мамедов',
    car: 'Hyundai Elantra',
    number: '90-BB-456',
    rating: 4.9,
    avatar: '',
  },
  son: {
    name: 'Орхан Гасанов',
    car: 'Kia Cerato',
    number: '77-CC-789',
    rating: 4.7,
    avatar: '',
  },
  wife: {
    name: 'Фарид Джафаров',
    car: 'Nissan Altima',
    number: '99-DD-321',
    rating: 4.6,
    avatar: '',
  },
  husband: {
    name: 'Самир Исмаилов',
    car: 'Volkswagen Jetta',
    number: '55-EE-654',
    rating: 4.5,
    avatar: '',
  },
};

// Расписание поездок для каждого члена семьи (несколько поездок в день)
const memberSchedules = {
  me: [
    {
      id: '1',
      addressA: 'Дом, ул. Низами, 10',
      addressB: 'Офис, БЦ "Port Baku"',
      eta: '18 мин',
      traffic: 'Сильные пробки',
      pointA: { latitude: 40.4093, longitude: 49.8671 }, 
      pointB: { latitude: 40.3650, longitude: 49.8350 },
      departureTime: '08:30',
      arrivalTime: '08:48',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    },
    {
      id: '2',
      addressA: 'Офис, БЦ "Port Baku"',
      addressB: 'Дом, ул. Низами, 10',
      eta: '22 мин',
      traffic: 'Очень сильные пробки',
      pointA: { latitude: 40.3650, longitude: 49.8350 },
      pointB: { latitude: 40.4093, longitude: 49.8671 },
      departureTime: '18:00',
      arrivalTime: '18:22',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    }
  ],
  daughter: [
    {
      id: '1',
      addressA: 'Дом, ул. Низами, 10',
      addressB: 'Школа №132, Ясамал',
      eta: '15 мин',
      traffic: 'Легкие пробки',
      pointA: { latitude: 40.4093, longitude: 49.8671 },
      pointB: { latitude: 40.3950, longitude: 49.8820 },
      departureTime: '07:45',
      arrivalTime: '08:00',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    },
    {
      id: '2',
      addressA: 'Школа №132, Ясамал',
      addressB: 'Дом, ул. Низами, 10',
      eta: '12 мин',
      traffic: 'Свободно',
      pointA: { latitude: 40.3950, longitude: 49.8820 },
      pointB: { latitude: 40.4093, longitude: 49.8671 },
      departureTime: '13:15',
      arrivalTime: '13:27',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    }
  ],
  son: [
    {
      id: '1',
      addressA: 'Дом, ул. Низами, 10',
      addressB: 'Спорткомплекс, Наримановский р-н',
      eta: '20 мин',
      traffic: 'Средние пробки',
      pointA: { latitude: 40.4093, longitude: 49.8671 },
      pointB: { latitude: 40.4200, longitude: 49.9100 },
      departureTime: '15:30',
      arrivalTime: '15:50',
      days: ['tuesday', 'thursday', 'saturday']
    },
    {
      id: '2',
      addressA: 'Спорткомплекс, Наримановский р-н',
      addressB: 'Дом, ул. Низами, 10',
      eta: '25 мин',
      traffic: 'Сильные пробки',
      pointA: { latitude: 40.4200, longitude: 49.9100 },
      pointB: { latitude: 40.4093, longitude: 49.8671 },
      departureTime: '17:30',
      arrivalTime: '17:55',
      days: ['tuesday', 'thursday', 'saturday']
    }
  ],
  wife: [
    {
      id: '1',
      addressA: 'Дом, ул. Низами, 10',
      addressB: 'Салон красоты, ул. Физули',
      eta: '10 мин',
      traffic: 'Свободно',
      pointA: { latitude: 40.4093, longitude: 49.8671 },
      pointB: { latitude: 40.3780, longitude: 49.8480 },
      departureTime: '11:00',
      arrivalTime: '11:10',
      days: ['wednesday', 'friday']
    },
    {
      id: '2',
      addressA: 'Салон красоты, ул. Физули',
      addressB: 'ТЦ "28 Mall"',
      eta: '8 мин',
      traffic: 'Свободно',
      pointA: { latitude: 40.3780, longitude: 49.8480 },
      pointB: { latitude: 40.3850, longitude: 49.8550 },
      departureTime: '12:30',
      arrivalTime: '12:38',
      days: ['wednesday', 'friday']
    }
  ],
  husband: [
    {
      id: '1',
      addressA: 'Дом, ул. Низами, 10',
      addressB: 'Автосервис, ул. Гянджа',
      eta: '25 мин',
      traffic: 'Средние пробки',
      pointA: { latitude: 40.4093, longitude: 49.8671 },
      pointB: { latitude: 40.4300, longitude: 49.8200 },
      departureTime: '09:00',
      arrivalTime: '09:25',
      days: ['monday', 'wednesday', 'friday']
    },
    {
      id: '2',
      addressA: 'Автосервис, ул. Гянджа',
      addressB: 'Дом, ул. Низами, 10',
      eta: '22 мин',
      traffic: 'Легкие пробки',
      pointA: { latitude: 40.4300, longitude: 49.8200 },
      pointB: { latitude: 40.4093, longitude: 49.8671 },
      departureTime: '18:20',
      arrivalTime: '18:42',
      days: ['monday', 'wednesday', 'friday']
    }
  ],
};

// Функция для получения дня недели на английском
const getCurrentDayOfWeek = () => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[new Date().getDay()];
};

// Функция для получения ближайшей предстоящей поездки
const getNextTripForMember = (memberId: string) => {
  const schedules = memberSchedules[memberId as keyof typeof memberSchedules] || [];
  const currentDay = getCurrentDayOfWeek();
  const currentTime = new Date();
  const currentHours = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const currentTimeInMinutes = currentHours * 60 + currentMinutes;

  // Фильтруем поездки для текущего дня недели
  const todayTrips = schedules.filter(trip => trip.days.includes(currentDay));
  
  // Находим ближайшую поездку которая еще не прошла
  const upcomingTrips = todayTrips.filter(trip => {
    const [depHours, depMinutes] = trip.departureTime.split(':').map(Number);
    const depTimeInMinutes = depHours * 60 + depMinutes;
    return depTimeInMinutes > currentTimeInMinutes;
  });

  // Сортируем по времени отправления и возвращаем ближайшую
  if (upcomingTrips.length > 0) {
    return upcomingTrips.sort((a, b) => {
      const aTime = a.departureTime.split(':').map(Number);
      const bTime = b.departureTime.split(':').map(Number);
      const aMinutes = aTime[0] * 60 + aTime[1];
      const bMinutes = bTime[0] * 60 + bTime[1];
      return aMinutes - bMinutes;
    })[0];
  }

  // Если сегодня больше нет поездок, возвращаем null
  return null;
};

// Для обратной совместимости - получаем текущий маршрут для выбранного члена семьи
const getCurrentRoute = (memberId: string) => {
  const nextTrip = getNextTripForMember(memberId);
  if (nextTrip) {
    return nextTrip;
  }
  
  // Fallback - если нет поездок сегодня, показываем первую из расписания
  const schedules = memberSchedules[memberId as keyof typeof memberSchedules] || [];
  return schedules[0] || null;
};

const memberTrips = {
  me: {
    nextTrip: new Date(Date.now() + 60 * 60 * 1000), // через 1 час
  },
  daughter: {
    nextTrip: new Date(Date.now() + 15 * 60 * 1000), // через 15 минут
  },
  son: {
    nextTrip: new Date(Date.now() + 2 * 60 * 60 * 1000), // через 2 часа
  },
  wife: {
    nextTrip: new Date(Date.now() + 10 * 60 * 1000), // через 10 минут
  },
  husband: {
    nextTrip: new Date(Date.now() + 30 * 60 * 1000), // через 30 минут
  },
};

// Генерация сегментов маршрута с пробками (5 уровней)
const generateRouteSegments = (pointA: { latitude: number; longitude: number }, pointB: { latitude: number; longitude: number }, traffic: string) => {
  const segments = [];
  const steps = 6; // Увеличиваем количество сегментов для более детального отображения
  
  // Вспомогательная функция для расчета расстояния между точками
  const calculateDistance = (point1: { latitude: number; longitude: number }, point2: { latitude: number; longitude: number }): number => {
    const R = 6371000; // Радиус Земли в метрах
    const dLat = (point2.latitude - point1.latitude) * Math.PI / 180;
    const dLon = (point2.longitude - point1.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.latitude * Math.PI / 180) * Math.cos(point2.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };
  
  for (let i = 0; i < steps; i++) {
    const progress1 = i / steps;
    const progress2 = (i + 1) / steps;
    
    // Интерполяция координат
    const lat1 = pointA.latitude + (pointB.latitude - pointA.latitude) * progress1;
    const lng1 = pointA.longitude + (pointB.longitude - pointA.longitude) * progress1;
    const lat2 = pointA.latitude + (pointB.latitude - pointA.latitude) * progress2;
    const lng2 = pointA.longitude + (pointB.longitude - pointA.longitude) * progress2;
    
    // Определение уровня пробок для сегмента (5 уровней)
    let trafficLevel: 'free' | 'low' | 'medium' | 'high' | 'heavy' = 'free';
    
    if (traffic === 'Свободно') {
      trafficLevel = i < 5 ? 'free' : 'low';
    } else if (traffic === 'Легкие пробки') {
      trafficLevel = i < 2 ? 'free' : i < 5 ? 'low' : 'medium';
    } else if (traffic === 'Средние пробки') {
      trafficLevel = i < 1 ? 'low' : i < 4 ? 'medium' : i < 5 ? 'high' : 'medium';
    } else if (traffic === 'Сильные пробки') {
      trafficLevel = i < 1 ? 'medium' : i < 4 ? 'high' : 'heavy';
    } else if (traffic === 'Очень сильные пробки') {
      trafficLevel = i < 2 ? 'high' : 'heavy';
    }
    
    const segmentCoords = [
      { latitude: lat1, longitude: lng1 },
      { latitude: lat2, longitude: lng2 },
    ];
    
    segments.push({
      coordinates: segmentCoords,
      trafficLevel,
      duration: Math.ceil(parseInt(traffic.includes('Очень') ? '4' : traffic.includes('Сильные') ? '3' : traffic.includes('Средние') ? '2.5' : traffic.includes('Легкие') ? '1.5' : '1')), // Реалистичное время на сегмент
      distance: calculateDistance(segmentCoords[0], segmentCoords[1]), // Добавляем distance
    });
  }
  
  return segments;
};

type MapScreenNavigationProp = BottomTabNavigationProp<RootTabParamList, 'Map'>;

const MapScreen: React.FC = () => {
  const { isDark } = useTheme();
  const navigation = useNavigation<MapScreenNavigationProp>();
  const [selectedMember, setSelectedMember] = useState(familyMembers[0]);
  const [showMemberList, setShowMemberList] = useState(false);
  const [isTripCollapsed, setIsTripCollapsed] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [realRoutes, setRealRoutes] = useState<{[key: string]: RouteResponse}>({});
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [mapType, setMapType] = useState<'standard' | 'satellite' | 'hybrid'>('standard');
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showMapControls, setShowMapControls] = useState(false);
  
  // Состояния для слежения
  const [isTracking, setIsTracking] = useState(false);
  const [driverLocation, setDriverLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [tripStatus, setTripStatus] = useState<'waiting' | 'pickup' | 'inProgress' | 'completed'>('waiting');

  
  const tripAnim = useRef(new Animated.Value(0)).current; // 0 - открыто, 1 - скрыто
  const mapRef = useRef<MapViewRef>(null);

  // Загрузка реальных маршрутов и геолокации при монтировании компонента
  useEffect(() => {
    loadRealRoutes();
    getCurrentLocation();
    
    // Подписываемся на уведомления
    setUnreadCount(notificationService.getUnreadCount());
    const unsubscribe = notificationService.subscribe(() => {
      setUnreadCount(notificationService.getUnreadCount());
    });

    return unsubscribe;
  }, []);

  // Обновление времени каждую минуту для актуализации поездок
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Обновляем каждую минуту

    return () => clearInterval(interval);
  }, []);

  // Симуляция движения водителя
  const startDriverTracking = () => {
    if (!currentRoute) return;
    
    console.log('[СЛЕЖЕНИЕ] Начинается слежение за водителем');
    setIsTracking(true);
    setTripStatus('pickup');
    
    // Начальная позиция водителя (немного в стороне от точки А)
    const startLat = currentRoute.pointA.latitude + 0.005;
    const startLng = currentRoute.pointA.longitude + 0.005;
    
    console.log(`[СЛЕЖЕНИЕ] Водитель стартует с позиции: ${startLat}, ${startLng}`);
    setDriverLocation({ latitude: startLat, longitude: startLng });
    
    // Симуляция движения к клиенту
    simulateDriverMovement();
  };

  const simulateDriverMovement = () => {
    if (!currentRoute) return;
    
    console.log('[СЛЕЖЕНИЕ] Водитель начал движение к клиенту');
    let progress = 0;
    const totalSteps = 12; // 1 минута симуляции (12 * 3 секунды)
    
    const interval = setInterval(() => {
      progress += 1;
      
      // Интерполяция позиции водителя к клиенту
      const startLat = currentRoute.pointA.latitude + 0.005; // Водитель стартует рядом с точкой А
      const startLng = currentRoute.pointA.longitude + 0.005;
      const targetLat = userLocation?.latitude || currentRoute.pointA.latitude;
      const targetLng = userLocation?.longitude || currentRoute.pointA.longitude;
      
      const newLat = startLat + (targetLat - startLat) * (progress / totalSteps);
      const newLng = startLng + (targetLng - startLng) * (progress / totalSteps);
      
      console.log(`[СЛЕЖЕНИЕ] Шаг ${progress}/${totalSteps}, позиция: ${newLat.toFixed(6)}, ${newLng.toFixed(6)}`);
      setDriverLocation({ latitude: newLat, longitude: newLng });
      
      // Статусы и завершение
      if (progress === totalSteps) {
        console.log('[СЛЕЖЕНИЕ] Водитель прибыл к клиенту, начинается поездка');
        setTripStatus('inProgress');
        clearInterval(interval);
        
        // Сразу начинаем поездку
        setTimeout(() => {
          startTrip();
        }, 1000);
      }
    }, 3000); // Обновление каждые 3 секунды для более плавного движения
  };

  const startTrip = () => {
    if (!currentRoute) return;
    
    setTripStatus('inProgress');
    let progress = 0;
    const totalSteps = 20; // 1 минута поездки (20 * 3 секунды)
    
    const interval = setInterval(() => {
      progress += 1;
      
      // Движение от клиента к точке Б
      const startLat = userLocation?.latitude || currentRoute.pointA.latitude;
      const startLng = userLocation?.longitude || currentRoute.pointA.longitude;
      const targetLat = currentRoute.pointB.latitude;
      const targetLng = currentRoute.pointB.longitude;
      
      const newLat = startLat + (targetLat - startLat) * (progress / totalSteps);
      const newLng = startLng + (targetLng - startLng) * (progress / totalSteps);
      
      setDriverLocation({ latitude: newLat, longitude: newLng });
      
      if (progress === totalSteps) {
        setTripStatus('completed');
        setIsTracking(false);
        clearInterval(interval);
        
        // Очищаем позицию водителя через 3 секунды
        setTimeout(() => {
          setDriverLocation(null);
        }, 3000);
      }
    }, 3000); // Обновление каждые 3 секунды
  };

  const stopTracking = () => {
    setIsTracking(false);
    setTripStatus('waiting');
    setDriverLocation(null);
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationPermission(false);
        console.log('📍 Разрешение на геолокацию не предоставлено');
        return;
      }

      setLocationPermission(true);
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      const userCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      
      setUserLocation(userCoords);
      
      // Центрируем карту на пользователе
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          ...userCoords,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
      
      console.log('📍 Геолокация получена:', userCoords);
    } catch (error) {
      console.log('📍 Геолокация недоступна, используется центр Баку');
      setLocationPermission(false);
      // Устанавливаем центр Баку как fallback
      const fallbackLocation = {
        latitude: 40.4093,
        longitude: 49.8671,
      };
      setUserLocation(fallbackLocation);
    }
  };

  const loadRealRoutes = async () => {
    setLoadingRoutes(true);
    try {
      const routes: {[key: string]: RouteResponse} = {};
      
      // Загружаем маршруты для каждого члена семьи
      for (const memberId of Object.keys(memberSchedules)) {
        try {
          const routeData = getCurrentRoute(memberId);
          if (!routeData) continue;
          
          console.log(`📍 Построение маршрута для ${memberId}...`);
          const realRoute = await RouteService.getFastestRoute(
            routeData.pointA,
            routeData.pointB
          );
          routes[memberId] = realRoute;
          console.log(`✅ Маршрут для ${memberId} готов`);
        } catch (error) {
          // Тихо создаем fallback маршрут без лишних ошибок
          const routeData = getCurrentRoute(memberId);
          if (routeData) {
            console.log(`📍 Создание маршрута для ${memberId}...`);
            routes[memberId] = {
              coordinates: [routeData.pointA, routeData.pointB], // Простая линия
              duration: parseInt(routeData.eta) * 60, // Конвертируем в секунды
              distance: estimateDistance(routeData.pointA, routeData.pointB) * 1000, // В метры
              segments: generateRouteSegments(routeData.pointA, routeData.pointB, routeData.traffic)
            };
          }
        }
      }
      
      setRealRoutes(routes);
      console.log('🗺️ Все маршруты готовы');
    } catch (error) {
      console.log('📍 Используются резервные маршруты');
    } finally {
      setLoadingRoutes(false);
    }
  };

  // Примерная оценка расстояния между точками
  const estimateDistance = (point1: any, point2: any): number => {
    const R = 6371; // Радиус Земли в км
    const dLat = (point2.latitude - point1.latitude) * Math.PI / 180;
    const dLon = (point2.longitude - point1.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.latitude * Math.PI / 180) * Math.cos(point2.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleCallDriver = () => {
    const currentDriver = memberDrivers[selectedMember.id as keyof typeof memberDrivers];
    const phoneNumber = '+994516995513'; // Номер водителя
    
    Alert.alert(
      'Позвонить водителю',
      `${currentDriver.name}\n${phoneNumber}`,
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

  const handleChatDriver = () => {
    console.log('💬 Переход в чат с водителем из карты');
    
    try {
      // Получаем данные текущего водителя
      const driver = currentDriver;
      if (!driver) {
        Alert.alert('Ошибка', 'Водитель не найден');
        return;
      }

      // Переходим в таб Chat с параметрами для открытия конкретного чата
      (navigation as any).navigate('Chat', {
        screen: 'ChatConversation',
        params: {
          driverId: selectedMember.id, // Используем ID члена семьи как ID водителя
          driverName: driver.name,
          driverCar: driver.car,
          driverNumber: driver.number,
          driverRating: driver.rating.toString(),
          driverStatus: 'online', // Предполагаем что водитель онлайн
        }
      });
      
      console.log('✅ Успешная навигация в чат с водителем из карты');
    } catch (error) {
      console.error('❌ Ошибка навигации в чат из карты:', error);
      const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
      Alert.alert('Ошибка', 'Не удалось открыть чат: ' + message);
    }
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



  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  const handleMapTypeChange = () => {
    const types: ('standard' | 'satellite' | 'hybrid')[] = ['standard', 'satellite', 'hybrid'];
    const currentIndex = types.indexOf(mapType);
    const nextIndex = (currentIndex + 1) % types.length;
    setMapType(types[nextIndex]);
  };

  const getMapTypeIcon = () => {
    switch (mapType) {
      case 'standard':
        return 'map-outline';
      case 'satellite':
        return 'globe-outline';
      case 'hybrid':
        return 'layers-outline';
      default:
        return 'map-outline';
    }
  };

  // Получаем актуальную ближайшую поездку (пересчитывается при изменении времени)
  const currentRoute = getCurrentRoute(selectedMember.id);
  const currentDriver = memberDrivers[selectedMember.id as keyof typeof memberDrivers];
  const currentTrip = memberTrips[selectedMember.id as keyof typeof memberTrips];
  
  // Используем реальный маршрут если загружен, иначе mock данные
  const realRoute = realRoutes[selectedMember.id];
  const routePoints = [currentRoute.pointA, currentRoute.pointB];
  const routeSegments = realRoute ? realRoute.segments : generateRouteSegments(currentRoute.pointA, currentRoute.pointB, currentRoute.traffic);
  const routeCoordinates = realRoute ? realRoute.coordinates : []; // Полные координаты реального маршрута
  const totalDuration = realRoute ? Math.round(realRoute.duration / 60) : parseInt(currentRoute.eta);
  const realDistance = realRoute ? (realRoute.distance / 1000).toFixed(1) : null;

  const now = new Date();
  const trips = Object.entries(memberTrips).map(([id, data]) => ({ id, ...data }));
  const upcomingTrips = trips.filter(trip => {
    const diff = (trip.nextTrip.getTime() - now.getTime()) / 1000 / 60;
    return diff <= 60 && diff > 0;
  });
  upcomingTrips.sort((a, b) => a.nextTrip.getTime() - b.nextTrip.getTime());
  const nextTrip = upcomingTrips[0];
  const showTripSection = !!nextTrip;
  const showTripAutoOpen = nextTrip && ((nextTrip.nextTrip.getTime() - now.getTime()) / 1000 / 60 <= 15);
  const tripMember = nextTrip ? familyMembers.find(m => m.id === nextTrip.id) : null;
  const tripDriver = nextTrip ? memberDrivers[nextTrip.id as keyof typeof memberDrivers] : null;
  const tripRoute = nextTrip ? getCurrentRoute(selectedMember.id) : null;

  const toggleTripSection = () => {
    const newCollapsed = !isTripCollapsed;
    setIsTripCollapsed(newCollapsed);
    
    // Автоматически закрываем список выбора члена семьи при сворачивании секции
    if (newCollapsed) {
      setShowMemberList(false);
    }
    
    Animated.timing(tripAnim, {
      toValue: newCollapsed ? 1 : 0,
      duration: 350,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  // Проверяем, нужно ли показывать кнопку слежения (за 15 минут до поездки)
  const shouldShowTrackingButton = () => {
    if (!currentRoute) return false;
    
    // МОК: Делаем вид что сейчас за 10 минут до поездки
    const now = new Date();
    const [hours, minutes] = currentRoute.departureTime.split(':').map(Number);
    const departureTime = new Date();
    departureTime.setHours(hours, minutes, 0, 0);
    
    // Если время уже прошло, считаем что это завтрашний день
    if (departureTime < now) {
      departureTime.setDate(departureTime.getDate() + 1);
    }
    
    // МОК: Искусственно ставим текущее время за 10 минут до поездки
    const mockNow = new Date(departureTime.getTime() - 10 * 60 * 1000); // за 10 минут
    const timeDiff = departureTime.getTime() - mockNow.getTime();
    const minutesUntilDeparture = Math.floor(timeDiff / (1000 * 60));
    
    console.log(`[МОК] До поездки ${currentRoute.departureTime} осталось: ${minutesUntilDeparture} минут`);
    
    // Показываем кнопку за 15 минут до поездки
    return minutesUntilDeparture <= 15 && minutesUntilDeparture >= 0;
  };

  const tripTranslateY = tripAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  return (
    <>
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111827' : '#F8FAFC' }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <View style={{ flex: 1 }}>
        {/* Карта */}
        <MapViewComponent
          ref={mapRef}
          style={{ flex: 1, borderRadius: 0 }}
          routePoints={routePoints}
          routeSegments={routeSegments}
          routeCoordinates={routeCoordinates}
          totalDuration={totalDuration}
          showUserLocation={true}
          showDrivers={false}
          mapType={mapType}
          driverLocation={isTracking ? driverLocation : null}
        />

        {/* Кнопка уведомлений */}
        <TouchableOpacity 
          style={styles.notificationButtonFixed} 
          onPress={handleNotifications}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={24} color="#1E3A8A" />
          {unreadCount > 0 && (
            <View style={styles.notificationBadgeFixed}>
              <Text style={styles.notificationBadgeTextFixed}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

      </View>



      {/* Главная кнопка управления картой */}
      <View style={styles.mapControlsContainer} pointerEvents="box-none">
        <TouchableOpacity 
          style={[styles.mapControlButton, styles.mainControlButton]} 
          onPress={() => setShowMapControls(!showMapControls)}
        >
          <Ionicons 
            name={showMapControls ? "close" : "settings"} 
            size={24} 
            color="#1E3A8A" 
          />
        </TouchableOpacity>
        
        {/* Группа скрытых кнопок управления */}
        {showMapControls && (
          <>
            {/* Кнопка слежения - активируется за 15 минут до поездки */}
            {currentRoute && shouldShowTrackingButton() && (
              <TouchableOpacity 
                style={[styles.mapControlButton, { backgroundColor: isTracking ? '#EF4444' : '#10B981' }]} 
                onPress={isTracking ? stopTracking : startDriverTracking}
              >
                <Ionicons 
                  name={isTracking ? "stop" : "navigate"} 
                  size={24} 
                  color="#FFFFFF" 
                />
              </TouchableOpacity>
            )}
            
            {/* Кнопка приближения */}
            <TouchableOpacity style={styles.mapControlButton} onPress={handleZoomIn}>
              <Ionicons name="add" size={24} color="#1E3A8A" />
            </TouchableOpacity>
            
            {/* Кнопка удаления */}
            <TouchableOpacity style={styles.mapControlButton} onPress={handleZoomOut}>
              <Ionicons name="remove" size={24} color="#1E3A8A" />
            </TouchableOpacity>
            
            {/* Кнопка геолокации */}
            <TouchableOpacity style={styles.mapControlButton} onPress={() => mapRef.current?.scrollToUserLocation()}>
              <Ionicons name="locate" size={24} color="#1E3A8A" />
            </TouchableOpacity>
            
            {/* Кнопка слоев карты */}
            <TouchableOpacity style={styles.mapControlButton} onPress={handleMapTypeChange}>
              <Ionicons name={getMapTypeIcon() as any} size={24} color="#1E3A8A" />
            </TouchableOpacity>
          </>
        )}
      </View>



      {/* Секция предстоящей поездки */}
      {showTripSection && (
        <Animated.View style={{
          transform: [{ translateY: tripTranslateY }],
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 32,
          zIndex: 30,
        }}>
          <AppCard style={showTripAutoOpen ? { ...styles.tripCard, ...styles.tripCardActive } : styles.tripCard} margin={16}>
            <TouchableOpacity style={styles.tripHeader} onPress={toggleTripSection} activeOpacity={0.8}>
              <TouchableOpacity 
                style={styles.memberSelector}
                onPress={() => setShowMemberList(!showMemberList)}
                activeOpacity={0.7}
              >
                <Ionicons name={selectedMember.icon as any} size={20} color="#1E3A8A" />
              </TouchableOpacity>
              <View style={styles.tripTitleContainer}>
                <Text style={styles.tripTitle}>{selectedMember.name}</Text>
              </View>
              <Ionicons name={isTripCollapsed ? 'chevron-up' : 'chevron-down'} size={24} color="#1E3A8A" />
            </TouchableOpacity>
            
            {/* Выпадающий список членов семьи в нижней секции */}
            {showMemberList && (
              <View style={styles.memberDropdownBottom}>
                {familyMembers.map((member) => (
                                      <TouchableOpacity
                      key={member.id}
                      style={[
                        styles.memberDropdownItem,
                        selectedMember.id === member.id && styles.selectedMemberItem
                      ]}
                      onPress={() => {
                        setSelectedMember(member);
                        setShowMemberList(false);
                      }}
                    >
                      <Ionicons name={member.icon as any} size={18} color={selectedMember.id === member.id ? "#1E3A8A" : "#6B7280"} style={{ marginRight: 8 }} />
                      <Text style={[
                        styles.memberDropdownText,
                        selectedMember.id === member.id && styles.selectedMemberText
                      ]}>{member.name}</Text>
                    </TouchableOpacity>
                ))}
              </View>
            )}
            {!isTripCollapsed && (
              <>
                {/* Информация о маршруте */}
                <View style={styles.routeInfoSection}>
                  {currentRoute ? (
                    <>
                      <View style={styles.routePointWithTime}>
                        <View style={styles.routePointLeft}>
                          <Ionicons name="location" size={16} color="#1E3A8A" />
                          <Text style={styles.routePointText}>{currentRoute.addressA}</Text>
                        </View>
                        <Text style={[styles.routeTimeText, { color: '#1E3A8A' }]}>{currentRoute.departureTime}</Text>
                      </View>
                      <View style={styles.routePointWithTime}>
                        <View style={styles.routePointLeft}>
                          <Ionicons name="location" size={16} color="#22C55E" />
                          <Text style={styles.routePointText}>{currentRoute.addressB}</Text>
                        </View>
                        <Text style={[styles.routeTimeText, { color: '#22C55E' }]}>{currentRoute.arrivalTime}</Text>
                      </View>
                      <View style={styles.routeMetaInfo}>
                        <Text style={styles.routeMetaText}>
                          {currentRoute.eta} • {currentRoute.traffic}
                          {realDistance && ` • ${realDistance} км`}
                        </Text>
                      </View>
                    </>
                  ) : (
                    <View style={styles.noTripsContainer}>
                      <Ionicons name="calendar-outline" size={24} color="#6B7280" />
                      <Text style={[styles.noTripsText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                        Сегодня нет запланированных поездок
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.driverInfo}>
                  <View style={styles.driverAvatar}>
                    <Text style={{ fontSize: 20 }}>👨‍💼</Text>
                  </View>
                  <View style={styles.driverDetails}>
                    <Text style={styles.driverName}>{currentDriver.name}</Text>
                    <Text style={styles.carInfo}>{currentDriver.car} • {currentDriver.number}</Text>
                  </View>
                  <View style={styles.rating}>
                    <Text style={styles.ratingText}>{currentDriver.rating}</Text>
                  </View>

                </View>
                <View style={styles.tripActions}>
                  <TouchableOpacity style={styles.callButton} onPress={handleCallDriver}>
                    <Ionicons name="call" size={20} color="#FFFFFF" />
                    <Text style={styles.callButtonText}>Позвонить</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.chatButton} onPress={handleChatDriver}>
                    <Ionicons name="chatbubble" size={20} color="#1E3A8A" />
                    <Text style={styles.chatButtonText}>Чат</Text>
                  </TouchableOpacity>
                </View>
                
              </>
            )}
          </AppCard>
        </Animated.View>
      )}

      {/* Кнопка предстоящей поездки слева снизу */}
      {showTripSection && (
        <View style={styles.tripToggleContainer} pointerEvents="box-none">
          <TouchableOpacity style={styles.tripToggleButton} onPress={toggleTripSection} activeOpacity={0.8}>
            <Ionicons name={isTripCollapsed ? "chevron-up" : "chevron-down"} size={24} color="#1E3A8A" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>

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
          <View style={styles.headerActions}>
            {!isSelectionMode ? (
              <>
                <TouchableOpacity onPress={toggleSelectionMode} style={styles.selectButton}>
                  <Text style={[styles.selectButtonText, { color: isDark ? '#FFFFFF' : '#1E3A8A' }]}>
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

    </>
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
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  notificationBtn: {
    padding: 8,
  },
  mapContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  map: {
    flex: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    padding: 20,
  },
  routeContainer: {
    width: '100%',
    marginTop: 20,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  point: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pointText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  pointLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: '#1E3A8A',
    marginLeft: 15,
    marginVertical: 4,
  },
  routeInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  eta: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  trafficInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripCard: {
    marginBottom: 20,
  },
  tripInfo: {
    paddingVertical: 8,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },

  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  carInfo: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  ratingStar: {
    fontSize: 16,
    color: '#F59E0B',
    marginLeft: 4,
  },
  tripActions: {
    flexDirection: 'row',
    gap: 12,
  },
  callButton: {
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
  chatButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingVertical: 12,
    marginLeft: 8,
  },
  chatButtonText: {
    color: '#1E3A8A',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 16,
    zIndex: 10,
    pointerEvents: 'box-none',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  addressText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E3A8A',
  },
  addressBText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  memberAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  memberNameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  memberFilterContainer: {
    position: 'relative',
  },
  memberFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  memberDropdown: {
    position: 'absolute',
    top: 44,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 120,
    zIndex: 20,
  },
  memberDropdownLeft: {
    position: 'absolute',
    top: 60,
    left: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 140,
    zIndex: 20,
  },
  memberDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  memberDropdownText: {
    fontSize: 15,
    color: '#1E3A8A',
  },
  memberDropdownBottom: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedMemberItem: {
    backgroundColor: '#F0F7FF',
  },
  selectedMemberText: {
    color: '#1E3A8A',
    fontWeight: '600',
  },
  tripTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberSelector: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    marginRight: 12,
  },
  routeInfoSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  routePointInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routePointText: {
    fontSize: 14,
    color: '#1F2937',
    marginLeft: 8,
    flex: 1,
  },
  routeMetaInfo: {
    marginTop: 4,
  },
  routeMetaText: {
    fontSize: 13,
    color: '#6B7280',
  },

  routeInfoOverlay: {
    position: 'absolute',
    top: 70,
    left: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    zIndex: 10,
  },
  etaText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E3A8A',
    marginRight: 12,
  },
  trafficRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trafficText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  myLocationButtonContainer: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    zIndex: 20,
    pointerEvents: 'box-none',
  },
  myLocationButtonContainerLower: {
    position: 'absolute',
    bottom: 140,
    right: 24,
    zIndex: 20,
    pointerEvents: 'box-none',
  },
  myLocationButton: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationButtonFixed: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#fff',
    borderRadius: 24,
    width: 48,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  notificationBadgeFixed: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  notificationBadgeTextFixed: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  mapControlsContainer: {
    position: 'absolute',
    bottom: 52,
    right: 24,
    zIndex: 20,
    pointerEvents: 'box-none',
    flexDirection: 'column',
    gap: 8,
  },
  mapControlButton: {
    backgroundColor: '#fff',
    borderRadius: 24,
    width: 48,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainControlButton: {
    // Выравниваем по высоте с кнопкой слева (tripToggleButton)
    alignSelf: 'flex-end',
  },
  tripCardActive: {
    borderColor: '#1E3A8A',
    borderWidth: 2,
  },
  tripMeta: {
    marginTop: 8,
    marginBottom: 8,
  },
  tripMetaText: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  tripToggleContainer: {
    position: 'absolute',
    bottom: 52,
    left: 24,
    zIndex: 20,
    pointerEvents: 'box-none',
  },
  tripToggleButton: {
    backgroundColor: '#fff',
    borderRadius: 24,
    width: 48,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripHandle: {
    position: 'absolute',
    left: '50%',
    bottom: 36,
    transform: [{ translateX: -22 }],
    zIndex: 40,
    backgroundColor: '#fff',
    borderRadius: 22,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  realRouteInfo: {
    position: 'absolute',
    top: 70,
    left: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    zIndex: 10,
  },
  routeTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeTimeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E3A8A',
    marginLeft: 6,
  },
  routeDistanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeDistanceText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E3A8A',
    marginLeft: 6,
  },
  trafficStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trafficStatusText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E3A8A',
    marginLeft: 6,
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
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  markAllButton: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  markAllButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  notificationsList: {
    flex: 1,
  },
  notificationItem: {
    padding: 12,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    borderRadius: 8,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#1E3A8A',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  unreadTitle: {
    fontWeight: '700',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6B7280',
  },
  notificationTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  deleteButton: {
    padding: 4,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  selectedNotification: {
    borderColor: '#1E3A8A',
    borderWidth: 2,
  },
  checkbox: {
    marginRight: 12,
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
  
  // Новые стили для маршрута с временем
  routePointWithTime: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  routePointLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  // Стили для случая когда нет поездок
  noTripsContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noTripsText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  
  // Стили для слежения водителя
  driverMarker: {
    zIndex: 1000,
  },
  driverIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E3A8A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  trackButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 12,
    marginLeft: 8,
  },
  trackButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  stopButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 12,
  },
  stopButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  

  
  // Стиль для кнопки слежения сверху справа
  trackingButtonFixed: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
});

export default MapScreen;
