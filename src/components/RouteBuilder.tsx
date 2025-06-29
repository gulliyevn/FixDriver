import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { RoutePoint } from '../types/package';
import { useTheme } from '../context/ThemeContext';
import InputField from './InputField';
import Button from './Button';

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
    } catch (error) {
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
  }, []);

  return (
    <View style={styles.container}>
      <Text style={[
        styles.title,
        { color: isDark ? '#FFFFFF' : '#1F2937' }
      ]}>
        Построение маршрута
      </Text>

      <ScrollView style={styles.pointsList} showsVerticalScrollIndicator={false}>
        {route.map((point, index) => (
          <View key={point.id} style={styles.pointContainer}>
            <View style={styles.pointHeader}>
              <Text style={styles.pointIcon}>{getPointIcon(index)}</Text>
              <Text style={[
                styles.pointDescription,
                { color: isDark ? '#9CA3AF' : '#6B7280' }
              ]}>
                {point.description}
              </Text>
              
              {/* Кнопки управления точками */}
              <View style={styles.pointControls}>
                {index > 0 && (
                  <TouchableOpacity
                    onPress={() => movePoint(point.id, 'up')}
                    style={styles.controlButton}
                  >
                    <Text style={styles.controlText}>↑</Text>
                  </TouchableOpacity>
                )}
                
                {index < route.length - 1 && (
                  <TouchableOpacity
                    onPress={() => movePoint(point.id, 'down')}
                    style={styles.controlButton}
                  >
                    <Text style={styles.controlText}>↓</Text>
                  </TouchableOpacity>
                )}
                
                {route.length > 2 && (
                  <TouchableOpacity
                    onPress={() => removeRoutePoint(point.id)}
                    style={[styles.controlButton, styles.deleteButton]}
                  >
                    <Text style={[styles.controlText, styles.deleteText]}>×</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <InputField
              placeholder="Введите адрес или выберите на карте"
              value={point.address}
              onChangeText={(text) => updatePointAddress(point.id, text)}
              leftIcon="location"
              style={styles.addressInput}
            />

            {/* Линия связи между точками */}
            {index < route.length - 1 && (
              <View style={styles.connectionLine}>
                <Text style={styles.arrowDown}>↓</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Кнопки действий */}
      <View style={styles.actions}>
        <Button
          title="+ Добавить адрес"
          onPress={addRoutePoint}
          variant="outline"
          style={styles.addButton}
          size="small"
        />

        <Button
          title={isCalculating ? "Расчет..." : "Рассчитать маршрут"}
          onPress={calculateRoute}
          variant="primary"
          loading={isCalculating}
          disabled={route.filter(p => p.address.trim()).length < 2}
          style={styles.calculateButton}
        />
      </View>

      {/* Инфо о маршруте */}
      <View style={[
        styles.routeInfo,
        { backgroundColor: isDark ? '#374151' : '#F3F4F6' }
      ]}>
        <Text style={[
          styles.routeInfoText,
          { color: isDark ? '#9CA3AF' : '#6B7280' }
        ]}>
          💡 Вы можете добавить несколько адресов для создания сложного маршрута
        </Text>
        <Text style={[
          styles.routeInfoText,
          { color: isDark ? '#9CA3AF' : '#6B7280' }
        ]}>
          📍 Перетаскивайте точки для изменения порядка
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  pointsList: {
    flex: 1,
    maxHeight: 400,
  },
  pointContainer: {
    marginBottom: 16,
  },
  pointHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pointIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  pointDescription: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  pointControls: {
    flexDirection: 'row',
    gap: 4,
  },
  controlButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
  },
  deleteText: {
    color: '#DC2626',
    fontSize: 14,
  },
  addressInput: {
    marginBottom: 8,
  },
  connectionLine: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  arrowDown: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 16,
  },
  addButton: {
    flex: 1,
  },
  calculateButton: {
    flex: 2,
  },
  routeInfo: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  routeInfoText: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 4,
  },
});

export default RouteBuilder; 