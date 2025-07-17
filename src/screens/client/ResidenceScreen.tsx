import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClientScreenProps } from '../../types/navigation';
import { ResidenceScreenStyles as styles } from '../../styles/screens/profile/ResidenceScreen.styles';
import { Address } from '../../mocks/residenceMock';
import AddressModal from '../../components/AddressModal';
import { useAddresses } from '../../hooks/useAddresses';

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

const ResidenceScreen: React.FC<ClientScreenProps<'Residence'>> = ({ navigation, route }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const {
    addresses,
    loading,
    error,
    refreshAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAddresses();

  const handleAddAddress = () => {
    setModalMode('add');
    setSelectedAddress(null);
    setShowModal(true);
  };

  const handleEditAddress = (address: Address) => {
    setModalMode('edit');
    setSelectedAddress(address);
    setShowModal(true);
  };

  const handleDeleteAddress = (address: Address) => {
    Alert.alert(
      'Удалить адрес',
      `Вы уверены, что хотите удалить адрес "${address.title}"?`,
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить', 
          style: 'destructive',
          onPress: async () => {
            await deleteAddress(address.id);
          }
        },
      ]
    );
  };

  const handleSetDefault = async (address: Address) => {
    await setDefaultAddress(address.id);
  };

  const handleSaveAddress = async (addressData: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (modalMode === 'add') {
        const success = await addAddress(addressData);
        if (success) {
          setShowModal(false);
        }
      } else if (modalMode === 'edit' && selectedAddress) {
        const success = await updateAddress(selectedAddress.id, addressData);
        if (success) {
          setShowModal(false);
        }
      }
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить адрес');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.title}>Резиденция</Text>
        <View style={styles.headerSpacer} />
      </View>
      
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        
        {loading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color="#003366" />
            <Text style={styles.emptyStateText}>Загрузка адресов...</Text>
          </View>
        ) : error ? (
          <View style={styles.emptyState}>
            <Ionicons name="alert-circle-outline" size={64} color="#f44336" />
            <Text style={styles.emptyStateText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={refreshAddresses}
            >
              <Text style={styles.retryButtonText}>Повторить</Text>
            </TouchableOpacity>
          </View>
        ) : addresses.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="location-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>
              У вас пока нет сохраненных адресов{'\n'}
              Добавьте первый адрес для быстрого заказа поездок
            </Text>
          </View>
        ) : (
          addresses.map((address) => (
            <View key={address.id} style={styles.addressItem}>
              <View style={styles.addressHeader}>
                <View style={styles.addressInfo}>
                  <Text style={styles.addressTitle}>{address.title}</Text>
                  <Text style={styles.addressText}>{address.address}</Text>
                  {address.category && (
                    <Text style={styles.addressDescription}>{address.category}</Text>
                  )}
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => handleEditAddress(address)}
                  >
                    <Ionicons name="pencil" size={20} color="#003366" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDeleteAddress(address)}
                  >
                    <Ionicons name="trash" size={20} color="#f44336" />
                  </TouchableOpacity>
                </View>
              </View>
              {address.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>По умолчанию</Text>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.floatingAddButton} onPress={handleAddAddress}>
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      <AddressModal
        visible={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedAddress(null);
        }}
        onSave={handleSaveAddress}
        address={selectedAddress}
        mode={modalMode}
        addresses={addresses}
        setDefaultAddress={setDefaultAddress}
      />
    </View>
  );
};

export default ResidenceScreen; 