/**
 * PasswordForm component
 * Form for changing password with validation
 */

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { usePasswordValidation } from '../hooks/usePasswordValidation';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { SettingsScreenStyles as styles } from '../styles/SettingsScreen.styles';
import { lightColors, darkColors } from '../../../../../../shared/constants/colors';

interface PasswordFormProps {
  onSave: (formData: any) => void;
  onCancel: () => void;
  loading: boolean;
}

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const PasswordForm: React.FC<PasswordFormProps> = ({ 
  onSave, 
  onCancel, 
  loading 
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : lightColors;
  
  const [form, setForm] = useState<FormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  
  const { validateForm, errors, setErrors } = usePasswordValidation();

  const handleChange = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = () => {
    if (validateForm(form)) {
      onSave(form);
    }
  };

  const isFormValid = form.currentPassword.trim() && 
                     form.newPassword.trim() && 
                     form.confirmPassword.trim() && 
                     form.newPassword === form.confirmPassword && 
                     form.newPassword.length >= 8 &&
                     form.currentPassword !== form.newPassword &&
                     Object.values(errors).every(error => !error);

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.formScrollView}
        contentContainerStyle={styles.formContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Password */}
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: currentColors.text }]}>
            {t('password.currentPassword')} <Text style={{ color: currentColors.error }}>*</Text>
          </Text>
          <View style={[styles.passwordInput, { 
            backgroundColor: currentColors.surface,
            borderColor: errors.currentPassword ? currentColors.error : currentColors.border
          }]}>
            <TextInput
              style={[styles.textInput, { color: currentColors.text }]}
              value={form.currentPassword}
              onChangeText={(value) => handleChange('currentPassword', value)}
              secureTextEntry={!showPasswords.current}
              placeholder={t('password.currentPasswordPlaceholder')}
              placeholderTextColor={currentColors.textSecondary}
            />
            <TouchableOpacity 
              onPress={() => togglePasswordVisibility('current')}
              style={styles.eyeButton}
            >
              <Ionicons 
                name={showPasswords.current ? "eye-off" : "eye"} 
                size={20} 
                color={currentColors.textSecondary} 
              />
            </TouchableOpacity>
          </View>
          {errors.currentPassword && (
            <Text style={[styles.errorText, { color: currentColors.error }]}>
              {errors.currentPassword}
            </Text>
          )}
        </View>

        {/* New Password */}
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: currentColors.text }]}>
            {t('password.newPassword')} <Text style={{ color: currentColors.error }}>*</Text>
          </Text>
          <View style={[styles.passwordInput, { 
            backgroundColor: currentColors.surface,
            borderColor: errors.newPassword ? currentColors.error : currentColors.border
          }]}>
            <TextInput
              style={[styles.textInput, { color: currentColors.text }]}
              value={form.newPassword}
              onChangeText={(value) => handleChange('newPassword', value)}
              secureTextEntry={!showPasswords.new}
              placeholder={t('password.newPasswordPlaceholder')}
              placeholderTextColor={currentColors.textSecondary}
            />
            <TouchableOpacity 
              onPress={() => togglePasswordVisibility('new')}
              style={styles.eyeButton}
            >
              <Ionicons 
                name={showPasswords.new ? "eye-off" : "eye"} 
                size={20} 
                color={currentColors.textSecondary} 
              />
            </TouchableOpacity>
          </View>
          {form.newPassword && (
            <PasswordStrengthIndicator 
              value={form.newPassword} 
              showFeedback={true} 
            />
          )}
          {errors.newPassword && (
            <Text style={[styles.errorText, { color: currentColors.error }]}>
              {errors.newPassword}
            </Text>
          )}
        </View>

        {/* Confirm Password */}
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: currentColors.text }]}>
            {t('password.confirmPassword')} <Text style={{ color: currentColors.error }}>*</Text>
          </Text>
          <View style={[styles.passwordInput, { 
            backgroundColor: currentColors.surface,
            borderColor: errors.confirmPassword ? currentColors.error : currentColors.border
          }]}>
            <TextInput
              style={[styles.textInput, { color: currentColors.text }]}
              value={form.confirmPassword}
              onChangeText={(value) => handleChange('confirmPassword', value)}
              secureTextEntry={!showPasswords.confirm}
              placeholder={t('password.confirmPasswordPlaceholder')}
              placeholderTextColor={currentColors.textSecondary}
            />
            <TouchableOpacity 
              onPress={() => togglePasswordVisibility('confirm')}
              style={styles.eyeButton}
            >
              <Ionicons 
                name={showPasswords.confirm ? "eye-off" : "eye"} 
                size={20} 
                color={currentColors.textSecondary} 
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && (
            <Text style={[styles.errorText, { color: currentColors.error }]}>
              {errors.confirmPassword}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Form Footer */}
      <View style={[styles.formFooter, { borderTopColor: currentColors.border }]}>
        <TouchableOpacity 
          onPress={onCancel} 
          style={[styles.cancelButton, { backgroundColor: currentColors.surface }]}
        >
          <Text style={[styles.cancelButtonText, { color: currentColors.text }]}>
            {t('password.cancel')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={handleSubmit}
          style={[
            styles.saveButton, 
            { 
              backgroundColor: isFormValid ? currentColors.primary : '#9ca3af',
              opacity: loading ? 0.7 : 1
            }
          ]}
          disabled={!isFormValid || loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? t('password.changing') : t('password.change')}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
