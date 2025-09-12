import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { useI18n } from '../../../../../../shared/hooks/useI18n';
import { VehicleFormData } from '../../../../../../shared/types/driver/DriverVehicle';
import { EditProfileScreenStyles as styles } from '../styles/EditProfileScreen.styles';
import Select from '../../../../../../presentation/components/Select';
import PhotoUpload from '../../../../../../presentation/components/PhotoUpload';
import {
  carBrands,
  carModelsByBrand,
  getYearOptions,
  getTariffOptions,
} from '../../../../../../shared/utils/driverData';
import vehicleSegments from '../../../../../../shared/constants/vehicleSegments.json';

/**
 * Vehicle Form Component
 * 
 * Form fields for vehicle data input
 */

interface VehicleFormProps {
  vehicleForm: VehicleFormData;
  vehicleErrors: any;
  brandOptions: { label: string; value: string; tariff?: string }[];
  modelOptions: { label: string; value: string; tariff?: string }[];
  vehiclePhoto: string | null;
  uploadingPhoto: 'vehicle' | null;
  isDark: boolean;
  isLoading: boolean;
  onVehicleChange: (field: string, value: string) => void;
  onBrandChange: (brand: string) => void;
  onModelChange: (model: string) => void;
  onTariffChange: (tariff: string) => void;
  onYearChange: (option: { label: string; value: string | number }) => void;
  onPhotoChange: (uri: string | null) => void;
  onPhotoError: (err: string) => void;
  onUploadingChange: (flag: boolean) => void;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({
  vehicleForm,
  vehicleErrors,
  brandOptions,
  modelOptions,
  vehiclePhoto,
  uploadingPhoto,
  isDark,
  isLoading,
  onVehicleChange,
  onBrandChange,
  onModelChange,
  onTariffChange,
  onYearChange,
  onPhotoChange,
  onPhotoError,
  onUploadingChange
}) => {
  const { t } = useI18n();
  const tariffOptions = getTariffOptions(t);
  const yearOptions = getYearOptions();

  return (
    <>
      {/* Vehicle Number */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, isDark && styles.labelDark]}>
          {t('profile.vehicles.vehicleNumber')} <Text style={{ color: '#e53935' }}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          value={vehicleForm.vehicleNumber}
          onChangeText={(text) => onVehicleChange('vehicleNumber', text)}
          placeholder={t('profile.vehicles.vehicleNumberPlaceholder')}
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
          autoCapitalize="characters"
          editable={!isLoading}
        />
        {vehicleErrors.vehicleNumber && (
          <Text style={[styles.errorText, isDark && styles.errorTextDark]}>
            {vehicleErrors.vehicleNumber}
          </Text>
        )}
      </View>

      {/* Tariff */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, isDark && styles.labelDark]}>
          {t('profile.vehicles.tariff')} <Text style={{ color: '#e53935' }}>*</Text>
        </Text>
        <Select 
          value={vehicleForm.tariff} 
          onSelect={(option) => onTariffChange(String(option.value))} 
          options={tariffOptions} 
          placeholder={t('profile.vehicles.tariffPlaceholder')}
          disabled={isLoading}
        />
        {vehicleErrors.tariff && (
          <Text style={[styles.errorText, isDark && styles.errorTextDark]}>
            {vehicleErrors.tariff}
          </Text>
        )}
      </View>

      {/* Car Brand */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, isDark && styles.labelDark]}>
          {t('profile.vehicles.carBrand')} <Text style={{ color: '#e53935' }}>*</Text>
        </Text>
        <Select 
          value={vehicleForm.carBrand} 
          onSelect={(option) => onBrandChange(String(option.value))} 
          options={brandOptions} 
          placeholder={t('profile.vehicles.carBrandPlaceholder')}
          disabled={!vehicleForm.tariff || isLoading}
        />
        {vehicleErrors.carBrand && (
          <Text style={[styles.errorText, isDark && styles.errorTextDark]}>
            {vehicleErrors.carBrand}
          </Text>
        )}
      </View>

      {/* Car Model */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, isDark && styles.labelDark]}>
          {t('profile.vehicles.carModel')} <Text style={{ color: '#e53935' }}>*</Text>
        </Text>
        <Select 
          value={vehicleForm.carModel} 
          onSelect={(option) => onModelChange(String(option.value))} 
          options={modelOptions} 
          placeholder={t('profile.vehicles.carModelPlaceholder')}
          disabled={!vehicleForm.carBrand || isLoading}
        />
        {vehicleErrors.carModel && (
          <Text style={[styles.errorText, isDark && styles.errorTextDark]}>
            {vehicleErrors.carModel}
          </Text>
        )}
      </View>

      {/* Car Year */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, isDark && styles.labelDark]}>
          {t('profile.vehicles.carYear')} <Text style={{ color: '#e53935' }}>*</Text>
        </Text>
        <Select 
          value={vehicleForm.carYear} 
          onSelect={onYearChange} 
          options={yearOptions} 
          placeholder={t('profile.vehicles.carYearPlaceholder')}
          disabled={isLoading}
        />
        {vehicleErrors.carYear && (
          <Text style={[styles.errorText, isDark && styles.errorTextDark]}>
            {vehicleErrors.carYear}
          </Text>
        )}
      </View>

      {/* Car Mileage */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, isDark && styles.labelDark]}>
          {t('profile.vehicles.carMileage')} <Text style={{ color: '#e53935' }}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          value={vehicleForm.carMileage}
          onChangeText={(text) => onVehicleChange('carMileage', text)}
          placeholder={t('profile.vehicles.carMileagePlaceholder')}
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
          keyboardType="numeric"
          editable={!isLoading}
        />
        {vehicleErrors.carMileage && (
          <Text style={[styles.errorText, isDark && styles.errorTextDark]}>
            {vehicleErrors.carMileage}
          </Text>
        )}
      </View>

      {/* Photo Upload */}
      <View style={styles.formGroup}>
        <PhotoUpload
          photo={vehiclePhoto}
          onPhotoChange={onPhotoChange}
          onError={onPhotoError}
          type="vehicle"
          uploading={uploadingPhoto === 'vehicle'}
          onUploadingChange={onUploadingChange}
        />
        {vehicleErrors.vehiclePhoto && (
          <Text style={[styles.errorText, isDark && styles.errorTextDark]}>
            {vehicleErrors.vehiclePhoto}
          </Text>
        )}
      </View>
    </>
  );
};
