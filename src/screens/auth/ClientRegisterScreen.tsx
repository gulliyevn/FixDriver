import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Modal,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import Validators, { PasswordStrength } from '../../utils/validators';
import ErrorDisplay from '../../components/ErrorDisplay';
import PasswordStrengthIndicator from '../../components/PasswordStrengthIndicator';
import { AppError, ErrorHandler } from '../../utils/errorHandler';
import SocialAuthService from '../../services/SocialAuthService';
import SocialAuthButtons from '../../components/SocialAuthButtons';
import { useAuth } from '../../context/AuthContext';
import AuthService from '../../services/AuthService';

interface ClientRegisterScreenProps {
  navigation: any;
}

const ClientRegisterScreen: React.FC<ClientRegisterScreenProps> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToPrivacy, setAgreeToPrivacy] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);

  const validateForm = (): boolean => {
    const validation = Validators.validateClientRegistration(formData);
    const errors: { [key: string]: string } = {};
    
    if (validation.errors.length > 0) {
      validation.errors.forEach(error => {
        if (error.includes('Имя')) errors.name = error;
        if (error.includes('Фамилия')) errors.surname = error;
        if (error.includes('email') || error.includes('Email')) errors.email = error;
        if (error.includes('телефон') || error.includes('Телефон')) errors.phone = error;
        if (error.includes('пароль') || error.includes('Пароль')) errors.password = error;
        if (error.includes('совпадают')) errors.confirmPassword = error;
      });
    }
    
    setValidationErrors(errors);
    setError(null);
    return validation.isValid;
  };

  const handlePasswordChange = (password: string) => {
    setFormData(prev => ({ ...prev, password }));
    setPasswordStrength(Validators.getPasswordStrength(password));
    if (validationErrors.password) {
      setValidationErrors(prev => ({ ...prev, password: '' }));
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    if (!agreeToTerms || !agreeToPrivacy) {
      setError(ErrorHandler.createError(
        ErrorHandler.VALIDATION_ERRORS.MISSING_FIELDS,
        'Необходимо согласиться с условиями',
        'Отметьте все необходимые согласия'
      ));
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Симуляция регистрации
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Переходим на экран OTP верификации
      navigation.navigate('OTPVerification' as never, {
        phoneNumber: formData.phone,
        userRole: 'client',
        userData: { 
          name: formData.name, 
          surname: formData.surname, 
          email: formData.email, 
          phone: formData.phone,
          password: formData.password
        },
      } as never);
    } catch (error) {
      const appError = ErrorHandler.handleAuthError(error);
      setError(appError);
      ErrorHandler.logError(appError, 'ClientRegisterScreen');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    handleRegister();
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'Войти':
        navigation.navigate('Login');
        break;
      case 'Проверить данные':
        setError(null);
        break;
    }
  };

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGoogleRegister = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await SocialAuthService.signInWithGoogle();
      
      if (result.success && result.user) {
        // Проверяем, существует ли пользователь
        const userExists = await checkUserExists(result.user.email);
        
        if (userExists) {
          // Пользователь существует - выполняем вход
          console.log('🔍 Пользователь найден, выполняем вход');
          await login(result.user.email, 'SecurePass123!', 'google_auth');
        } else {
          // Пользователь не существует - выполняем регистрацию
          console.log('🆕 Новый пользователь, выполняем регистрацию');
          await registerSocialUser(result.user);
        }
      } else {
        throw new Error(result.error || 'Ошибка входа через Google');
      }
      
    } catch (error) {
      const appError = ErrorHandler.createError(
        ErrorHandler.AUTH_ERRORS.INVALID_CREDENTIALS,
        'Ошибка входа через Google',
        'Попробуйте другой способ регистрации'
      );
      setError(appError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookRegister = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await SocialAuthService.signInWithFacebook();
      
      if (result.success && result.user) {
        // Проверяем, существует ли пользователь
        const userExists = await checkUserExists(result.user.email);
        
        if (userExists) {
          // Пользователь существует - выполняем вход
          console.log('🔍 Пользователь найден, выполняем вход');
          await login(result.user.email, 'SecurePass123!', 'facebook_auth');
        } else {
          // Пользователь не существует - выполняем регистрацию
          console.log('🆕 Новый пользователь, выполняем регистрацию');
          await registerSocialUser(result.user);
        }
      } else {
        throw new Error(result.error || 'Ошибка входа через Facebook');
      }
      
    } catch (error) {
      const appError = ErrorHandler.createError(
        ErrorHandler.AUTH_ERRORS.INVALID_CREDENTIALS,
        'Ошибка входа через Facebook',
        'Попробуйте другой способ регистрации'
      );
      setError(appError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleRegister = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await SocialAuthService.signInWithApple();
      
      if (result.success && result.user) {
        // Проверяем, существует ли пользователь
        const userExists = await checkUserExists(result.user.email);
        
        if (userExists) {
          // Пользователь существует - выполняем вход
          console.log('🔍 Пользователь найден, выполняем вход');
          await login(result.user.email, 'SecurePass123!', 'apple_auth');
        } else {
          // Пользователь не существует - выполняем регистрацию
          console.log('🆕 Новый пользователь, выполняем регистрацию');
          await registerSocialUser(result.user);
        }
      } else {
        throw new Error(result.error || 'Ошибка входа через Apple');
      }
      
    } catch (error) {
      const appError = ErrorHandler.createError(
        ErrorHandler.AUTH_ERRORS.INVALID_CREDENTIALS,
        'Ошибка входа через Apple',
        'Попробуйте другой способ регистрации'
      );
      setError(appError);
    } finally {
      setIsLoading(false);
    }
  };

  // Проверка существования пользователя
  const checkUserExists = async (email: string): Promise<boolean> => {
    return await AuthService.checkUserExists(email);
  };

  // Регистрация социального пользователя
  const registerSocialUser = async (socialUser: any) => {
    try {
      const result = await AuthService.registerWithSocial(socialUser);
      
      // Успешная регистрация - пользователь автоматически входит в систему
      console.log('✅ Социальная регистрация успешна:', {
        provider: socialUser.provider,
        email: socialUser.email
      });
      
      // Можно добавить дополнительную логику, например переход на главный экран
      // navigation.navigate('Main');
      
    } catch (error) {
      console.error('❌ Ошибка социальной регистрации:', error);
      throw error;
    }
  };

  const handleQuickFill = () => {
    setFormData({
      name: 'Nicat',
      surname: 'Quliyev',
      email: 'client@fixdrive.com',
      phone: '+994516995513',
      password: 'password123',
      confirmPassword: 'password123'
    });
  };

  const handleSupportChat = () => {
    const whatsappNumber = '+994516995513';
    const message = 'Здравствуйте! У меня вопрос по регистрации клиента в приложении FixDrive.';
    const whatsappUrl = `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(whatsappUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(whatsappUrl);
        } else {
          // Fallback to web WhatsApp
          const webWhatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
          return Linking.openURL(webWhatsappUrl);
        }
      })
      .catch((err) => {
        console.error('Error opening WhatsApp:', err);
        Alert.alert('Ошибка', 'Не удалось открыть WhatsApp. Попробуйте связаться с нами по телефону: +994516995513');
      });
  };



  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons 
                name="arrow-back" 
                size={24} 
                color={isDark ? '#F9FAFB' : '#111827'} 
              />
            </TouchableOpacity>
            <View style={[styles.logoContainer, isDark && styles.logoContainerDark]}>
              <Ionicons name="person-add" size={48} color="#1E3A8A" />
            </View>
            <Text style={[styles.title, isDark && styles.titleDark]}>
              Регистрация клиента
            </Text>
            <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
              Создайте аккаунт для заказа поездок
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }, isDark && styles.inputContainerDark]}>
                <Ionicons 
                  name="person-outline" 
                  size={20} 
                  color={isDark ? '#9CA3AF' : '#666'} 
                  style={styles.inputIcon} 
                />
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  placeholder="Имя"
                  value={formData.name}
                  onChangeText={(value) => {
                    updateFormData('name', value);
                    if (validationErrors.name) {
                      setValidationErrors(prev => ({ ...prev, name: '' }));
                    }
                  }}
                  placeholderTextColor={isDark ? '#6B7280' : '#999'}
                />
              </View>
              <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }, isDark && styles.inputContainerDark]}>
                <Ionicons 
                  name="person-outline" 
                  size={20} 
                  color={isDark ? '#9CA3AF' : '#666'} 
                  style={styles.inputIcon} 
                />
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  placeholder="Фамилия"
                  value={formData.surname}
                  onChangeText={(value) => {
                    updateFormData('surname', value);
                    if (validationErrors.surname) {
                      setValidationErrors(prev => ({ ...prev, surname: '' }));
                    }
                  }}
                  placeholderTextColor={isDark ? '#6B7280' : '#999'}
                />
              </View>
            </View>
            {(validationErrors.name || validationErrors.surname) && (
              <View style={styles.errorRow}>
                {validationErrors.name && <Text style={styles.errorText}>{validationErrors.name}</Text>}
                {validationErrors.surname && <Text style={styles.errorText}>{validationErrors.surname}</Text>}
              </View>
            )}

            <View style={[styles.inputContainer, isDark && styles.inputContainerDark]}>
              <Ionicons 
                name="mail-outline" 
                size={20} 
                color={isDark ? '#9CA3AF' : '#666'} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                placeholder="Email"
                value={formData.email}
                onChangeText={(value) => {
                  updateFormData('email', value);
                  if (validationErrors.email) {
                    setValidationErrors(prev => ({ ...prev, email: '' }));
                  }
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={isDark ? '#6B7280' : '#999'}
              />
            </View>
            {validationErrors.email && (
              <Text style={styles.errorText}>{validationErrors.email}</Text>
            )}

            <View style={[styles.inputContainer, isDark && styles.inputContainerDark]}>
              <Ionicons 
                name="call-outline" 
                size={20} 
                color={isDark ? '#9CA3AF' : '#666'} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                placeholder="Телефон"
                value={formData.phone}
                onChangeText={(value) => {
                  updateFormData('phone', value);
                  if (validationErrors.phone) {
                    setValidationErrors(prev => ({ ...prev, phone: '' }));
                  }
                }}
                keyboardType="phone-pad"
                placeholderTextColor={isDark ? '#6B7280' : '#999'}
              />
            </View>
            {validationErrors.phone && (
              <Text style={styles.errorText}>{validationErrors.phone}</Text>
            )}

            <View style={[styles.inputContainer, isDark && styles.inputContainerDark]}>
              <Ionicons 
                name="lock-closed-outline" 
                size={20} 
                color={isDark ? '#9CA3AF' : '#666'} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                placeholder="Пароль"
                value={formData.password}
                onChangeText={handlePasswordChange}
                secureTextEntry={!showPassword}
                placeholderTextColor={isDark ? '#6B7280' : '#999'}
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color={isDark ? '#9CA3AF' : '#666'} 
                />
              </TouchableOpacity>
            </View>
            {passwordStrength && (
              <PasswordStrengthIndicator
                strength={passwordStrength}
                showFeedback={true}
              />
            )}
            {validationErrors.password && (
              <Text style={styles.errorText}>{validationErrors.password}</Text>
            )}

            <View style={[styles.inputContainer, isDark && styles.inputContainerDark]}>
              <Ionicons 
                name="lock-closed-outline" 
                size={20} 
                color={isDark ? '#9CA3AF' : '#666'} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                placeholder="Подтвердите пароль"
                value={formData.confirmPassword}
                onChangeText={(value) => {
                  updateFormData('confirmPassword', value);
                  if (validationErrors.confirmPassword) {
                    setValidationErrors(prev => ({ ...prev, confirmPassword: '' }));
                  }
                }}
                secureTextEntry={!showConfirmPassword}
                placeholderTextColor={isDark ? '#6B7280' : '#999'}
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color={isDark ? '#9CA3AF' : '#666'} 
                />
              </TouchableOpacity>
            </View>
            {validationErrors.confirmPassword && (
              <Text style={styles.errorText}>{validationErrors.confirmPassword}</Text>
            )}

            {/* Agreement Checkbox */}
            <View style={styles.agreementSection}>
              <TouchableOpacity 
                style={styles.checkboxContainer}
                onPress={() => {
                  const newValue = !(agreeToTerms && agreeToPrivacy);
                  setAgreeToTerms(newValue);
                  setAgreeToPrivacy(newValue);
                }}
              >
                <View style={[styles.checkbox, (agreeToTerms && agreeToPrivacy) && styles.checkboxChecked]}>
                  {(agreeToTerms && agreeToPrivacy) && <Ionicons name="checkmark" size={16} color="#fff" />}
                </View>
                <Text style={[styles.checkboxText, isDark && styles.checkboxTextDark]}>
                  Я согласен с{' '}
                  <Text 
                    style={[styles.linkText, styles.underlineText]}
                    onPress={(e) => {
                      e.stopPropagation();
                      setShowTermsModal(true);
                    }}
                  >
                    Условиями
                  </Text>
                  {' '}и{' '}
                  <Text 
                    style={[styles.linkText, styles.underlineText]}
                    onPress={(e) => {
                      e.stopPropagation();
                      setShowPrivacyModal(true);
                    }}
                  >
                    Политикой Конфиденциальности
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>

            {/* Error Display */}
            <ErrorDisplay
              error={error}
              onRetry={handleRetry}
              onAction={handleAction}
              showDetails={__DEV__}
            />

            {/* Register Button */}
            <TouchableOpacity 
              style={[
                styles.registerButton, 
                styles.clientRegisterButton,
                isLoading && styles.registerButtonDisabled,
                (!agreeToTerms || !agreeToPrivacy) && styles.registerButtonDisabled
              ]} 
              onPress={handleRegister}
              disabled={isLoading || !agreeToTerms || !agreeToPrivacy}
            >
              <Text style={styles.registerButtonText}>
                {isLoading ? 'Создание аккаунта...' : 'Создать аккаунт'}
              </Text>
              {!isLoading && <Ionicons name="arrow-forward" size={20} color="#fff" />}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={[styles.dividerLine, isDark && styles.dividerLineDark]} />
              <Text style={[styles.dividerText, isDark && styles.dividerTextDark]}>или</Text>
              <View style={[styles.dividerLine, isDark && styles.dividerLineDark]} />
            </View>

            {/* Social Register Buttons */}
            <SocialAuthButtons
              onGooglePress={handleGoogleRegister}
              onFacebookPress={handleFacebookRegister}
              onApplePress={handleAppleRegister}
              isLoading={isLoading}
              disabled={isLoading}
            />

            {/* Quick Fill Button */}
            <TouchableOpacity style={styles.quickFillButton} onPress={handleQuickFill}>
              <Text style={[styles.quickFillText, isDark && styles.quickFillTextDark]}>
                Быстрое заполнение
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, isDark && styles.footerTextDark]}>
              Уже есть аккаунт? 
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
              <Text style={styles.linkText}>Войти</Text>
            </TouchableOpacity>
          </View>

          {/* Help Section */}
          <View style={styles.helpSection}>
            <Text style={[styles.helpTitle, isDark && styles.helpTitleDark]}>
              Нужна помощь?
            </Text>
            <TouchableOpacity style={styles.helpButton} onPress={handleSupportChat}>
              <Ionicons
                name="logo-whatsapp"
                size={16}
                color="#25D366"
              />
              <Text style={styles.helpButtonText}>Связаться с поддержкой</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Terms of Service Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showTermsModal}
        onRequestClose={() => setShowTermsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, isDark && styles.modalContainerDark]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDark && styles.modalTitleDark]}>
                Условия использования
              </Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowTermsModal(false)}
              >
                <Ionicons name="close" size={24} color={isDark ? '#F9FAFB' : '#111827'} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalText, isDark && styles.modalTextDark]}>
                Добро пожаловать в FixDrive!{'\n\n'}
                
                Используя наш сервис, вы соглашаетесь с следующими условиями:{'\n\n'}
                
                1. FixDrive предоставляет услуги по организации персональных поездок{'\n\n'}
                
                2. Вы обязуетесь предоставлять достоверную информацию при регистрации{'\n\n'}
                
                3. Оплата услуг производится через безопасные платежные системы{'\n\n'}
                
                4. Мы гарантируем безопасность ваших поездок и конфиденциальность данных{'\n\n'}
                
                5. В случае отмены поездки менее чем за 30 минут может взиматься штраф{'\n\n'}
                
                6. Мы оставляем за собой право изменять условия с уведомлением пользователей{'\n\n'}
                
                Полная версия условий доступна на нашем сайте.
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={[styles.modalButton, styles.clientModalButton]}
              onPress={() => setShowTermsModal(false)}
            >
              <Text style={styles.modalButtonText}>Понятно</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPrivacyModal}
        onRequestClose={() => setShowPrivacyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, isDark && styles.modalContainerDark]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDark && styles.modalTitleDark]}>
                Политика конфиденциальности
              </Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowPrivacyModal(false)}
              >
                <Ionicons name="close" size={24} color={isDark ? '#F9FAFB' : '#111827'} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalText, isDark && styles.modalTextDark]}>
                📜 Privacy Policy FixDrive{'\n\n'}
                
                1️⃣ Кто мы{'\n'}
                FixDrive — сервис персональных водителей по расписанию.{'\n'}
                Официальный оператор данных: FixDrive LLC, support@fixdrive.com{'\n\n'}
                
                2️⃣ Какие данные мы собираем{'\n'}
                ✅ Данные профиля: имя, номер телефона, email, платёжная информация{'\n'}
                ✅ Данные поездок: даты, время бронирования, маршрут (геолокация){'\n'}
                ✅ Данные устройств: IP-адрес, модель телефона, операционная система{'\n'}
                ✅ Логи взаимодействия: клики, бронирования, история отмен{'\n'}
                ✅ Данные водителей: рейтинг, количество выполненных поездок{'\n\n'}
                
                3️⃣ Для чего мы используем данные{'\n'}
                • Для предоставления сервиса FixDrive: бронирование и выполнение поездок{'\n'}
                • Для улучшения качества сервиса и персональных рекомендаций (ML){'\n'}
                • Для связи с клиентом (уведомления о поездке, чаты){'\n'}
                • Для аналитики и исследования спроса (анонимно){'\n'}
                • Для соблюдения закона и защиты прав всех сторон{'\n\n'}
                
                4️⃣ С кем мы делимся данными{'\n'}
                • С водителями FixDrive: только имя и контакт для связи по заказу{'\n'}
                • С платёжными системами (Stripe) — для обработки оплаты{'\n'}
                • С государственными органами — только по требованию закона{'\n'}
                • С партнёрами — только агрегированные данные без идентификации личности{'\n\n'}
                
                5️⃣ Как мы защищаем данные{'\n'}
                • Используем HTTPS, шифрование и аутентификацию доступа{'\n'}
                • Храним данные только на защищённых серверах{'\n'}
                • Доступ к полным данным имеют только уполномоченные сотрудники{'\n\n'}
                
                6️⃣ Хранение данных{'\n'}
                Мы храним ваши данные не дольше, чем это необходимо для целей обработки или согласно закону.{'\n'}
                При необходимости вы можете запросить удаление данных, написав нам: support@fixdrive.com{'\n\n'}
                
                7️⃣ Ваши права{'\n'}
                • Право знать, что мы храним{'\n'}
                • Право запросить копию ваших данных{'\n'}
                • Право исправить или удалить данные{'\n'}
                • Право отозвать согласие на обработку{'\n\n'}
                
                8️⃣ Контакты{'\n'}
                По любым вопросам пишите: support@fixdrive.com, +994516995513{'\n\n'}
                
                Обновлено: Декабрь 2024
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={[styles.modalButton, styles.clientModalButton]}
              onPress={() => setShowPrivacyModal(false)}
            >
              <Text style={styles.modalButtonText}>Понятно</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 8,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  logoContainerDark: {
    backgroundColor: '#374151',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  titleDark: {
    color: '#F9FAFB',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  subtitleDark: {
    color: '#9CA3AF',
  },
  form: {
    marginBottom: 30,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputContainerDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  inputDark: {
    color: '#F9FAFB',
  },
  eyeButton: {
    padding: 4,
  },
  registerButton: {
    backgroundColor: '#1E3A8A',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerLineDark: {
    backgroundColor: '#4B5563',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  dividerTextDark: {
    color: '#9CA3AF',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  socialButtonDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  googleButton: {
    marginRight: 8,
  },
  facebookButton: {
    marginLeft: 8,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  socialButtonTextDark: {
    color: '#D1D5DB',
  },
  quickFillButton: {
    alignItems: 'center',
    marginTop: 8,
  },
  quickFillText: {
    color: '#1E3A8A',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  quickFillTextDark: {
    color: '#60A5FA',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  footerText: {
    color: '#6B7280',
    fontSize: 16,
  },
  footerTextDark: {
    color: '#9CA3AF',
  },
  linkText: {
    color: '#1E3A8A',
    fontSize: 16,
    fontWeight: '600',
  },
  underlineText: {
    textDecorationLine: 'underline',
  },
  helpSection: {
    alignItems: 'center',
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  helpTitleDark: {
    color: '#D1D5DB',
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  helpButtonText: {
    color: '#1E3A8A',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  // Agreement Section Styles
  agreementSection: {
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#27ae60',
    borderColor: '#27ae60',
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  checkboxTextDark: {
    color: '#D1D5DB',
  },
  // Client Button Color
  clientRegisterButton: {
    backgroundColor: '#27ae60',
    shadowColor: '#27ae60',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxHeight: '80%',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  modalContainerDark: {
    backgroundColor: '#1F2937',
    borderColor: '#4B5563',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  modalTitleDark: {
    color: '#F9FAFB',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
    maxHeight: 400,
  },
  modalText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  modalTextDark: {
    color: '#D1D5DB',
  },
  modalButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    margin: 20,
    marginTop: 0,
  },
  clientModalButton: {
    backgroundColor: '#27ae60',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
    flex: 1,
  },
});

export default ClientRegisterScreen;
