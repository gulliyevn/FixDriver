import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../../../../../context/ThemeContext';
import { useI18n } from '../../../../../../../../shared/hooks/useI18n';
import { Address } from '../../../../../../../../shared/types/profile';
import { styles } from '../styles/ResidenceScreen.styles';

/**
 * Address Modal Component
 * 
 * Modal for adding/editing addresses
 * Handles form validation and submission
 */

interface AddressModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (addressData: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>) => void;
  address?: Address | null;
  mode: 'add' | 'edit';
  addresses: Address[];
}

export const AddressModal: React.FC<AddressModalProps> = ({
  visible,
  onClose,
  onSave,
  address,
  mode,
  addresses,
}) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  
  const [title, setTitle] = useState('');
  const [addressText, setAddressText] = useState('');
  const [category, setCategory] = useState('home');

  useEffect(() => {
    if (address && mode === 'edit') {
      setTitle(address.title);
      setAddressText(address.address);
      setCategory(address.category || 'home');
    } else {
      setTitle('');
      setAddressText('');
      setCategory('home');
    }
  }, [address, mode, visible]);

  const handleSave = () => {
    if (!title.trim() || !addressText.trim()) {
      Alert.alert(t('common.error'), t('residence.validation.required'));
      return;
    }

    const addressData = {
      title: title.trim(),
      address: addressText.trim(),
      category,
      isDefault: addresses.length === 0, // First address is default
    };

    onSave(addressData);
  };

  const handleClose = () => {
    setTitle('');
    setAddressText('');
    setCategory('home');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={[styles.modalContainer, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
        <View style={[styles.modalHeader, { borderBottomColor: isDark ? '#333' : '#e0e0e0' }]}>
          <TouchableOpacity onPress={handleClose}>
            <Text style={[styles.modalCancelButton, { color: isDark ? '#fff' : '#003366' }]}>
              {t('common.cancel')}
            </Text>
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: isDark ? '#fff' : '#000' }]}>
            {mode === 'add' ? t('residence.addTitle') : t('residence.editTitle')}
          </Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={[styles.modalSaveButton, { color: '#003366' }]}>
              {t('common.save')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.modalContent}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: isDark ? '#fff' : '#000' }]}>
              {t('residence.titleLabel')}
            </Text>
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                color: isDark ? '#fff' : '#000',
                borderColor: isDark ? '#444' : '#ddd'
              }]}
              value={title}
              onChangeText={setTitle}
              placeholder={t('residence.titlePlaceholder')}
              placeholderTextColor={isDark ? '#666' : '#999'}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: isDark ? '#fff' : '#000' }]}>
              {t('residence.addressLabel')}
            </Text>
            <TextInput
              style={[styles.textInput, styles.textArea, { 
                backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                color: isDark ? '#fff' : '#000',
                borderColor: isDark ? '#444' : '#ddd'
              }]}
              value={addressText}
              onChangeText={setAddressText}
              placeholder={t('residence.addressPlaceholder')}
              placeholderTextColor={isDark ? '#666' : '#999'}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
