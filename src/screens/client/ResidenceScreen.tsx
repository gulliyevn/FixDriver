import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { getCurrentColors } from '../../constants/colors';
import { ClientScreenProps } from '../../types/navigation';
import { ResidenceScreenStyles as styles, getResidenceScreenStyles } from '../../styles/screens/profile/ResidenceScreen.styles';
import { Address, getAddressCategoryOptions } from '../../mocks/residenceMock';
import AddressModal from '../../components/AddressModal';
import { useAddresses } from '../../hooks/useAddresses';
import { useI18n } from '../../hooks/useI18n';

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
  const { isDark } = useTheme();
  const { t } = useI18n();
  const dynamicStyles = getResidenceScreenStyles(isDark);
  const currentColors = getCurrentColors(isDark);
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

  // Функция для получения переведенного названия категории
  const getCategoryLabel = (categoryKey: string): string => {
    const categoryOptions = getAddressCategoryOptions(t);
    const category = categoryOptions.find(opt => opt.value === categoryKey);
    return category ? category.label : categoryKey;
  };

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
      t('profile.residence.deleteConfirm'),
      t('profile.residence.deleteMessage', { title: address.title }),
      [
        { text: t('profile.cancel'), style: 'cancel' },
        { 
          text: t('profile.delete'), 
          style: 'destructive',
          onPress: async () => {
            const success = await deleteAddress(address.id);
            if (success) {
              await refreshAddresses();
              Alert.alert(t('common.success'), t('profile.residence.deleteSuccess', { title: address.title }));
            } else {
              Alert.alert(t('common.error'), t('profile.residence.deleteError'));
            }
          }
        },
      ]
    );
  };

  const handleSetDefault = async (address: Address) => {
    const success = await setDefaultAddress(address.id);
    if (success) {
      await refreshAddresses();
      Alert.alert(t('common.success'), t('profile.residence.setDefaultSuccess'));
    } else {
      Alert.alert(t('common.error'), t('profile.residence.setDefaultError'));
    }
  };

  const handleSaveAddress = async (addressData: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (modalMode === 'add') {
        const success = await addAddress(addressData);
        if (success) {
          setShowModal(false);
          await refreshAddresses();
          Alert.alert(t('common.success'), t('profile.residence.addSuccess'));
        } else {
          Alert.alert(t('common.error'), t('profile.residence.addError'));
        }
      } else if (modalMode === 'edit' && selectedAddress) {
        const success = await updateAddress(selectedAddress.id, addressData);
        if (success) {
          setShowModal(false);
          await refreshAddresses();
          Alert.alert(t('common.success'), t('profile.residence.updateSuccess'));
        } else {
          Alert.alert(t('common.error'), t('profile.residence.updateError'));
        }
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('profile.residence.saveError'));
    }
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <View style={[styles.header, dynamicStyles.header]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={currentColors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, dynamicStyles.title]}>{t('profile.residence.title')}</Text>
        <View style={styles.headerSpacer} />
      </View>
      
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={[styles.contentContainer, { paddingTop: 20 }]}
        showsVerticalScrollIndicator={false}
      >
        
        {loading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color="#003366" />
            <Text style={[styles.emptyStateText, dynamicStyles.emptyStateText]}>{t('profile.residence.loading')}</Text>
          </View>
        ) : error ? (
          <View style={styles.emptyState}>
            <Ionicons name="alert-circle-outline" size={64} color="#f44336" />
            <Text style={[styles.emptyStateText, dynamicStyles.emptyStateText]}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={refreshAddresses}
            >
              <Text style={styles.retryButtonText}>{t('profile.residence.retry')}</Text>
            </TouchableOpacity>
          </View>
        ) : addresses.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="location-outline" size={64} color="#ccc" />
            <Text style={[styles.emptyStateText, dynamicStyles.emptyStateText]}>
              {t('profile.residence.emptyState')}
            </Text>
          </View>
        ) : (
          addresses.map((address) => (
            <View key={address.id} style={[styles.addressItem, dynamicStyles.addressItem]}>
              <View style={styles.addressHeader}>
                                  <View style={styles.addressInfo}>
                    <Text style={[styles.addressTitle, dynamicStyles.addressTitle]}>{address.title}</Text>
                    <Text style={[styles.addressText, dynamicStyles.addressText]}>{address.address}</Text>
                    {address.category && (
                      <Text style={[styles.addressDescription, dynamicStyles.addressDescription]}>{getCategoryLabel(address.category)}</Text>
                    )}
                  </View>
                <View style={styles.actionButtons}>
                  {!address.isDefault && (
                    <TouchableOpacity 
                      style={[styles.defaultButton, dynamicStyles.defaultButton]}
                      onPress={() => handleSetDefault(address)}
                    >
                      <Ionicons name="star-outline" size={18} color={isDark ? '#fff' : '#ffc107'} />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity 
                    style={[styles.editButton, dynamicStyles.editButton]}
                    onPress={() => handleEditAddress(address)}
                  >
                    <Ionicons name="pencil" size={18} color={isDark ? '#fff' : '#2196f3'} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.deleteButton, dynamicStyles.deleteButton]}
                    onPress={() => handleDeleteAddress(address)}
                  >
                    <Ionicons name="trash" size={18} color="#f44336" />
                  </TouchableOpacity>
                </View>
              </View>
              {address.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>{t('profile.residence.defaultBadge')}</Text>
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