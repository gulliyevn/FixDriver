import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
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
    setIsResending(true);
    setError('');
    setOtpCode(['', '', '', '', '', '']);

    try {
      const response = await OTPService.resendOTP(phoneNumber);
      
      if (response.success) {
        setTimer(60);
        setCanResend(false);
        Alert.alert('📱 Код отправлен', 'Новый OTP код отправлен на ваш номер');
        inputRefs.current[0]?.focus();
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('Ошибка при повторной отправке кода');
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
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111827' : '#F9FAFB' }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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

            <View style={[styles.logoContainer, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
              <Text style={styles.logoText}>🔐</Text>
            </View>

            <Text style={[styles.title, { color: isDark ? '#F9FAFB' : '#111827' }]}>
              Подтверждение номера
            </Text>
            
            <Text style={[styles.subtitle, { color: isDark ? '#D1D5DB' : '#6B7280' }]}>
              Введите код, который мы отправили на номер{'\n'}
              <Text style={styles.phoneNumber}>
                {OTPService.formatPhoneForDisplay(phoneNumber)}
              </Text>
            </Text>

            {/* Dev Helper */}
            {__DEV__ && (
              <TouchableOpacity 
                style={styles.devButton}
                onPress={() => {
                  // Автозаполнение любым 6-значным кодом для тестирования
                  setOtpCode(['1', '2', '3', '4', '5', '6']);
                  handleVerifyOTP('123456');
                }}
              >
                <Text style={styles.devButtonText}>🚀 DEV: Автозаполнение OTP</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* OTP Input */}
          <View style={styles.otpContainer}>
            <View style={styles.otpInputsRow}>
              {otpCode.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => { inputRefs.current[index] = ref; }}
                  style={[
                    styles.otpInput,
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
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#DC2626" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
          </View>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            <Button
              title="Подтвердить"
              onPress={() => handleVerifyOTP()}
              loading={isLoading}
              disabled={otpCode.some(digit => digit === '') || isLoading}
              variant="primary"
              size="large"
              style={styles.verifyButton}
            />

            <View style={styles.resendContainer}>
              {!canResend ? (
                <Text style={[styles.timerText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  Повторная отправка через {formatTimer(timer)}
                </Text>
              ) : (
                <TouchableOpacity
                  onPress={handleResendOTP}
                  disabled={isResending}
                  style={styles.resendButton}
                >
                  <Ionicons 
                    name="refresh" 
                    size={16} 
                    color={isResending ? '#9CA3AF' : '#1E3A8A'} 
                  />
                  <Text style={[
                    styles.resendText,
                    { color: isResending ? '#9CA3AF' : '#1E3A8A' }
                  ]}>
                    {isResending ? 'Отправляем...' : 'Отправить код повторно'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.changeNumberButton}
            >
              <Text style={[styles.changeNumberText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                Изменить номер телефона
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
    zIndex: 1,
    padding: 8,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoText: {
    fontSize: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  phoneNumber: {
    fontWeight: '600',
    fontSize: 17,
  },
  otpContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  otpInputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '600',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    marginLeft: 6,
    textAlign: 'center',
  },
  actionsContainer: {
    paddingHorizontal: 20,
  },
  verifyButton: {
    marginBottom: 24,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  timerText: {
    fontSize: 14,
    textAlign: 'center',
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  changeNumberButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  changeNumberText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  devButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
  },
  devButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default OTPVerificationScreen; 