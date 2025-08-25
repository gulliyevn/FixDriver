import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { getCurrentColors } from '../constants/colors';
import MapViewComponent from './MapView';
import AddressAutocomplete from './AddressAutocomplete';
import { MapLocation, RoutePoint } from './MapView/types/map.types';

interface AddressPoint {
  id: string;
  type: 'from' | 'to' | 'stop';
  address: string;
  coordinate?: MapLocation;
  coordinates?: MapLocation; // Для совместимости с данными сессии
  placeholder: string;
}

interface FixDriveMapInputProps {
  onAddressesChange: (addresses: AddressPoint[]) => void;
  initialAddresses?: AddressPoint[];
}

const FixDriveMapInput: React.FC<FixDriveMapInputProps> = ({
  onAddressesChange,
  initialAddresses,
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const colors = getCurrentColors(isDark);
  const mapRef = useRef<any>(null);

  const [addresses, setAddresses] = useState<AddressPoint[]>(() => {
    // Если есть восстановленные адреса, используем их
    if (initialAddresses && initialAddresses.length > 0) {
      return initialAddresses.map(addr => ({
        ...addr,
        // Маппинг координат из сессии в компонент
        coordinate: addr.coordinates || addr.coordinate,
        placeholder: addr.type === 'from' ? t('common.fixDrive.address.fromPlaceholder') :
                   addr.type === 'to' ? t('common.fixDrive.address.toPlaceholder') :
                   t('common.fixDrive.address.stopPlaceholder')
      }));
    }
    
    // Иначе используем пустые адреса
    return [
      {
        id: 'from',
        type: 'from',
        address: '',
        placeholder: t('common.fixDrive.address.fromPlaceholder')
      },
      {
        id: 'to',
        type: 'to',
        address: '',
        placeholder: t('common.fixDrive.address.toPlaceholder')
      }
    ];
  });

  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
  const [isMapMode, setIsMapMode] = useState(true);
  const [showAddressList, setShowAddressList] = useState(false);
  const [activeAddressId, setActiveAddressId] = useState<string | null>(null);
  const [addressValidation, setAddressValidation] = useState<{ [key: string]: boolean }>({});

  // Обновляем адреса при изменении initialAddresses
  useEffect(() => {
    if (initialAddresses && initialAddresses.length > 0) {
      const updatedAddresses = initialAddresses.map(addr => ({
        ...addr,
        // Маппинг координат из сессии в компонент
        coordinate: addr.coordinates || addr.coordinate,
        placeholder: addr.type === 'from' ? t('common.fixDrive.address.fromPlaceholder') :
                   addr.type === 'to' ? t('common.fixDrive.address.toPlaceholder') :
                   t('common.fixDrive.address.stopPlaceholder')
      }));
      setAddresses(updatedAddresses);
      console.log('Addresses restored in FixDriveMapInput:', updatedAddresses);
      console.log('Coordinates mapping:', updatedAddresses.map(addr => ({
        id: addr.id,
        type: addr.type,
        coordinate: addr.coordinate,
        coordinates: addr.coordinates
      })));
    }
  }, [initialAddresses, t]);

  // Преобразуем адреса в точки маршрута для карты с жесткой привязкой цветов
  const mapRoutePoints = addresses
    .filter(addr => addr.coordinate)
    .map((addr, index) => {
      // Жесткая привязка цветов к типам адресов
      let color: string;
      switch (addr.type) {
        case 'from':
          color = 'green'; // Зеленая булавка ВСЕГДА для "откуда"
          break;
        case 'to':
          color = 'blue';  // Синяя булавка ВСЕГДА для "куда"
          break;
        case 'stop':
          color = 'gray';  // Серая булавка ВСЕГДА для остановок
          break;
        default:
          color = 'gray';
      }

      return {
        id: addr.id,
        coordinate: addr.coordinate!,
        type: addr.type === 'from' ? 'start' as const : 
              addr.type === 'to' ? 'end' as const : 'waypoint' as const,
        color: color,
      };
    });

  // Логируем обновления mapRoutePoints
  useEffect(() => {
    console.log('Map route points updated:', mapRoutePoints);
  }, [mapRoutePoints]);

  const handleMapPress = useCallback((location: MapLocation) => {
    // Находим первую пустую точку для заполнения
    const emptyPoint = addresses.find(addr => !addr.coordinate);
    if (!emptyPoint) {
      Alert.alert('Ошибка', 'Все точки маршрута уже выбраны');
      return;
    }

    // Обновляем адрес с координатами
    const updatedAddresses = addresses.map(addr => 
      addr.id === emptyPoint.id 
        ? { 
          ...addr, 
          coordinate: location, 
          coordinates: location, // Сохраняем в обоих форматах
          address: `Выбрано на карте (${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)})` 
        }
        : addr
    );
    
    setAddresses(updatedAddresses);
    onAddressesChange(updatedAddresses);
  }, [addresses, onAddressesChange]);

  const addStop = () => {
    const currentStops = addresses.filter(addr => addr.type === 'stop');
    if (currentStops.length >= 2) {
      Alert.alert('Ограничение', 'Максимум 2 остановки');
      return;
    }
    
    const stopId = `stop-${Date.now()}`;
    const newStop: AddressPoint = {
      id: stopId,
      type: 'stop',
      address: '',
      placeholder: t('common.fixDrive.address.stopPlaceholder')
    };
    
    // Вставляем остановку между "Откуда" и "Куда"
    const fromAddress = addresses.find(addr => addr.type === 'from');
    const toAddress = addresses.find(addr => addr.type === 'to');
    
    if (fromAddress && toAddress) {
      const updatedAddresses = [
        fromAddress,
        newStop,
        ...addresses.filter(addr => addr.type === 'stop'),
        toAddress
      ];
      setAddresses(updatedAddresses);
      onAddressesChange(updatedAddresses);
    }
  };

  const removeStop = (id: string) => {
    // Находим адрес для удаления
    const addressToRemove = addresses.find(addr => addr.id === id);
    
    // Удаляем адрес из массива
    const updatedAddresses = addresses.filter(addr => addr.id !== id);
    setAddresses(updatedAddresses);
    onAddressesChange(updatedAddresses);
    
    // Очищаем валидацию для удаленного адреса
    setAddressValidation(prev => {
      const newValidation = { ...prev };
      delete newValidation[id];
      return newValidation;
    });
    
    console.log('Address removed:', id, 'Type:', addressToRemove?.type);
    console.log('Updated addresses:', updatedAddresses);
    console.log('Map route points will be:', updatedAddresses.filter(addr => addr.coordinate));
    
    // Логируем привязку булавок
    const remainingRoutePoints = updatedAddresses.filter(addr => addr.coordinate);
    console.log('Remaining route points:', remainingRoutePoints.map(point => ({
      id: point.id,
      type: point.type,
      coordinate: point.coordinate
    })));
  };

  const clearAllPoints = () => {
    const clearedAddresses = addresses.map(addr => ({
      ...addr,
      address: '',
      coordinate: undefined,
      coordinates: undefined
    }));
    setAddresses(clearedAddresses);
    onAddressesChange(clearedAddresses);
    
    // Очищаем всю валидацию
    setAddressValidation({});
    
    console.log('All points cleared');
    console.log('Cleared addresses:', clearedAddresses);
  };

  const toggleMapMode = () => {
    setIsMapMode(!isMapMode);
  };

  const handleAddressChange = (id: string, text: string) => {
    const updatedAddresses = addresses.map(addr => 
      addr.id === id ? { ...addr, address: text } : addr
    );
    setAddresses(updatedAddresses);
    onAddressesChange(updatedAddresses);
  };

  const handleAddressSelect = (id: string, address: string, coordinates: MapLocation) => {
    const updatedAddresses = addresses.map(addr => 
      addr.id === id ? { 
        ...addr, 
        address, 
        coordinate: coordinates,
        coordinates: coordinates // Сохраняем в обоих форматах для совместимости
      } : addr
    );
    setAddresses(updatedAddresses);
    onAddressesChange(updatedAddresses);
    console.log('Address selected:', id, 'coordinates:', coordinates);
  };

  const handleValidationChange = (id: string, isValid: boolean) => {
    setAddressValidation(prev => ({
      ...prev,
      [id]: isValid
    }));
  };

  const getPointStatus = (address: AddressPoint) => {
    if (address.coordinate) {
      return 'selected';
    }
    if (address.type === 'from') {
      return 'next';
    }
    const fromPoint = addresses.find(addr => addr.type === 'from');
    if (fromPoint?.coordinate && address.type === 'to') {
      return 'next';
    }
    if (fromPoint?.coordinate && address.type === 'stop') {
      return 'next';
    }
    return 'waiting';
  };

  const getPointColor = (type: string) => {
    switch (type) {
      case 'from': return colors.success; // зеленый для "откуда"
      case 'to': return colors.primary; // синий для "куда"
      case 'stop': return colors.textSecondary; // серый для остановок
      default: return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string, type: string) => {
    switch (status) {
      case 'selected': return 'checkmark-circle';
      case 'next': return type === 'from' ? 'location' : type === 'to' ? 'flag' : 'ellipse';
      case 'waiting': return 'ellipse-outline';
      default: return 'ellipse-outline';
    }
  };

  const getBorderColor = (status: string, type: string, addressId: string) => {
    // Для текстового режима проверяем валидацию
    if (!isMapMode) {
      const isValid = addressValidation[addressId];
      if (isValid) {
        switch (type) {
          case 'from': return colors.success; // зеленый для "откуда"
          case 'to': return colors.primary; // синий для "куда"
          case 'stop': return colors.textSecondary; // серый для остановок
          default: return colors.border;
        }
      }
      return colors.border;
    }
    
    // Для режима карты используем старую логику
    if (status !== 'selected') {
      return colors.border;
    }
    
    switch (type) {
      case 'from': return colors.success; // зеленый для "откуда"
      case 'to': return colors.primary; // синий для "куда"
      case 'stop': return colors.textSecondary; // серый для остановок
      default: return colors.border;
    }
  };

  return (
    <View style={{ marginTop: 10 }}>
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: 12 
      }}>
        <Text style={{ 
          fontSize: 16, 
          fontWeight: '500', 
          color: colors.text
        }}>
          {t('common.fixDrive.address.selectFromMap')}
        </Text>
        
        {!isMapMode && (
          <TouchableOpacity 
            style={{ 
              backgroundColor: colors.primary,
              borderRadius: 20,
              padding: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3
            }}
            onPress={toggleMapMode}
          >
            <Ionicons name="map" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Карта */}
      {isMapMode && (
        <View style={{ 
          height: 200, 
          borderRadius: 8, 
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: colors.border,
          marginBottom: 12,
          position: 'relative'
        }}>
          <MapViewComponent
            ref={mapRef}
            initialLocation={{ latitude: 40.3777, longitude: 49.8920 }}
            onLocationSelect={handleMapPress}
            routePoints={mapRoutePoints}
            showTrafficMock={false}
          />
          
          {/* Кнопка переключения режима в правом верхнем углу */}
          <TouchableOpacity 
            style={{ 
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: colors.primary,
              borderRadius: 20,
              padding: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3
            }}
            onPress={toggleMapMode}
          >
            <Ionicons name="text" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}

      {/* Список точек */}
      <View style={{ marginBottom: 12 }}>
        {addresses.map((address, index) => {
          const status = getPointStatus(address);
          const pointColor = getPointColor(address.type);
          const statusIcon = getStatusIcon(status, address.type);
          const borderColor = getBorderColor(status, address.type, address.id);

          return (
            <View key={address.id} style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              paddingVertical: 8,
              paddingHorizontal: 12,
              backgroundColor: colors.surface,
              borderRadius: 8,
              marginBottom: 8,
              borderWidth: 1,
              borderColor: borderColor
            }}>
              <TouchableOpacity 
                style={{ marginRight: 12 }}
                onPress={() => {
                  setActiveAddressId(address.id);
                  setShowAddressList(!showAddressList);
                }}
              >
                <Ionicons 
                  name={showAddressList && activeAddressId === address.id ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
              
              <View style={{ flex: 1 }}>
                <Text style={{ 
                  fontSize: 14, 
                  fontWeight: '500', 
                  color: colors.text 
                }}>
                  {address.type === 'from' ? t('common.fixDrive.address.from') :
                   address.type === 'to' ? t('common.fixDrive.address.to') :
                   t('common.fixDrive.address.stopPlaceholder')}
                </Text>
                
                {isMapMode ? (
                  <Text style={{ 
                    fontSize: 12, 
                    color: address.address ? colors.text : colors.textSecondary 
                  }}>
                    {address.address || address.placeholder}
                  </Text>
                ) : (
                  <AddressAutocomplete
                    placeholder={address.placeholder}
                    value={address.address}
                    onChangeText={(text) => handleAddressChange(address.id, text)}
                    onAddressSelect={(addressText, coordinates) => 
                      handleAddressSelect(address.id, addressText, coordinates)
                    }
                    onValidationChange={(isValid) => 
                      handleValidationChange(address.id, isValid)
                    }
                    type={address.type}
                  />
                )}
              </View>

              {/* Кнопки действий */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                {/* Кнопка очистки адреса - показывается только когда есть данные */}
                {address.address && (
                  <TouchableOpacity 
                    style={{ padding: 8, marginRight: 4 }}
                    onPress={() => {
                      const updatedAddresses = addresses.map(addr => 
                        addr.id === address.id 
                          ? { ...addr, address: '', coordinate: undefined, coordinates: undefined }
                          : addr
                      );
                      setAddresses(updatedAddresses);
                      onAddressesChange(updatedAddresses);
                      
                      // Очищаем валидацию для очищенного адреса
                      setAddressValidation(prev => {
                        const newValidation = { ...prev };
                        delete newValidation[address.id];
                        return newValidation;
                      });
                      
                      console.log('Address cleared:', address.id, 'Type:', address.type);
                    }}
                  >
                    <Ionicons name="close-circle" size={16} color={colors.error} />
                  </TouchableOpacity>
                )}



                {address.type === 'to' && (
                  <TouchableOpacity 
                    style={{ 
                      padding: 8,
                      opacity: addresses.filter(addr => addr.type === 'stop').length >= 2 ? 0.5 : 1
                    }}
                    onPress={addStop}
                    disabled={addresses.filter(addr => addr.type === 'stop').length >= 2}
                  >
                    <Ionicons name="add" size={16} color={colors.primary} />
                  </TouchableOpacity>
                )}
                
                {address.type === 'stop' && (
                  <TouchableOpacity 
                    style={{ padding: 8 }}
                    onPress={() => removeStop(address.id)}
                  >
                    <Ionicons name="close" size={16} color={colors.error} />
                  </TouchableOpacity>
                )}
              </View>

              {/* Выпадающий список для каждого контейнера */}
              {showAddressList && activeAddressId === address.id && (
                <View style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: colors.surface,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.border,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 5,
                  elevation: 10,
                  zIndex: 1000,
                  maxHeight: 200,
                  marginTop: 20
                }}>
                  <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false}>
                    {/* Текущая локация */}
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border
                      }}
                      onPress={() => {
                        setShowAddressList(false);
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="navigate" size={16} color={colors.primary} style={{ marginRight: 8 }} />
                        <Text style={{ fontSize: 16, color: colors.text }}>
                          Текущая локация
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {/* Недавние поездки */}
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border
                      }}
                      onPress={() => {
                        setShowAddressList(false);
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="time" size={16} color={colors.primary} style={{ marginRight: 8 }} />
                        <Text style={{ fontSize: 16, color: colors.text }}>
                          Недавние поездки
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {/* Домашний адрес */}
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border
                      }}
                      onPress={() => {
                        setShowAddressList(false);
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="home" size={16} color={colors.primary} style={{ marginRight: 8 }} />
                        <Text style={{ fontSize: 16, color: colors.text }}>
                          Домашний адрес
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {/* Рабочий адрес */}
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingVertical: 12,
                        paddingHorizontal: 16
                      }}
                      onPress={() => {
                        setShowAddressList(false);
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="business" size={16} color={colors.primary} style={{ marginRight: 8 }} />
                        <Text style={{ fontSize: 16, color: colors.text }}>
                          Рабочий адрес
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              )}
            </View>
          );
        })}
      </View>






    </View>
  );
};

export default FixDriveMapInput;
