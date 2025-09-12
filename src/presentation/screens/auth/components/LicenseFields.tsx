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

const LicenseFields: React.FC<Props> = ({ t, styles, formData, errors, onChange, onOpenSelect }) => {
  const [showExpiry, setShowExpiry] = useState(false);

  return (
    <>
      {/* Country Selection */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('auth.register.country')}</Text>
        <TouchableOpacity 
          style={[styles.input, styles.selectInput, errors.country && styles.inputError]}
          onPress={() => onOpenSelect('country', t('auth.register.selectCountry'))}
        >
          <Text style={[styles.selectText, !formData.country && styles.placeholderText]}>
            {formData.country || t('auth.register.selectCountry')}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#64748B" />
        </TouchableOpacity>
        {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}
      </View>

      {/* License Number */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('auth.register.licenseNumber')}</Text>
        <TextInput
          style={[styles.input, errors.licenseNumber && styles.inputError]}
          value={formData.licenseNumber || ''}
          onChangeText={(text) => onChange('licenseNumber', text)}
          placeholder={t('auth.register.licenseNumberPlaceholder')}
          placeholderTextColor="#64748B"
          autoCorrect={false}
        />
        {errors.licenseNumber && <Text style={styles.errorText}>{errors.licenseNumber}</Text>}
      </View>

      {/* License Expiry */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('auth.register.licenseExpiry')}</Text>
        <TouchableOpacity 
          style={[styles.input, styles.selectInput, errors.licenseExpiry && styles.inputError]}
          onPress={() => setShowExpiry(true)}
        >
          <Text style={[styles.selectText, !formData.licenseExpiry && styles.placeholderText]}>
            {formData.licenseExpiry || t('auth.register.selectDate')}
          </Text>
          <Ionicons name="calendar-outline" size={20} color="#64748B" />
        </TouchableOpacity>
        {errors.licenseExpiry && <Text style={styles.errorText}>{errors.licenseExpiry}</Text>}
      </View>
    </>
  );
};

export default LicenseFields;
