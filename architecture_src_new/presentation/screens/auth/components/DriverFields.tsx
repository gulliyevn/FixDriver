import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DatePickerModal from '../../../components/ui/DatePickerModal';
import * as ImagePicker from 'expo-image-picker';

export interface DriverFormData {
  country?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  vehicleNumber?: string;
  experience?: string;
  tariff?: string;
  carBrand?: string;
  carModel?: string;
  carYear?: string;
  carMileage?: string;
  licensePhotoUri?: string;
  techPassportPhotoUri?: string;
}

interface Props {
  t: (k: string) => string;
  styles: any;
  driverStyles: any;
  formData: DriverFormData;
  errors: Partial<DriverFormData>;
  onChange: (field: keyof DriverFormData, value: string) => void;
  onOpenSelect: (field: keyof DriverFormData, title: string) => void;
}

const DriverFields: React.FC<Props> = ({ t, styles, driverStyles, formData, errors, onChange, onOpenSelect }) => {
  const [showExpiry, setShowExpiry] = useState(false);
  const [showYear, setShowYear] = useState(false);
  const [picking, setPicking] = useState<'license' | 'tech' | null>(null);

  const pickImage = async (target: 'license' | 'tech') => {
    try {
      setPicking(target);
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('common.permissionRequired'), t('common.mediaPermissionDenied'));
        setPicking(null);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        if (target === 'license') {
          onChange('licensePhotoUri' as any, uri);
        } else {
          onChange('techPassportPhotoUri' as any, uri);
        }
      }
    } catch (e) {
      // optionally log
    } finally {
      setPicking(null);
    }
  };
  return (
    <>
      {/* Documents */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('auth.register.country')}</Text>
        <TouchableOpacity style={driverStyles.selectContainer} onPress={() => onOpenSelect('country', t('auth.register.country'))}>
          <Text style={driverStyles.selectText}>{formData.country || t('auth.register.countryPlaceholder')}</Text>
          <Ionicons name="chevron-down" size={20} color={styles.colors?.textSecondary || '#64748B'} />
        </TouchableOpacity>
        {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('auth.register.licenseNumber')}</Text>
        <TextInput
          style={[styles.input, errors.licenseNumber && styles.inputError]}
          value={formData.licenseNumber}
          onChangeText={(text) => onChange('licenseNumber', text)}
          placeholder={t('auth.register.licenseNumberPlaceholder')}
          placeholderTextColor={styles.colors?.textSecondary || '#64748B'}
          autoCapitalize="characters"
        />
        {errors.licenseNumber && <Text style={styles.errorText}>{errors.licenseNumber}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('auth.register.licenseExpiry')}</Text>
        <TouchableOpacity style={driverStyles.selectContainer} onPress={() => setShowExpiry(true)}>
          <Text style={driverStyles.selectText}>{formData.licenseExpiry || t('auth.register.licenseExpiryPlaceholder')}</Text>
          <Ionicons name="calendar" size={20} color={styles.colors?.textSecondary || '#64748B'} />
        </TouchableOpacity>
        {errors.licenseExpiry && <Text style={styles.errorText}>{errors.licenseExpiry}</Text>}
      </View>

      <View style={driverStyles.photoSection}>
        <Text style={styles.label}>{t('auth.register.licensePhoto')}</Text>
        <TouchableOpacity style={[driverStyles.photoUpload, errors.licensePhotoUri && styles.inputError]} onPress={() => pickImage('license')} disabled={picking !== null}>
          {formData.licensePhotoUri ? (
            <>
              <Image
                source={{ uri: formData.licensePhotoUri }}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 12 }}
                resizeMode="cover"
              />
              <View style={{ position: 'absolute', right: 8, top: 8 }}>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    onChange('licensePhotoUri' as any, '');
                  }}
                  style={{ backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 12, padding: 6 }}
                >
                  <Ionicons name="close" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Ionicons name="camera" size={24} color={styles.colors?.textSecondary || '#64748B'} />
              <Text style={driverStyles.photoText}>{t('auth.register.licensePhotoUpload')}</Text>
            </>
          )}
        </TouchableOpacity>
        {errors.licensePhotoUri && <Text style={styles.errorText}>{errors.licensePhotoUri}</Text>}
      </View>

      <View style={driverStyles.photoSection}>
        <Text style={styles.label}>{t('auth.register.techPassportPhoto')}</Text>
        <TouchableOpacity style={[driverStyles.photoUpload, errors.techPassportPhotoUri && styles.inputError]} onPress={() => pickImage('tech')} disabled={picking !== null}>
          {formData.techPassportPhotoUri ? (
            <>
              <Image
                source={{ uri: formData.techPassportPhotoUri }}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 12 }}
                resizeMode="cover"
              />
              <View style={{ position: 'absolute', right: 8, top: 8 }}>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    onChange('techPassportPhotoUri' as any, '');
                  }}
                  style={{ backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 12, padding: 6 }}
                >
                  <Ionicons name="close" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Ionicons name="camera" size={24} color={styles.colors?.textSecondary || '#64748B'} />
              <Text style={driverStyles.photoText}>{t('auth.register.techPassportPhotoUpload')}</Text>
            </>
          )}
        </TouchableOpacity>
        {errors.techPassportPhotoUri && <Text style={styles.errorText}>{errors.techPassportPhotoUri}</Text>}
      </View>

      {/* Vehicle */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('auth.register.vehicleNumber')}</Text>
        <TextInput
          style={[styles.input, errors.vehicleNumber && styles.inputError]}
          value={formData.vehicleNumber}
          onChangeText={(text) => onChange('vehicleNumber', text)}
          placeholder={t('auth.register.vehicleNumberPlaceholder')}
          placeholderTextColor={styles.colors?.textSecondary || '#64748B'}
          autoCapitalize="characters"
        />
        {errors.vehicleNumber && <Text style={styles.errorText}>{errors.vehicleNumber}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('auth.register.experience')}</Text>
        <TouchableOpacity style={driverStyles.selectContainer} onPress={() => onOpenSelect('experience', t('auth.register.experience'))}>
          <Text style={driverStyles.selectText}>{formData.experience || t('auth.register.experiencePlaceholder')}</Text>
          <Ionicons name="chevron-down" size={20} color={styles.colors?.textSecondary || '#64748B'} />
        </TouchableOpacity>
        {errors.experience && <Text style={styles.errorText}>{errors.experience}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('auth.register.tariff')}</Text>
        <TouchableOpacity style={driverStyles.selectContainer} onPress={() => onOpenSelect('tariff', t('auth.register.tariff'))}>
          <Text style={driverStyles.selectText}>{formData.tariff || t('auth.register.tariffPlaceholder')}</Text>
          <Ionicons name="chevron-down" size={20} color={styles.colors?.textSecondary || '#64748B'} />
        </TouchableOpacity>
        {errors.tariff && <Text style={styles.errorText}>{errors.tariff}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('auth.register.carBrand')}</Text>
        <TouchableOpacity
          style={[driverStyles.selectContainer, !formData.tariff ? { opacity: 0.5 } : null]}
          onPress={() => formData.tariff && onOpenSelect('carBrand', t('auth.register.carBrand'))}
          disabled={!formData.tariff}
        >
          <Text style={driverStyles.selectText}>{formData.carBrand || t('auth.register.carBrandPlaceholder')}</Text>
          <Ionicons name="chevron-down" size={20} color={styles.colors?.textSecondary || '#64748B'} />
        </TouchableOpacity>
        {errors.carBrand && <Text style={styles.errorText}>{errors.carBrand}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('auth.register.carModel')}</Text>
        <TouchableOpacity
          style={[driverStyles.selectContainer, !formData.carBrand ? { opacity: 0.5 } : null]}
          onPress={() => formData.carBrand && onOpenSelect('carModel', t('auth.register.carModel'))}
          disabled={!formData.carBrand}
        >
          <Text style={driverStyles.selectText}>{formData.carModel || t('auth.register.carModelPlaceholder')}</Text>
          <Ionicons name="chevron-down" size={20} color={styles.colors?.textSecondary || '#64748B'} />
        </TouchableOpacity>
        {errors.carModel && <Text style={styles.errorText}>{errors.carModel}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('auth.register.carYear')}</Text>
        <TouchableOpacity style={driverStyles.selectContainer} onPress={() => setShowYear(true)}>
          <Text style={driverStyles.selectText}>{formData.carYear || t('auth.register.carYearPlaceholder')}</Text>
          <Ionicons name="calendar" size={20} color={styles.colors?.textSecondary || '#64748B'} />
        </TouchableOpacity>
        {errors.carYear && <Text style={styles.errorText}>{errors.carYear}</Text>}
      </View>

      <DatePickerModal
        visible={showExpiry}
        title={t('auth.register.licenseExpiry')}
        mode="date"
        onClose={() => setShowExpiry(false)}
        minDate={(() => { const d = new Date(); d.setMonth(d.getMonth() + 1); return d; })()}
        maxDate={(() => { const d = new Date(); d.setFullYear(d.getFullYear() + 20); return d; })()}
        defaultValue={(() => { const d = new Date(); d.setMonth(d.getMonth() + 1); return d; })()}
        onConfirm={(val) => {
          onChange('licenseExpiry', val);
          setShowExpiry(false);
        }}
      />
      <DatePickerModal
        visible={showYear}
        title={t('auth.register.carYear')}
        mode="year"
        onClose={() => setShowYear(false)}
        onConfirm={(val) => {
          onChange('carYear', val);
          setShowYear(false);
        }}
      />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('auth.register.carMileage')}</Text>
        <TouchableOpacity style={driverStyles.selectContainer} onPress={() => onOpenSelect('carMileage', t('auth.register.carMileage'))}>
          <Text style={driverStyles.selectText}>{formData.carMileage || t('auth.register.carMileagePlaceholder')}</Text>
          <Ionicons name="chevron-down" size={20} color={styles.colors?.textSecondary || '#64748B'} />
        </TouchableOpacity>
        {errors.carMileage && <Text style={styles.errorText}>{errors.carMileage}</Text>}
      </View>
    </>
  );
};

export default DriverFields;