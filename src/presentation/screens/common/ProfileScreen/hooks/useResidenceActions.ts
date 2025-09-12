import { useState } from 'react';
import { Alert } from 'react-native';
import { useI18n } from '../../../../../../shared/hooks/useI18n';
import { Address } from '../../../../../../shared/types/profile';
import { useResidenceState } from './useResidenceState';

/**
 * Residence Actions Hook
 * 
 * Manages residence-related actions and state
 * Handles CRUD operations for addresses
 */

export const useResidenceActions = () => {
  const { t } = useI18n();
  const {
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    refreshAddresses,
  } = useResidenceState();

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

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
      t('residence.deleteConfirm'),
      t('residence.deleteMessage', { title: address.title }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('common.delete'), 
          style: 'destructive',
          onPress: async () => {
            const success = await deleteAddress(address.id);
            if (success) {
              await refreshAddresses();
              Alert.alert(t('common.success'), t('residence.deleteSuccess', { title: address.title }));
            } else {
              Alert.alert(t('common.error'), t('residence.deleteError'));
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
      Alert.alert(t('common.success'), t('residence.setDefaultSuccess'));
    } else {
      Alert.alert(t('common.error'), t('residence.setDefaultError'));
    }
  };

  const handleSaveAddress = async (addressData: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (modalMode === 'add') {
        const success = await addAddress(addressData);
        if (success) {
          setShowModal(false);
          await refreshAddresses();
          Alert.alert(t('common.success'), t('residence.addSuccess'));
        } else {
          Alert.alert(t('common.error'), t('residence.addError'));
        }
      } else if (modalMode === 'edit' && selectedAddress) {
        const success = await updateAddress(selectedAddress.id, addressData);
        if (success) {
          setShowModal(false);
          await refreshAddresses();
          Alert.alert(t('common.success'), t('residence.updateSuccess'));
        } else {
          Alert.alert(t('common.error'), t('residence.updateError'));
        }
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('residence.saveError'));
    }
  };

  return {
    showModal,
    modalMode,
    selectedAddress,
    setShowModal,
    setModalMode,
    setSelectedAddress,
    handleAddAddress,
    handleEditAddress,
    handleDeleteAddress,
    handleSetDefault,
    handleSaveAddress,
  };
};
