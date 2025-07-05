import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import OTPService from '../../services/OTPService';
import Button from '../../components/Button';
import { UserRole } from '../../types/user';
import { OTPVerificationScreenStyles } from '../../styles/screens/OTPVerificationScreen.styles';

interface OTPVerificationScreenProps {
  navigation: any;
  route: {
    params: {
      phoneNumber: string;
      userRole: 'client' | 'driver';
      userData?: any;
    };
  };
}

const OTPVerificationScreen: React.FC<OTPVerificationScreenProps> = ({ navigation, route }) => {
  const { isDark } = useTheme();
  const { register } = useAuth();
  const { phoneNumber, userRole, userData } = route.params;

  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Таймер для повторной отправки
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer, canResend]);

  // Отправляем OTP при загрузке экрана
  useEffect(() => {
    sendInitialOTP();
  }, []);

  const sendInitialOTP = async () => {
    setIsLoading(true);
    try {
      const response = await OTPService.sendOTP(phoneNumber);
      if (!response.success) {
        setError(response.message);
      }
    } catch (error) {
      setError('Ошибка при отправке кода');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPChange = (value: string, index: number) => {
    // Разрешаем только цифры
    if (!/^\d*$/.test(value)) return;

    const newOtpCode = [...otpCode];
    newOtpCode[index] = value;
    setOtpCode(newOtpCode);
    setError('');

    // Автоматический переход к следующему полю
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Автоматическая проверка при заполнении всех полей
    if (newOtpCode.every(digit => digit !== '') && newOtpCode.join('').length === 6) {
      handleVerifyOTP(newOtpCode.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Обработка клавиши Backspace
    if (e.nativeEvent.key === 'Backspace' && !otpCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (code?: string) => {
    const codeToVerify = code || otpCode.join('');
    
    if (codeToVerify.length !== 6) {
      setError('Введите полный 6-значный код');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await OTPService.verifyOTP(phoneNumber, codeToVerify);
      
      if (response.isValid && response.success) {
        // Успешная верификация - регистрируем пользователя
        try {
          const userInfo = {
            email: userData.email || '',
            name: userData.name || `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
            role: userRole === 'driver' ? UserRole.DRIVER : UserRole.CLIENT,
            phone: phoneNumber,
          };

          const registerSuccess = await register(userInfo, userData.password || '');
          
          if (registerSuccess) {
            Alert.alert(
              '✅ Успешно!',
              'Регистрация завершена! Добро пожаловать в FixDrive!',
              [
                {
                  text: 'Продолжить',
                  onPress: () => {
                    // AuthContext автоматически перенаправит на нужный экран
                    // navigation.reset не нужен - RootNavigator сам определит куда идти
                  },
                },
              ]
            );
          } else {
            throw new Error('Ошибка при регистрации пользователя');
          }
        } catch (error) {
          Alert.alert('Ошибка', 'Не удалось завершить регистрацию');
          console.error('Registration error after OTP:', error);
        }
      } else {
        setError(response.message);
        // Очищаем поля при ошибке
        setOtpCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      setError('Ошибка при проверке кода');
      setOtpCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setIsResending(true);
      const success = await OTPService.resendOTP(phoneNumber);
      if (success) {
        setTimer(60);
        setCanResend(false);
        Alert.alert('Успешно', 'Код подтверждения отправлен повторно');
        inputRefs.current[0]?.focus();
      } else {
        Alert.alert('Ошибка', 'Не удалось отправить код повторно');
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Произошла ошибка при отправке кода');
    } finally {
      setIsResending(false);
    }
  };

  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={[OTPVerificationScreenStyles.container, { backgroundColor: isDark ? '#111827' : '#F9FAFB' }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={OTPVerificationScreenStyles.keyboardView}
      >
        <ScrollView contentContainerStyle={OTPVerificationScreenStyles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={OTPVerificationScreenStyles.header}>
            <TouchableOpacity
              style={OTPVerificationScreenStyles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons 
                name="arrow-back" 
                size={24} 
                color={isDark ? '#F9FAFB' : '#111827'} 
              />
            </TouchableOpacity>

            <View style={[OTPVerificationScreenStyles.logoContainer, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
              <Text style={OTPVerificationScreenStyles.logoText}>🔐</Text>
            </View>

            <Text style={[OTPVerificationScreenStyles.title, { color: isDark ? '#F9FAFB' : '#111827' }]}>
              Подтверждение номера
            </Text>
            
            <Text style={[OTPVerificationScreenStyles.subtitle, { color: isDark ? '#D1D5DB' : '#6B7280' }]}>
              Введите код, который мы отправили на номер{'\n'}
              <Text style={OTPVerificationScreenStyles.phoneNumber}>
                {OTPService.formatPhoneForDisplay(phoneNumber)}
              </Text>
            </Text>

            {/* Dev Helper */}
            {__DEV__ && (
              <TouchableOpacity 
                style={OTPVerificationScreenStyles.devButton}
                onPress={() => {
                  // Автозаполнение любым 6-значным кодом для тестирования
                  setOtpCode(['1', '2', '3', '4', '5', '6']);
                  handleVerifyOTP('123456');
                }}
              >
                <Text style={OTPVerificationScreenStyles.devButtonText}>🚀 DEV: Автозаполнение OTP</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* OTP Input */}
          <View style={OTPVerificationScreenStyles.otpContainer}>
            <View style={OTPVerificationScreenStyles.otpInputsRow}>
              {otpCode.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => { inputRefs.current[index] = ref; }}
                  style={[
                    OTPVerificationScreenStyles.otpInput,
                    {
                      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                      borderColor: error 
                        ? '#DC2626' 
                        : digit 
                        ? '#10B981' 
                        : isDark ? '#374151' : '#D1D5DB',
                      color: isDark ? '#F9FAFB' : '#111827',
                    },
                  ]}
                  value={digit}
                  onChangeText={(value) => handleOTPChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  textAlign="center"
                  selectTextOnFocus
                  editable={!isLoading}
                />
              ))}
            </View>

            {error ? (
              <View style={OTPVerificationScreenStyles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#DC2626" />
                <Text style={OTPVerificationScreenStyles.errorText}>{error}</Text>
              </View>
            ) : null}
          </View>

          {/* Actions */}
          <View style={OTPVerificationScreenStyles.actionsContainer}>
            <Button
              title="Подтвердить"
              onPress={() => handleVerifyOTP()}
              loading={isLoading}
              disabled={otpCode.some(digit => digit === '') || isLoading}
              variant="primary"
              size="large"
              style={OTPVerificationScreenStyles.verifyButton}
            />

            <View style={OTPVerificationScreenStyles.resendContainer}>
              {!canResend ? (
                <Text style={[OTPVerificationScreenStyles.timerText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  Повторная отправка через {formatTimer(timer)}
                </Text>
              ) : (
                <TouchableOpacity
                  onPress={handleResendOTP}
                  disabled={isResending}
                  style={OTPVerificationScreenStyles.resendButton}
                >
                  <Ionicons 
                    name="refresh" 
                    size={16} 
                    color={isResending ? '#9CA3AF' : '#1E3A8A'} 
                  />
                  <Text style={[
                    OTPVerificationScreenStyles.resendText,
                    { color: isResending ? '#9CA3AF' : '#1E3A8A' }
                  ]}>
                    {isResending ? 'Отправляем...' : 'Отправить код повторно'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={OTPVerificationScreenStyles.changeNumberButton}
            >
              <Text style={[OTPVerificationScreenStyles.changeNumberText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                Изменить номер телефона
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OTPVerificationScreen; 