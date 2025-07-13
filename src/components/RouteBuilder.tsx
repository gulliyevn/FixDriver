import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, TextInput } from 'react-native';
import { RoutePoint } from '../types/package';
import { useTheme } from '../context/ThemeContext';
import Button from './Button';
import { RouteBuilderStyles } from '../styles/components/RouteBuilder.styles';

interface RouteBuilderProps {
  route: RoutePoint[];
  onRouteChange: (route: RoutePoint[]) => void;
  onRouteCalculated?: (distance: number, duration: number, price: number) => void;
}

const RouteBuilder: React.FC<RouteBuilderProps> = ({
  route,
  onRouteChange,
  onRouteCalculated,
}) => {
  const { isDark } = useTheme();
  const [isCalculating, setIsCalculating] = useState(false);

  // Добавить новую точку маршрута
  const addRoutePoint = () => {
    const newPoint: RoutePoint = {
      id: Date.now().toString(),
      address: '',
      latitude: 0,
      longitude: 0,
      order: route.length,
      description: getPointDescription(route.length),
    };

    onRouteChange([...route, newPoint]);
  };

  // Удалить точку маршрута
  const removeRoutePoint = (pointId: string) => {
    if (route.length <= 2) {
      Alert.alert('Ошибка', 'Маршрут должен содержать минимум 2 точки');
      return;
    }

    const updatedRoute = route
      .filter(point => point.id !== pointId)
      .map((point, index) => ({
        ...point,
        order: index,
        description: getPointDescription(index),
      }));

    onRouteChange(updatedRoute);
  };

  // Изменить адрес точки
  const updatePointAddress = (pointId: string, address: string) => {
    const updatedRoute = route.map(point =>
      point.id === pointId ? { ...point, address } : point
    );
    onRouteChange(updatedRoute);
  };

  // Переместить точку вверх/вниз
  const movePoint = (pointId: string, direction: 'up' | 'down') => {
    const currentIndex = route.findIndex(point => point.id === pointId);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= route.length) return;

    const updatedRoute = [...route];
    [updatedRoute[currentIndex], updatedRoute[newIndex]] = 
    [updatedRoute[newIndex], updatedRoute[currentIndex]];

    // Обновляем порядок и описания
    const reorderedRoute = updatedRoute.map((point, index) => ({
      ...point,
      order: index,
      description: getPointDescription(index),
    }));

    onRouteChange(reorderedRoute);
  };

  // Получить описание точки по индексу
  const getPointDescription = (index: number): string => {
    if (index === 0) return 'Точка отправления';
    if (route.length > 2 && index === route.length - 1) return 'Точка назначения';
    if (route.length === 2 && index === 1) return 'Точка назначения';
    return `Промежуточная точка ${index}`;
  };

  // Получить иконку точки
  const getPointIcon = (index: number): string => {
    if (index === 0) return '🟢'; // Зеленый для старта
    if (route.length > 2 && index === route.length - 1) return '🔴'; // Красный для финиша
    if (route.length === 2 && index === 1) return '🔴';
    return '🟡'; // Желтый для промежуточных
  };

  // Рассчитать маршрут
  const calculateRoute = async () => {
    const filledPoints = route.filter(point => point.address.trim());
    
    if (filledPoints.length < 2) {
      Alert.alert('Ошибка', 'Укажите минимум 2 адреса для расчета маршрута');
      return;
    }

    setIsCalculating(true);
    
    try {
      // Mock расчет маршрута
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const distance = filledPoints.length * 3.5; // примерно 3.5 км на точку
      const duration = filledPoints.length * 8; // примерно 8 минут на точку
      const basePrice = 15 + distance * 1.8; // базовый тариф + за км

      onRouteCalculated?.(
        Math.round(distance * 10) / 10,
        Math.round(duration),
        Math.round(basePrice)
      );
    } catch {
      Alert.alert('Ошибка', 'Не удалось рассчитать маршрут');
    } finally {
      setIsCalculating(false);
    }
  };

  // Инициализация с двумя точками, если маршрут пустой
  useEffect(() => {
    if (route.length === 0) {
      const initialRoute: RoutePoint[] = [
        {
          id: '1',
          address: '',
          latitude: 0,
          longitude: 0,
          order: 0,
          description: 'Точка отправления',
        },
        {
          id: '2',
          address: '',
          latitude: 0,
          longitude: 0,
          order: 1,
          description: 'Точка назначения',
        },
      ];
      onRouteChange(initialRoute);
    }
  }, [route.length, onRouteChange]);

  return (
    <View style={RouteBuilderStyles.container}>
      <Text style={[
        RouteBuilderStyles.title,
        isDark ? RouteBuilderStyles.titleDark : RouteBuilderStyles.titleLight
      ]}>
        Построение маршрута
      </Text>

      <ScrollView style={RouteBuilderStyles.pointsList} showsVerticalScrollIndicator={false}>
        {route.map((point, index) => (
          <View key={point.id} style={RouteBuilderStyles.pointContainer}>
            <View style={RouteBuilderStyles.pointHeader}>
              <Text style={RouteBuilderStyles.pointIcon}>{getPointIcon(index)}</Text>
              <Text style={[
                RouteBuilderStyles.pointDescription,
                isDark ? RouteBuilderStyles.pointDescriptionDark : RouteBuilderStyles.pointDescriptionLight
              ]}>
                {point.description}
              </Text>
              
              {/* Кнопки управления точками */}
              <View style={RouteBuilderStyles.pointControls}>
                {index > 0 && (
                  <TouchableOpacity
                    onPress={() => movePoint(point.id, 'up')}
                    style={RouteBuilderStyles.controlButton}
                  >
                    <Text style={RouteBuilderStyles.controlText}>↑</Text>
                  </TouchableOpacity>
                )}
                
                {index < route.length - 1 && (
                  <TouchableOpacity
                    onPress={() => movePoint(point.id, 'down')}
                    style={RouteBuilderStyles.controlButton}
                  >
                    <Text style={RouteBuilderStyles.controlText}>↓</Text>
                  </TouchableOpacity>
                )}
                
                {route.length > 2 && (
                  <TouchableOpacity
                    onPress={() => removeRoutePoint(point.id)}
                    style={[RouteBuilderStyles.controlButton, RouteBuilderStyles.deleteButton]}
                  >
                    <Text style={[RouteBuilderStyles.controlText, RouteBuilderStyles.deleteText]}>×</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <TextInput
              placeholder="Введите адрес или выберите на карте"
              value={point.address}
              onChangeText={(text) => updatePointAddress(point.id, text)}
              style={[
                RouteBuilderStyles.addressInput,
                isDark ? RouteBuilderStyles.addressInputDark : RouteBuilderStyles.addressInputLight
              ]}
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            />

            {/* Линия связи между точками */}
            {index < route.length - 1 && (
              <View style={RouteBuilderStyles.connectionLine}>
                <Text style={RouteBuilderStyles.arrowDown}>↓</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Кнопки действий */}
      <View style={RouteBuilderStyles.actions}>
        <Button
          title="+ Добавить адрес"
          onPress={addRoutePoint}
          variant="outline"
          style={RouteBuilderStyles.addButton}
          size="small"
        />

        <Button
          title={isCalculating ? "Расчет..." : "Рассчитать маршрут"}
          onPress={calculateRoute}
          variant="primary"
          loading={isCalculating}
          disabled={route.filter(p => p.address.trim()).length < 2}
          style={RouteBuilderStyles.calculateButton}
        />
      </View>

      {/* Инфо о маршруте */}
      <View style={[
        RouteBuilderStyles.routeInfo,
        isDark ? RouteBuilderStyles.routeInfoDark : RouteBuilderStyles.routeInfoLight
      ]}>
        <Text style={[
          RouteBuilderStyles.routeInfoText,
          isDark ? RouteBuilderStyles.routeInfoTextDark : RouteBuilderStyles.routeInfoTextLight
        ]}>
          💡 Вы можете добавить несколько адресов для создания сложного маршрута
        </Text>
        <Text style={[
          RouteBuilderStyles.routeInfoText,
          isDark ? RouteBuilderStyles.routeInfoTextDark : RouteBuilderStyles.routeInfoTextLight
        ]}>
          📍 Перетаскивайте точки для изменения порядка
        </Text>
      </View>
    </View>
  );
};

export default RouteBuilder; 