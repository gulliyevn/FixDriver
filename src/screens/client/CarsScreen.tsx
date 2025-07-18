import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { ClientScreenProps } from '../../types/navigation';
import { CarsScreenStyles as styles, getCarsScreenStyles } from '../../styles/screens/profile/CarsScreen.styles';
import { mockCars } from '../../mocks/carsMock';

/**
 * Экран управления автомобилями
 * 
 * TODO для интеграции с бэкендом:
 * 1. Заменить useState на useCars hook
 * 2. Подключить CarsService для API вызовов
 * 3. Добавить обработку ошибок и загрузки
 * 4. Реализовать добавление/удаление автомобилей
 * 5. Подключить проверку документов
 * 6. Добавить валидацию данных
 */

const CarsScreen: React.FC<ClientScreenProps<'Cars'>> = ({ navigation }) => {
  const { isDark } = useTheme();
  const dynamicStyles = getCarsScreenStyles(isDark);
  const [cars] = useState(mockCars);

  const handleAddCar = () => {
    Alert.alert(
      'Добавить автомобиль',
      'Выберите способ добавления',
      [
        { text: 'Сканировать документы', onPress: () => {} },
        { text: 'Ввести вручную', onPress: () => {} },
        { text: 'Отмена', style: 'cancel' }
      ]
    );
  };

  const handleDeleteCar = (carId: string) => {
    Alert.alert(
      'Удалить автомобиль',
      'Вы уверены, что хотите удалить этот автомобиль?',
      [
        { text: 'Удалить', style: 'destructive', onPress: () => {} },
        { text: 'Отмена', style: 'cancel' }
      ]
    );
  };

  const getCarStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#4caf50';
      case 'pending':
        return '#ff9800';
      case 'expired':
        return '#e53935';
      default:
        return '#888';
    }
  };

  const getCarStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Активен';
      case 'pending':
        return 'На проверке';
      case 'expired':
        return 'Истек';
      default:
        return 'Неизвестно';
    }
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <View style={[styles.header, dynamicStyles.header]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#003366" />
        </TouchableOpacity>
        <Text style={[styles.title, dynamicStyles.title]}>Мои автомобили</Text>
        <TouchableOpacity onPress={handleAddCar} style={styles.addButton}>
          <Ionicons name="add" size={24} color="#003366" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {cars.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="car-outline" size={64} color="#ccc" />
            <Text style={[styles.emptyTitle, dynamicStyles.emptyTitle]}>Нет добавленных автомобилей</Text>
            <Text style={[styles.emptyDescription, dynamicStyles.emptyDescription]}>
              Добавьте автомобиль для работы водителем
            </Text>
            <TouchableOpacity style={styles.addCarButton} onPress={handleAddCar}>
              <Text style={styles.addCarButtonText}>Добавить автомобиль</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {cars.map((car) => (
              <View key={car.id} style={[styles.carItem, dynamicStyles.carItem]}>
                <View style={styles.carHeader}>
                  <View style={styles.carInfo}>
                    <Ionicons name="car" size={32} color="#003366" />
                    <View style={styles.carDetails}>
                      <Text style={[styles.carModel, dynamicStyles.carModel]}>{car.model}</Text>
                      <Text style={[styles.carPlate, dynamicStyles.carPlate]}>{car.plateNumber}</Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getCarStatusColor(car.status) }]}>
                    <Text style={styles.statusText}>{getCarStatusText(car.status)}</Text>
                  </View>
                </View>
                <View style={styles.carSpecs}>
                  <View style={styles.specItem}>
                    <Text style={[styles.specLabel, dynamicStyles.specLabel]}>Год выпуска</Text>
                    <Text style={[styles.specValue, dynamicStyles.specValue]}>{car.year}</Text>
                  </View>
                  <View style={styles.specItem}>
                    <Text style={[styles.specLabel, dynamicStyles.specLabel]}>Цвет</Text>
                    <Text style={[styles.specValue, dynamicStyles.specValue]}>{car.color}</Text>
                  </View>
                  <View style={styles.specItem}>
                    <Text style={[styles.specLabel, dynamicStyles.specLabel]}>Тип</Text>
                    <Text style={[styles.specValue, dynamicStyles.specValue]}>{car.type}</Text>
                  </View>
                </View>
                <View style={styles.carActions}>
                  <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.editButtonText}>Редактировать</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDeleteCar(car.id)}
                  >
                    <Text style={styles.deleteButtonText}>Удалить</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            
            <TouchableOpacity style={[styles.addNewCarButton, dynamicStyles.addNewCarButton]} onPress={handleAddCar}>
              <Ionicons name="add-circle-outline" size={24} color="#003366" />
              <Text style={[styles.addNewCarText, dynamicStyles.addNewCarText]}>Добавить новый автомобиль</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default CarsScreen; 