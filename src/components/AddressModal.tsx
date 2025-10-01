import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AddressService, { Address } from '../services/addressService';
import { AddressModalStyles as styles, getAddressModalStyles } from '../styles/components/AddressModal.styles';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../hooks/useI18n';
import AddressMapModal from '../components/address/AddressMapModal';
import AddressForm from './address/AddressForm';
import { useAddressCategories } from '../shared/hooks/useAddressCategories';
import { useAddressGeocoding } from '../shared/hooks/useAddressGeocoding';

interface AddressModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (address: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>) => void;
  address?: Address | null;
  mode: 'add' | 'edit';
  addresses?: Address[];
  setDefaultAddress?: (id: string) => Promise<boolean>;
}

const AddressModal: React.FC<AddressModalProps> = ({
  visible = false,
  onClose,
  onSave,
  address = null,
  mode = 'add',
  addresses = [],
  setDefaultAddress,
}) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const addressService = useMemo(() => new AddressService(), []);
  const { geocodeFromCoordinates, verifyAddress: verifyAddressRemote } = useAddressGeocoding(addressService);
  const { categories } = useAddressCategories();
  const dynamicStyles = getAddressModalStyles(isDark);

  const [title, setTitle] = useState('');
  const [addressText, setAddressText] = useState('');
  const [category, setCategory] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedMapLocation, setSelectedMapLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [addressValidation, setAddressValidation] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');

  useEffect(() => {
    if (address && mode === 'edit') {
      setTitle(address.title);
      setAddressText(address.address);
      setCategory(address.category || '');
      setIsDefault(address.isDefault);
    } else {
      setTitle('');
      setAddressText('');
      setCategory('');
      setIsDefault(false);
    }
  }, [address, mode, visible]);

  const handleMapLocationSelect = async (location: { latitude: number; longitude: number }) => {
    setSelectedMapLocation(location);
    const formattedAddress = await geocodeFromCoordinates(location);

    if (formattedAddress) {
      setAddressText(formattedAddress);
      setAddressValidation('valid');
    } else {
      setAddressValidation('invalid');
    }
  };

  const verifyAddress = async (value: string): Promise<boolean> => {
    if (!value.trim()) {
      setAddressValidation('idle');
      return false;
    }

    setAddressValidation('checking');

    try {
      const isValid = await verifyAddressRemote(value);
      setAddressValidation(isValid ? 'valid' : 'invalid');
      return isValid;
    } catch {
      setAddressValidation('invalid');
      return false;
    }
  };

  const handleDefaultChange = async (newIsDefault: boolean) => {
    setIsDefault(newIsDefault);

    if (newIsDefault && category.trim() && setDefaultAddress) {
      const currentDefaultAddress = addresses?.find(
        (addr) => addr.isDefault && addr.id !== address?.id && addr.category === category.trim()
      );

      if (currentDefaultAddress) {
        try {
          await setDefaultAddress(currentDefaultAddress.id);
        } catch {
          setIsDefault(false);
        }
      }
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !addressText.trim()) {
      setAddressValidation('invalid');
      return;
    }

    if (addressValidation !== 'valid' && !(await verifyAddress(addressText))) {
      return;
    }

    onSave({
      title: title.trim(),
      address: addressText.trim(),
      category: category.trim(),
      isDefault,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: isDark ? '#1a1a1a' : '#fff' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.modalHeader, dynamicStyles.modalHeader]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={isDark ? '#fff' : '#000'} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, dynamicStyles.modalTitle]}>
            {mode === 'add' ? t('profile.residence.modal.addTitle') : t('profile.residence.modal.editTitle')}
          </Text>
          <TouchableOpacity
            onPress={handleSave}
            style={[styles.saveButton, addressValidation !== 'valid' && styles.saveButtonDisabled]}
            disabled={addressValidation !== 'valid'}
          >
            <Ionicons name="checkmark" size={24} color={addressValidation === 'valid' ? '#fff' : '#ccc'} />
          </TouchableOpacity>
        </View>

        <AddressForm
          title={title}
          address={addressText}
          category={category}
          categories={categories.map((option) => ({
            value: option.id,
            label: option.label,
            icon: option.icon as keyof typeof Ionicons.glyphMap | undefined,
          }))}
          isDefault={isDefault}
          onTitleChange={setTitle}
          onAddressChange={(text) => {
            setAddressText(text);
            if (addressValidation !== 'idle') {
              setAddressValidation('idle');
            }
          }}
          onAddressBlur={() => {
            if (addressText.trim()) {
              verifyAddress(addressText);
            }
          }}
          onCategorySelect={setCategory}
          onToggleDefault={() => handleDefaultChange(!isDefault)}
          onMapPress={() => setShowMapModal(true)}
          validationStatus={addressValidation}
          onRetryValidation={() => verifyAddress(addressText)}
          labels={{
            nameLabel: t('profile.residence.modal.nameLabel'),
            namePlaceholder: t('profile.residence.modal.namePlaceholder'),
            categoryLabel: t('profile.residence.modal.categoryLabel'),
            categoryPlaceholder: t('profile.residence.modal.categoryPlaceholder'),
            addressLabel: t('profile.residence.modal.addressLabel'),
            addressPlaceholder: t('profile.residence.modal.addressPlaceholder'),
            defaultLabel: t('profile.residence.modal.defaultLabel'),
            validation: {
              checking: t('profile.residence.modal.addressChecking'),
              valid: t('profile.residence.modal.addressValid'),
              invalid: t('profile.residence.modal.addressInvalid'),
              retry: t('profile.residence.modal.verifyAddress'),
            },
          }}
          styles={styles}
          dynamicStyles={dynamicStyles}
          isDark={isDark}
        />
      </KeyboardAvoidingView>

      <AddressMapModal
        visible={showMapModal}
        onClose={() => setShowMapModal(false)}
        onSelect={handleMapLocationSelect}
        styles={styles}
        dynamicStyles={dynamicStyles}
        isDark={isDark}
        title={t('profile.residence.modal.mapTitle')}
        confirmText={t('profile.residence.modal.mapDone')}
        instructionsText={t('profile.residence.modal.mapInstruction')}
        selectedCoordinates={selectedMapLocation}
      />
    </Modal>
  );
};

export default AddressModal; 