import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../../../../shared/hooks/useI18n';
import { EditProfileScreenStyles as styles } from '../styles/EditProfileScreen.styles';

/**
 * Personal Info Section Component
 * 
 * Form for editing personal information with verification
 */

interface PersonalInfoSectionProps {
  formData: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    birthDate: string;
  };
  setFormData: (data: any) => void;
  isEditing: boolean;
  verificationStatus: {
    email: string;
    phone: string;
  };
  isVerifying: {
    email: boolean;
    phone: boolean;
  };
  onVerifyEmail: () => void;
  onVerifyPhone: () => void;
  onResetVerification: () => void;
  isDark: boolean;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  formData,
  setFormData,
  isEditing,
  verificationStatus,
  isVerifying,
  onVerifyEmail,
  onVerifyPhone,
  onResetVerification,
  isDark
}) => {
  const { t } = useI18n();

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return 'checkmark-circle';
      case 'pending':
        return 'time';
      case 'failed':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'verified':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'failed':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  return (
    <View style={[styles.section, isDark && styles.sectionDark]}>
      <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
        {t('profile.personalInfo')}
      </Text>

      <View style={styles.formGroup}>
        <Text style={[styles.label, isDark && styles.labelDark]}>
          {t('profile.firstName')}
        </Text>
        <TextInput
          style={[
            styles.input,
            isDark && styles.inputDark,
            !isEditing && styles.inputDisabled
          ]}
          value={formData.firstName}
          onChangeText={(text) => setFormData({ ...formData, firstName: text })}
          editable={isEditing}
          placeholder={t('profile.firstNamePlaceholder')}
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, isDark && styles.labelDark]}>
          {t('profile.lastName')}
        </Text>
        <TextInput
          style={[
            styles.input,
            isDark && styles.inputDark,
            !isEditing && styles.inputDisabled
          ]}
          value={formData.lastName}
          onChangeText={(text) => setFormData({ ...formData, lastName: text })}
          editable={isEditing}
          placeholder={t('profile.lastNamePlaceholder')}
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, isDark && styles.labelDark]}>
          {t('profile.email')}
        </Text>
        <View style={styles.inputWithAction}>
          <TextInput
            style={[
              styles.input,
              isDark && styles.inputDark,
              !isEditing && styles.inputDisabled,
              styles.inputWithActionInput
            ]}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            editable={isEditing}
            placeholder={t('profile.emailPlaceholder')}
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.verificationButton}
            onPress={onVerifyEmail}
            disabled={isVerifying.email}
          >
            <Ionicons
              name={getVerificationIcon(verificationStatus.email)}
              size={20}
              color={getVerificationColor(verificationStatus.email)}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, isDark && styles.labelDark]}>
          {t('profile.phone')}
        </Text>
        <View style={styles.inputWithAction}>
          <TextInput
            style={[
              styles.input,
              isDark && styles.inputDark,
              !isEditing && styles.inputDisabled,
              styles.inputWithActionInput
            ]}
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            editable={isEditing}
            placeholder={t('profile.phonePlaceholder')}
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            keyboardType="phone-pad"
          />
          <TouchableOpacity
            style={styles.verificationButton}
            onPress={onVerifyPhone}
            disabled={isVerifying.phone}
          >
            <Ionicons
              name={getVerificationIcon(verificationStatus.phone)}
              size={20}
              color={getVerificationColor(verificationStatus.phone)}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
