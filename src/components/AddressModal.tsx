import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Address, getAddressCategoryOptions } from '../mocks/residenceMock';
import { AddressModalStyles as styles, getAddressModalStyles } from '../styles/components/AddressModal.styles';
import Select from './Select';
import MapViewComponent from './MapView';
import * as Location from 'expo-location';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../hooks/useI18n';

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
  setDefaultAddress
}) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const dynamicStyles = getAddressModalStyles(isDark);
  const [title, setTitle] = useState('');
  const [addressText, setAddressText] = useState('');
  const [category, setCategory] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedMapLocation, setSelectedMapLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
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
    
    try {
      // Сначала пробуем Expo Location
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.latitude,
        longitude: location.longitude
      });
      
      // Если Expo Location не дал номер дома, пробуем OpenStreetMap Nominatim
      if (!reverseGeocode[0]?.streetNumber) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}&addressdetails=1&accept-language=ru`
          );
          const data = await response.json();
          
          if (data.display_name) {
            setAddressText(data.display_name);
            // Автоматически верифицируем адрес, выбранный по карте
            setAddressValidation('valid');
            return;
          }
        } catch (osmError) {
  
          
          // Пробуем Yandex Geocoding API
          try {
            const yandexResponse = await fetch(
              `https://geocode-maps.yandex.ru/1.x/?apikey=YOUR_YANDEX_API_KEY&format=json&geocode=${location.longitude},${location.latitude}&lang=ru_RU`
            );
            const yandexData = await yandexResponse.json();
            
            if (yandexData.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject?.metaDataProperty?.GeocoderMetaData?.text) {
              const yandexAddress = yandexData.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text;
              setAddressText(yandexAddress);
              // Автоматически верифицируем адрес, выбранный по карте
              setAddressValidation('valid');
              return;
            }
          } catch (yandexError) {
            console.warn('Yandex geocoding error:', yandexError);
          }
        }
      }
      
      if (reverseGeocode && reverseGeocode.length > 0) {
        const addressLocation = reverseGeocode[0];

        
        // Собираем полный адрес с деталями
        let streetPart = '';
        if (addressLocation.street) {
          if (addressLocation.streetNumber) {
            streetPart = `${addressLocation.street}, ${addressLocation.streetNumber}`;
          } else if (addressLocation.name) {
            // Иногда номер дома приходит в поле name
            streetPart = `${addressLocation.street}, ${addressLocation.name}`;
          } else {
            streetPart = addressLocation.street;
          }
        }
          
        const cityPart = addressLocation.city 
          ? `${addressLocation.city}`
          : '';
          
        const regionPart = addressLocation.region 
          ? `${addressLocation.region}`
          : '';
          
        const postalPart = addressLocation.postalCode 
          ? `${addressLocation.postalCode}`
          : '';
          
        const countryPart = addressLocation.country 
          ? `${addressLocation.country}`
          : '';
        
        // Собираем адрес по частям
        const addressParts = [
          streetPart,
          cityPart,
          regionPart,
          postalPart,
          countryPart
        ].filter(Boolean);
        
        const formattedAddress = addressParts.join(', ');
        setAddressText(formattedAddress || 'Адрес не найден');
        
        // Автоматически верифицируем адрес, выбранный по карте
        if (formattedAddress && formattedAddress !== 'Адрес не найден') {
          setAddressValidation('valid');
        }
      } else {
        setAddressText('Адрес не найден');
        setAddressValidation('invalid');
      }
    } catch (error) {
      setAddressText('Ошибка получения адреса');
      setAddressValidation('invalid');
    }
  };

  const verifyAddress = async (address: string) => {
    if (!address.trim()) {
      setAddressValidation('idle');
      return;
    }

    setAddressValidation('checking');
    
    try {
      // Используем наш API для верификации
      const { addressService } = await import('../services/addressService');
      const isValid = await addressService.verifyAddress(address);
      
      setAddressValidation(isValid ? 'valid' : 'invalid');
    } catch (error) {
      setAddressValidation('invalid');
    }
  };

  const handleDefaultChange = async (newIsDefault: boolean) => {
    setIsDefault(newIsDefault);
    
    // Если устанавливаем как "по умолчанию", сбрасываем другие адреса той же категории
    if (newIsDefault && category.trim() && setDefaultAddress) {
      const currentDefaultAddress = addresses?.find(addr => 
        addr.isDefault && 
        addr.id !== address?.id && 
        addr.category === category.trim()
      );
      
      if (currentDefaultAddress) {
        try {
          await setDefaultAddress(currentDefaultAddress.id);
        } catch (error) {
          // Если не удалось сбросить, возвращаем галочку
          setIsDefault(false);
        }
      }
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert(t('common.error'), t('profile.residence.modal.nameRequired'));
      return;
    }
    if (!addressText.trim()) {
      Alert.alert(t('common.error'), t('profile.residence.modal.addressRequired'));
      return;
    }

    // Проверяем верификацию адреса перед сохранением
    if (addressValidation !== 'valid') {
      Alert.alert(
        t('common.error'), 
        t('profile.residence.modal.addressInvalid'),
        [
          {
            text: t('common.ok'),
            onPress: () => {
              // Автоматически запускаем верификацию
              verifyAddress(addressText);
            }
          }
        ]
      );
      return;
    }

    try {
      onSave({
        title: title.trim(),
        address: addressText.trim(),
        category: category.trim(),
        isDefault
      });
      onClose();
    } catch (error) {
      Alert.alert(t('common.error'), t('profile.residence.modal.saveError'));
    }
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
            style={[
              styles.saveButton, 
              addressValidation !== 'valid' && styles.saveButtonDisabled
            ]}
            disabled={addressValidation !== 'valid'}
          >
            <Ionicons 
              name="checkmark" 
              size={24} 
              color={addressValidation === 'valid' ? "#fff" : "#ccc"} 
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.formContainer, dynamicStyles.formContainer]}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>
              {t('profile.residence.modal.nameLabel')}
            </Text>
            <TextInput
              style={[styles.textInput, dynamicStyles.textInput]}
              placeholder={t('profile.residence.modal.namePlaceholder')}
              placeholderTextColor={isDark ? '#999' : '#999'}
              value={title}
              onChangeText={setTitle}
              maxLength={50}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>
              {t('profile.residence.modal.categoryLabel')}
            </Text>
            <Select
              options={getAddressCategoryOptions(t)}
              value={category}
              onSelect={(option) => setCategory(option.value as string)}
              placeholder={t('profile.residence.modal.categoryPlaceholder')}
              compact={true}
              searchable={true}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>
              {t('profile.residence.modal.addressLabel')}
            </Text>
            <View style={[styles.addressInputContainer, dynamicStyles.addressInputContainer]}>
              <TextInput
                style={[styles.addressInput, dynamicStyles.addressInput]}
                placeholder={t('profile.residence.modal.addressPlaceholder')}
                placeholderTextColor={isDark ? '#999' : '#999'}
                value={addressText}
                onChangeText={(text) => {
                  setAddressText(text);
                  // Сбрасываем валидацию при изменении текста
                  if (addressValidation !== 'idle') {
                    setAddressValidation('idle');
                  }
                }}
                onBlur={() => {
                  // Верифицируем адрес при потере фокуса
                  if (addressText.trim()) {
                    verifyAddress(addressText);
                  }
                }}
                multiline
                maxLength={200}
              />
              <TouchableOpacity 
                style={[styles.mapButton, dynamicStyles.mapButton]}
                onPress={() => {
                  // Открываем модальное окно с картой
                  setShowMapModal(true);
                }}
              >
                <Ionicons name="map-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            
            {/* Индикатор верификации адреса */}
            {addressText.trim() && (
              <View style={styles.validationContainer}>
                {addressValidation === 'checking' && (
                  <View style={styles.validationItem}>
                    <ActivityIndicator size="small" color="#2196f3" />
                    <Text style={[styles.validationText, dynamicStyles.validationText]}>
                      {t('profile.residence.modal.addressChecking')}
                    </Text>
                  </View>
                )}
                {addressValidation === 'valid' && (
                  <View style={styles.validationItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4caf50" />
                    <Text style={[styles.validationText, styles.validationTextValid, dynamicStyles.validationText]}>
                      {t('profile.residence.modal.addressValid')}
                    </Text>
                  </View>
                )}
                {addressValidation === 'invalid' && (
                  <View style={styles.validationItem}>
                    <Ionicons name="close-circle" size={16} color="#f44336" />
                    <Text style={[styles.validationText, styles.validationTextInvalid, dynamicStyles.validationText]}>
                      {t('profile.residence.modal.addressInvalid')}
                    </Text>
                  </View>
                )}
                {addressValidation === 'invalid' && (
                  <TouchableOpacity 
                    style={styles.verifyButton}
                    onPress={() => verifyAddress(addressText)}
                  >
                    <Text style={styles.verifyButtonText}>
                      {t('profile.residence.modal.verifyAddress')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => handleDefaultChange(!isDefault)}
          >
            <Ionicons 
              name={isDefault ? 'checkmark-circle' : 'ellipse-outline'} 
              size={24} 
              color={isDefault ? '#4caf50' : '#ccc'} 
            />
            <Text style={[styles.checkboxText, dynamicStyles.checkboxText]}>
              {t('profile.residence.modal.defaultLabel')}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Модальное окно с картой */}
      <Modal
        visible={showMapModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowMapModal(false)}
      >
        <View style={[styles.mapModalContainer, dynamicStyles.mapModalContainer]}>
          <View style={[styles.mapModalHeader, dynamicStyles.mapModalHeader]}>
            <TouchableOpacity onPress={() => setShowMapModal(false)} style={styles.mapCloseButton}>
              <Ionicons name="close" size={24} color={isDark ? '#fff' : '#000'} />
            </TouchableOpacity>
            <Text style={[styles.mapModalTitle, dynamicStyles.mapModalTitle]}>{t('profile.residence.modal.mapTitle')}</Text>
            <TouchableOpacity 
              onPress={() => setShowMapModal(false)} 
              style={styles.mapConfirmButton}
            >
              <Text style={styles.mapConfirmButtonText}>{t('profile.residence.modal.mapDone')}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.mapContainer, dynamicStyles.mapContainer]}>
            <MapViewComponent
              onLocationSelect={handleMapLocationSelect}
              showNearbyDrivers={false}
              markers={selectedMapLocation ? [{
                id: 'selected',
                coordinate: selectedMapLocation,
                title: 'Выбранный адрес',
                description: 'Нажмите на карту для выбора другого адреса',
                type: 'destination'
              }] : []}
            />
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

export default AddressModal; 