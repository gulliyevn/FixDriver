import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DriverFormData } from './types';

interface Props {
  t: (k: string) => string;
  styles: any;
  formData: DriverFormData;
  errors: Partial<DriverFormData>;
  onChange: (field: keyof DriverFormData, value: string) => void;
  onOpenSelect: (field: keyof DriverFormData, title: string) => void;
}

const VehicleFields: React.FC<Props> = ({ t, styles, formData, errors, onChange, onOpenSelect }) => {
  const [showYear, setShowYear] = useState(false);

  return (
    <>
      {/* Vehicle Number */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('auth.register.vehicleNumber')}</Text>
        <TextInput
          style={[styles.input, errors.vehicleNumber && styles.inputError]}
          value={formData.vehicleNumber || ''}
          onChangeText={(text) => onChange('vehicleNumber', text)}
          placeholder={t('auth.register.vehicleNumberPlaceholder')}
          placeholderTextColor="#64748B"
          autoCorrect={false}
        />
        {errors.vehicleNumber && <Text style={styles.errorText}>{errors.vehicleNumber}</Text>}
      </View>

      {/* Experience */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('auth.register.experience')}</Text>
        <TouchableOpacity 
          style={[styles.input, styles.selectInput, errors.experience && styles.inputError]}
          onPress={() => onOpenSelect('experience', t('auth.register.selectExperience'))}
        >
          <Text style={[styles.selectText, !formData.experience && styles.placeholderText]}>
            {formData.experience || t('auth.register.selectExperience')}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#64748B" />
        </TouchableOpacity>
        {errors.experience && <Text style={styles.errorText}>{errors.experience}</Text>}
      </View>

      {/* Tariff */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('auth.register.tariff')}</Text>
        <TouchableOpacity 
          style={[styles.input, styles.selectInput, errors.tariff && styles.inputError]}
          onPress={() => onOpenSelect('tariff', t('auth.register.selectTariff'))}
        >
          <Text style={[styles.selectText, !formData.tariff && styles.placeholderText]}>
            {formData.tariff || t('auth.register.selectTariff')}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#64748B" />
        </TouchableOpacity>
        {errors.tariff && <Text style={styles.errorText}>{errors.tariff}</Text>}
      </View>

      {/* Car Brand */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('auth.register.carBrand')}</Text>
        <TouchableOpacity 
          style={[styles.input, styles.selectInput, errors.carBrand && styles.inputError]}
          onPress={() => onOpenSelect('carBrand', t('auth.register.selectCarBrand'))}
        >
          <Text style={[styles.selectText, !formData.carBrand && styles.placeholderText]}>
            {formData.carBrand || t('auth.register.selectCarBrand')}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#64748B" />
        </TouchableOpacity>
        {errors.carBrand && <Text style={styles.errorText}>{errors.carBrand}</Text>}
      </View>

      {/* Car Model */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('auth.register.carModel')}</Text>
        <TouchableOpacity 
          style={[styles.input, styles.selectInput, errors.carModel && styles.inputError]}
          onPress={() => onOpenSelect('carModel', t('auth.register.selectCarModel'))}
        >
          <Text style={[styles.selectText, !formData.carModel && styles.placeholderText]}>
            {formData.carModel || t('auth.register.selectCarModel')}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#64748B" />
        </TouchableOpacity>
        {errors.carModel && <Text style={styles.errorText}>{errors.carModel}</Text>}
      </View>

      {/* Car Year */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('auth.register.carYear')}</Text>
        <TouchableOpacity 
          style={[styles.input, styles.selectInput, errors.carYear && styles.inputError]}
          onPress={() => setShowYear(true)}
        >
          <Text style={[styles.selectText, !formData.carYear && styles.placeholderText]}>
            {formData.carYear || t('auth.register.selectYear')}
          </Text>
          <Ionicons name="calendar-outline" size={20} color="#64748B" />
        </TouchableOpacity>
        {errors.carYear && <Text style={styles.errorText}>{errors.carYear}</Text>}
      </View>

      {/* Car Mileage */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('auth.register.carMileage')}</Text>
        <TextInput
          style={[styles.input, errors.carMileage && styles.inputError]}
          value={formData.carMileage || ''}
          onChangeText={(text) => onChange('carMileage', text)}
          placeholder={t('auth.register.carMileagePlaceholder')}
          placeholderTextColor="#64748B"
          keyboardType="numeric"
          autoCorrect={false}
        />
        {errors.carMileage && <Text style={styles.errorText}>{errors.carMileage}</Text>}
      </View>
    </>
  );
};

export default VehicleFields;
