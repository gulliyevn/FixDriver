import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import { useI18n } from '../../../hooks/useI18n';
import { DriverScreenProps } from '../../../types/driver/DriverNavigation';
import { DriverVehiclesScreenStyles as styles, getDriverVehiclesScreenColors } from '../../../styles/screens/profile/driver/DriverVehiclesScreen.styles';
import { colors } from '../../../constants/colors';
import Select from '../../../components/Select';
import PhotoUpload from '../../../components/PhotoUpload';

import vehicleSegments from '../../../utils/vehicleSegments.json';
import {
  carBrands,
  carModelsByBrand,
  getYearOptions,
  getTariffOptions,
} from '../../../utils/driverData';
import { useDriverVehicles } from '../../../hooks/driver/useDriverVehicles';
import { VehicleFormData } from '../../../types/driver/DriverVehicle';

const DriverVehiclesScreen: React.FC<DriverScreenProps<'DriverVehicles'>> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const dynamicStyles = getDriverVehiclesScreenColors(isDark);
  const currentColors = isDark ? colors.dark : colors.light;
  
  // Хук для работы с автомобилями из БД
  const {
    createVehicle,
    validateVehicleForm,
  } = useDriverVehicles();
  
  const [isEditing, setIsEditing] = useState(true); // Показываем форму сразу
  
  // Состояние формы автомобиля
  const [vehicleForm, setVehicleForm] = useState<VehicleFormData>({
    vehicleNumber: '',
    tariff: '',
    carBrand: '',
    carModel: '',
    carYear: '',
    carMileage: '',
    passportPhoto: '',
  });
  const [vehicleErrors, setVehicleErrors] = useState<any>({});
  const [brandOptions, setBrandOptions] = useState(carBrands);
  const [modelOptions, setModelOptions] = useState<{ label: string; value: string; tariff?: string }[]>([]);
  const [vehiclePhoto, setVehiclePhoto] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState<'vehicle' | null>(null);

  // Логика зависимостей между полями
  useEffect(() => {
    if (vehicleForm.tariff) {
      setBrandOptions(vehicleSegments[vehicleForm.tariff]?.brands || carBrands);
      setModelOptions([]);
      setVehicleForm((prev) => ({ ...prev, carBrand: '', carModel: '' }));
    }
  }, [vehicleForm.tariff]);

  const tariffOptions = getTariffOptions(t);
  const yearOptions = getYearOptions();

  const handleVehicleChange = (field: string, value: string) => {
    setVehicleForm((prev) => ({ ...prev, [field]: value }));
    setVehicleErrors((prev: any) => ({ ...prev, [field]: undefined }));
  };

  const handleBrandChange = (brand: string) => {
    setVehicleForm((prev) => ({ ...prev, carBrand: brand, carModel: '' }));
    setModelOptions(vehicleSegments[vehicleForm.tariff]?.models[brand] || []);
  };

  const handleModelChange = (model: string) => {
    setVehicleForm((prev) => ({ ...prev, carModel: model }));
    const selectedBrand = vehicleForm.carBrand;
    const found = (carModelsByBrand[selectedBrand] || []).find((m) => m.value === model);
    if (found?.tariff) {
      setVehicleForm((prev) => ({ ...prev, tariff: found.tariff }));
    }
  };

  const handleTariffChange = (tariff: string) => {
    setVehicleForm((prev) => ({ ...prev, tariff }));
  };

  const handleYearChange = (option: { label: string; value: string | number }) => {
    setVehicleForm((prev) => ({ ...prev, carYear: option.value.toString() }));
    setVehicleErrors((prev: any) => ({ ...prev, carYear: undefined }));
  };

  const validateVehicle = () => {
    const errors = validateVehicleForm(vehicleForm);
    setVehicleErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveVehicle = async () => {
    if (!validateVehicle()) return;
    
    try {
      const result = await createVehicle(vehicleForm);
      if (result) {
        Alert.alert(
          t('profile.vehicles.vehicleSaved'),
          t('profile.vehicles.vehicleSaved'),
          [{ text: 'OK', onPress: () => {
            // Переходим на экран EditDriverProfile без накопления в стеке
            navigation.goBack();
          }}]
        );
      } else {
        Alert.alert(
          t('profile.vehicles.vehicleSaveError'),
          t('profile.vehicles.createError')
        );
      }
    } catch (err) {
      Alert.alert(
        t('profile.vehicles.vehicleSaveError'),
        t('profile.vehicles.createError')
      );
    }
  };



  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <View style={[styles.header, dynamicStyles.header]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={currentColors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, dynamicStyles.title]}>{t('profile.vehicles.title')}</Text>
        <View style={styles.addButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSpacing} />
        {isEditing ? (
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, dynamicStyles.label]}>{t('profile.vehicles.vehicleNumber')} <Text style={styles.requiredStar}>*</Text></Text>
              <TextInput 
                style={[styles.input, dynamicStyles.input]} 
                value={vehicleForm.vehicleNumber} 
                onChangeText={(v) => handleVehicleChange('vehicleNumber', v)} 
                placeholder={t('profile.vehicles.vehicleNumberPlaceholder')} 
                placeholderTextColor={currentColors.textSecondary}
                autoCapitalize="characters" 
              />
              {vehicleErrors.vehicleNumber && <Text style={[styles.errorText, dynamicStyles.errorText]}>{vehicleErrors.vehicleNumber}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, dynamicStyles.label]}>{t('profile.vehicles.tariff')} <Text style={styles.requiredStar}>*</Text></Text>
              <Select 
                value={vehicleForm.tariff} 
                onSelect={(option) => handleTariffChange(String(option.value))} 
                options={tariffOptions} 
                placeholder={t('profile.vehicles.tariffPlaceholder')} 
              />
              {vehicleErrors.tariff && <Text style={[styles.errorText, dynamicStyles.errorText]}>{vehicleErrors.tariff}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, dynamicStyles.label]}>{t('profile.vehicles.carBrand')} <Text style={styles.requiredStar}>*</Text></Text>
              <Select 
                value={vehicleForm.carBrand} 
                onSelect={(option) => handleBrandChange(String(option.value))} 
                options={brandOptions} 
                placeholder={t('profile.vehicles.carBrandPlaceholder')} 
                disabled={!vehicleForm.tariff} 
              />
              {vehicleErrors.carBrand && <Text style={[styles.errorText, dynamicStyles.errorText]}>{vehicleErrors.carBrand}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, dynamicStyles.label]}>{t('profile.vehicles.carModel')} <Text style={styles.requiredStar}>*</Text></Text>
              <Select 
                value={vehicleForm.carModel} 
                onSelect={(option) => handleModelChange(String(option.value))} 
                options={modelOptions} 
                placeholder={t('profile.vehicles.carModelPlaceholder')} 
                disabled={!vehicleForm.carBrand} 
              />
              {vehicleErrors.carModel && <Text style={[styles.errorText, dynamicStyles.errorText]}>{vehicleErrors.carModel}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, dynamicStyles.label]}>{t('profile.vehicles.carYear')} <Text style={styles.requiredStar}>*</Text></Text>
              <Select 
                value={vehicleForm.carYear} 
                onSelect={handleYearChange} 
                options={yearOptions} 
                placeholder={t('profile.vehicles.carYearPlaceholder')} 
              />
              {vehicleErrors.carYear && <Text style={[styles.errorText, dynamicStyles.errorText]}>{vehicleErrors.carYear}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, dynamicStyles.label]}>{t('profile.vehicles.carMileage')} <Text style={styles.requiredStar}>*</Text></Text>
              <TextInput 
                style={[styles.input, dynamicStyles.input]} 
                value={vehicleForm.carMileage} 
                onChangeText={(v) => handleVehicleChange('carMileage', v)} 
                placeholder={t('profile.vehicles.carMileagePlaceholder')} 
                placeholderTextColor={currentColors.textSecondary}
                keyboardType="numeric" 
              />
              {vehicleErrors.carMileage && <Text style={[styles.errorText, dynamicStyles.errorText]}>{vehicleErrors.carMileage}</Text>}
            </View>

            <PhotoUpload
              photo={vehiclePhoto}
              onPhotoChange={(uri) => setVehiclePhoto(uri)}
              onError={(err) => setVehicleErrors((prev: any) => ({ ...prev, vehiclePhoto: err }))}
              type="vehicle"
              uploading={uploadingPhoto === 'vehicle'}
              onUploadingChange={(flag) => setUploadingPhoto(flag ? 'vehicle' : null)}
            />
            
            <TouchableOpacity 
              style={[styles.saveButton, dynamicStyles.saveButton]} 
              onPress={handleSaveVehicle}
            >
              <Text style={[styles.saveButtonText, dynamicStyles.saveButtonText]}>
                {t('profile.vehicles.saveVehicle')}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};

export default DriverVehiclesScreen;
