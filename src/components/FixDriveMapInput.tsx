import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { getCurrentColors } from '../constants/colors';
import MapViewComponent from './MapView';
import { MapLocation, RoutePoint } from './MapView/types/map.types';

interface AddressPoint {
  id: string;
  type: 'from' | 'to' | 'stop';
  address: string;
  coordinate?: MapLocation;
  placeholder: string;
}

interface FixDriveMapInputProps {
  onAddressesChange: (addresses: AddressPoint[]) => void;
}

const FixDriveMapInput: React.FC<FixDriveMapInputProps> = ({
  onAddressesChange,
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const colors = getCurrentColors(isDark);
  const mapRef = useRef<any>(null);

  const [addresses, setAddresses] = useState<AddressPoint[]>([
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
  ]);

  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
  const [isMapMode, setIsMapMode] = useState(true);
  const [showAddressList, setShowAddressList] = useState(false);
  const [activeAddressId, setActiveAddressId] = useState<string | null>(null);

  // Преобразуем адреса в точки маршрута для карты
  const mapRoutePoints = addresses
    .filter(addr => addr.coordinate)
    .map((addr, index) => ({
      id: addr.id,
      coordinate: addr.coordinate!,
      type: addr.type === 'from' ? 'start' as const : 
            addr.type === 'to' ? 'end' as const : 'waypoint' as const,
    }));

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
        ? { ...addr, coordinate: location, address: `Выбрано на карте (${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)})` }
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
    const updatedAddresses = addresses.filter(addr => addr.id !== id);
    setAddresses(updatedAddresses);
    onAddressesChange(updatedAddresses);
  };

  const clearAllPoints = () => {
    const clearedAddresses = addresses.map(addr => ({
      ...addr,
      address: '',
      coordinate: undefined
    }));
    setAddresses(clearedAddresses);
    onAddressesChange(clearedAddresses);
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
              borderColor: status === 'selected' ? colors.success : colors.border
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
                  <View style={{ position: 'relative' }}>
                    <TextInput
                      style={{ 
                        fontSize: 12, 
                        color: colors.text,
                        paddingVertical: 4,
                        paddingHorizontal: 0,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border
                      }}
                      placeholder={address.placeholder}
                      value={address.address}
                      onChangeText={(text) => handleAddressChange(address.id, text)}
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>
                )}
              </View>

              {/* Кнопки действий */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                {/* Кнопка удаления - показывается только когда есть данные */}
                {address.address && (
                  <TouchableOpacity 
                    style={{ padding: 8, marginRight: 4 }}
                    onPress={() => {
                      const updatedAddresses = addresses.map(addr => 
                        addr.id === address.id 
                          ? { ...addr, address: '', coordinate: undefined }
                          : addr
                      );
                      setAddresses(updatedAddresses);
                      onAddressesChange(updatedAddresses);
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
                        console.log('Выбрать текущую локацию для:', address.type);
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
                        console.log('Показать недавние поездки для:', address.type);
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
                        console.log('Выбрать домашний адрес для:', address.type);
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
                        console.log('Выбрать рабочий адрес для:', address.type);
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
