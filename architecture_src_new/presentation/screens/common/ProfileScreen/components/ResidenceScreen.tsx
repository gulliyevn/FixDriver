import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { ChevronLeft, Plus, Edit, Trash2, Star, MapPin } from '../../../../../shared/components/IconLibrary';
import { useTheme } from '../../../../../core/context/ThemeContext';
import { useAuth } from '../../../../../core/context/AuthContext';
import { useI18n } from '../../../../../shared/i18n';
import { getAddressesSync, addAddress, updateAddress, deleteAddress, setDefaultAddress, Address } from '../../../../../shared/mocks/residenceMock';
import { createResidenceScreenStyles } from './styles/ResidenceScreen.styles';

interface ResidenceScreenProps {
  onBack: () => void;
}

/**
 * Экран резиденции
 * 
 * TODO для интеграции с бэкендом:
 * 1. Заменить useState на useResidence hook
 * 2. Подключить ResidenceService для API вызовов
 * 3. Добавить обработку ошибок и загрузки
 * 4. Реализовать управление адресами
 * 5. Подключить геолокацию
 */

const ResidenceScreen: React.FC<ResidenceScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { t } = useI18n();
  const styles = createResidenceScreenStyles(colors);
  
  // Определяем роль пользователя
  const isDriver = user?.role === 'driver';
  
  // Состояние для адресов
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Условная логика для разных ролей
  const getScreenTitle = () => {
    return isDriver ? 'Мои адреса' : 'Мои адреса';
  };
  
  const getEmptyStateText = () => {
    return 'У вас пока нет сохраненных адресов.\nДобавьте адрес для быстрого заказа такси.';
  };
  
  // Загрузка адресов
  const loadAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedAddresses = getAddressesSync();
      setAddresses(loadedAddresses);
    } catch (err) {
      setError('Ошибка загрузки адресов');
      console.error('Load addresses error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Обработчик добавления адреса
  const handleAddAddress = () => {
    // TODO: Открыть модальное окно добавления адреса
    Alert.alert('Добавление адреса', 'Функция добавления адреса будет реализована');
  };
  
  // Обработчик редактирования адреса
  const handleEditAddress = (address: Address) => {
    // TODO: Открыть модальное окно редактирования адреса
    Alert.alert('Редактирование адреса', `Редактирование адреса "${address.title}" будет реализовано`);
  };
  
  // Обработчик удаления адреса
  const handleDeleteAddress = (address: Address) => {
    Alert.alert(
      'Удаление адреса',
      `Вы уверены, что хотите удалить адрес "${address.title}"?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAddress(address.id);
              await loadAddresses();
            } catch (err) {
              Alert.alert('Ошибка', 'Не удалось удалить адрес');
              console.error('Delete address error:', err);
            }
          }
        }
      ]
    );
  };
  
  // Обработчик установки адреса по умолчанию
  const handleSetDefault = async (address: Address) => {
    try {
      await setDefaultAddress(address.id);
      await loadAddresses();
    } catch (err) {
      Alert.alert('Ошибка', 'Не удалось установить адрес по умолчанию');
      console.error('Set default address error:', err);
    }
  };
  
  // Загрузка адресов при монтировании
  useEffect(() => {
    loadAddresses();
  }, []);
  
  // Получение иконки категории
  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'home':
        return '🏠';
      case 'work':
        return '💼';
      case 'university':
        return '🎓';
      case 'mall':
        return '🛒';
      case 'hospital':
        return '🏥';
      case 'gym':
        return '💪';
      case 'restaurant':
        return '🍽️';
      case 'parents':
        return '👨‍👩‍👧‍👦';
      case 'dacha':
        return '🌳';
      default:
        return '📍';
    }
  };
  
  // Получение названия категории
  const getCategoryName = (category?: string) => {
    switch (category) {
      case 'home':
        return 'Дом';
      case 'work':
        return 'Работа';
      case 'university':
        return 'Университет';
      case 'mall':
        return 'Торговый центр';
      case 'hospital':
        return 'Больница';
      case 'gym':
        return 'Спортзал';
      case 'restaurant':
        return 'Ресторан';
      case 'parents':
        return 'Родители';
      case 'dacha':
        return 'Дача';
      default:
        return 'Другой';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{getScreenTitle()}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Загрузка адресов...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadAddresses}>
              <Text style={styles.retryButtonText}>Повторить</Text>
            </TouchableOpacity>
          </View>
        ) : addresses.length === 0 ? (
          // Empty State
          <View style={styles.emptyState}>
            <MapPin size={48} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>{getEmptyStateText()}</Text>
            <TouchableOpacity style={styles.addFirstAddressButton} onPress={handleAddAddress}>
              <Text style={styles.addFirstAddressButtonText}>Добавить адрес</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Addresses List
          <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
            {addresses.map((address) => (
              <View key={address.id} style={styles.addressItem}>
                <View style={styles.addressHeader}>
                  <View style={styles.addressInfo}>
                    <Text style={styles.addressTitle}>
                      {getCategoryIcon(address.category)} {address.title}
                    </Text>
                    <Text style={styles.addressText}>{address.address}</Text>
                    {address.category && (
                      <Text style={styles.addressDescription}>
                        Категория: {getCategoryName(address.category)}
                      </Text>
                    )}
                    {address.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultText}>По умолчанию</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.actionButtons}>
                    {!address.isDefault && (
                      <TouchableOpacity
                        style={styles.defaultButton}
                        onPress={() => handleSetDefault(address)}
                      >
                        <Star size={20} color="#ffc107" />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => handleEditAddress(address)}
                    >
                      <Edit size={20} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteAddress(address)}
                    >
                      <Trash2 size={20} color="#f44336" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Floating Add Button */}
      {addresses.length > 0 && (
        <TouchableOpacity style={styles.floatingAddButton} onPress={handleAddAddress}>
          <Plus size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ResidenceScreen;
