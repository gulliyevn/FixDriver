import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClientScreenProps } from '../../types/navigation';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { getCurrentColors } from '../../constants/colors';
import PasswordStrengthIndicator from '../../components/PasswordStrengthIndicator';
import { ChangePasswordScreenStyles as styles, getChangePasswordScreenColors } from '../../styles/screens/profile/ChangePasswordScreen.styles';
import { ProfileService } from '../../services/ProfileService';

const ChangePasswordScreen: React.FC<ClientScreenProps<'ChangePassword'>> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const currentColors = getCurrentColors(isDark);
  const changePasswordColors = getChangePasswordScreenColors(isDark);
  
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev: any) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const newErrors: any = {};
    
    // Валидация текущего пароля
    if (!form.currentPassword.trim()) {
      newErrors.currentPassword = t('register.passwordRequired');
    }
    
    // Валидация нового пароля
    if (!form.newPassword) {
      newErrors.newPassword = t('register.passwordRequired');
    } else if (form.newPassword.length < 8) {
      newErrors.newPassword = t('register.passwordShort');
    } else if (!/(?=.*[a-z])/.test(form.newPassword)) {
      newErrors.newPassword = t('register.passwordLowercase');
    } else if (!/(?=.*[A-Z])/.test(form.newPassword)) {
      newErrors.newPassword = t('register.passwordUppercase');
    } else if (!/(?=.*\d)/.test(form.newPassword)) {
      newErrors.newPassword = t('register.passwordNumbers');
    } else if (!/(?=.*[!@#$%^&*])/.test(form.newPassword)) {
      newErrors.newPassword = t('register.passwordSpecial');
    }
    
    // Проверка совпадения паролей
    if (form.confirmPassword !== form.newPassword) {
      newErrors.confirmPassword = t('register.passwordsDontMatch');
    }
    
    // Проверка что новый пароль отличается от текущего
    if (form.currentPassword === form.newPassword) {
      newErrors.newPassword = 'Новый пароль должен отличаться от текущего';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validate()) return;
    
    setLoading(true);
    try {
      const result = await ProfileService.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      
      if (result.success) {
        Alert.alert(
          t('register.successTitle'), 
          t('profile.settings.security.passwordChangedSuccess'),
          [
            {
              text: t('register.ok'),
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        Alert.alert(
          t('register.errorTitle'), 
          result.error || t('profile.settings.security.passwordChangeError')
        );
      }
    } catch (error) {
      Alert.alert(
        t('register.errorTitle'), 
        t('profile.settings.security.passwordChangeError')
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = form.currentPassword.trim() && 
                     form.newPassword.trim() && 
                     form.confirmPassword.trim() && 
                     form.newPassword === form.confirmPassword && 
                     form.newPassword.length >= 8 &&
                     form.currentPassword !== form.newPassword;

  return (
    <KeyboardAvoidingView 
      style={[{ flex: 1 }, changePasswordColors.container]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.header, changePasswordColors.header]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={currentColors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, changePasswordColors.title]}>{t('profile.settings.security.changePassword')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Текущий пароль */}
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, changePasswordColors.inputLabel]}>
            {t('register.password')} <Text style={{ color: currentColors.error }}>*</Text>
          </Text>
          <View style={[styles.passwordInput, changePasswordColors.passwordInput]}>
            <TextInput
              style={[styles.textInput, changePasswordColors.textInput]}
              value={form.currentPassword}
              onChangeText={(v) => handleChange('currentPassword', v)}
              secureTextEntry={!showCurrentPassword}
              placeholder={t('register.passwordPlaceholder')}
              placeholderTextColor={currentColors.textSecondary}
            />
            <TouchableOpacity 
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              style={styles.eyeButton}
            >
              <Ionicons 
                name={showCurrentPassword ? "eye-off" : "eye"} 
                size={20} 
                color={currentColors.textSecondary} 
              />
            </TouchableOpacity>
          </View>
          {errors.currentPassword && <Text style={[styles.errorText, changePasswordColors.errorText]}>{errors.currentPassword}</Text>}
        </View>

        {/* Новый пароль */}
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, changePasswordColors.inputLabel]}>
            {t('register.password')} <Text style={{ color: currentColors.error }}>*</Text>
          </Text>
          <View style={[styles.passwordInput, changePasswordColors.passwordInput]}>
            <TextInput
              style={[styles.textInput, changePasswordColors.textInput]}
              value={form.newPassword}
              onChangeText={(v) => handleChange('newPassword', v)}
              secureTextEntry={!showNewPassword}
              placeholder={t('register.passwordPlaceholder')}
              placeholderTextColor={currentColors.textSecondary}
            />
            <TouchableOpacity 
              onPress={() => setShowNewPassword(!showNewPassword)}
              style={styles.eyeButton}
            >
              <Ionicons 
                name={showNewPassword ? "eye-off" : "eye"} 
                size={20} 
                color={currentColors.textSecondary} 
              />
            </TouchableOpacity>
          </View>
          {form.newPassword && <PasswordStrengthIndicator value={form.newPassword} showFeedback={true} />}
          {errors.newPassword && <Text style={[styles.errorText, changePasswordColors.errorText]}>{errors.newPassword}</Text>}
        </View>

        {/* Подтверждение пароля */}
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, changePasswordColors.inputLabel]}>
            {t('register.confirmPassword')} <Text style={{ color: currentColors.error }}>*</Text>
          </Text>
          <View style={[styles.passwordInput, changePasswordColors.passwordInput]}>
            <TextInput
              style={[styles.textInput, changePasswordColors.textInput]}
              value={form.confirmPassword}
              onChangeText={(v) => handleChange('confirmPassword', v)}
              secureTextEntry={!showConfirmPassword}
              placeholder={t('register.confirmPasswordPlaceholder')}
              placeholderTextColor={currentColors.textSecondary}
            />
            <TouchableOpacity 
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeButton}
            >
              <Ionicons 
                name={showConfirmPassword ? "eye-off" : "eye"} 
                size={20} 
                color={currentColors.textSecondary} 
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && <Text style={[styles.errorText, changePasswordColors.errorText]}>{errors.confirmPassword}</Text>}
        </View>

        {/* Кнопка изменения пароля */}
        <TouchableOpacity 
          style={[
            styles.submitButton,
            {
              backgroundColor: isFormValid ? currentColors.primary : '#9ca3af',
              opacity: loading ? 0.7 : 1
            }
          ]} 
          onPress={handleChangePassword}
          disabled={!isFormValid || loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? "Изменение пароля..." : t('profile.settings.security.changePassword')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ChangePasswordScreen; 