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
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Validators from '../../utils/validators';
import ErrorDisplay from '../../components/ErrorDisplay';
import { AppError, ErrorHandler } from '../../utils/errorHandler';
import SocialAuthService from '../../services/SocialAuthService';
import SocialAuthButtons from '../../components/SocialAuthButtons';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const { login } = useAuth();
  const { isDark } = useTheme();

  const validateForm = (): boolean => {
    const validation = Validators.validateLogin({ email, password });
    const errors: { [key: string]: string } = {};
    
    if (validation.errors.length > 0) {
      validation.errors.forEach(error => {
        if (error.includes('Email')) errors.email = error;
        if (error.includes('Пароль')) errors.password = error;
      });
    }
    
    setValidationErrors(errors);
    setError(null);
    return validation.isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await login(email, password);
    } catch (error) {
      const appError = ErrorHandler.handleAuthError(error);
      setError(appError);
      ErrorHandler.logError(appError, 'LoginScreen');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    handleLogin();
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'Зарегистрироваться':
        navigation.navigate('RoleSelect');
        break;
      case 'Восстановить пароль':
        navigation.navigate('ForgotPassword');
        break;
      case 'Попробуйте войти снова':
        setError(null);
        break;
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await SocialAuthService.signInWithGoogle();
      
      if (result.success && result.user) {
        // Создаем пользователя из социальных данных
        const userData = SocialAuthService.createUserFromSocial(result.user);
        await login(result.user.email, 'google_auth');
      } else {
        throw new Error(result.error || 'Ошибка входа через Google');
      }
      
    } catch (error) {
      const appError = ErrorHandler.createError(
        ErrorHandler.AUTH_ERRORS.INVALID_CREDENTIALS,
        'Ошибка входа через Google',
        'Попробуйте войти через email или другой способ'
      );
      setError(appError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await SocialAuthService.signInWithFacebook();
      
      if (result.success && result.user) {
        // Создаем пользователя из социальных данных
        const userData = SocialAuthService.createUserFromSocial(result.user);
        await login(result.user.email, 'facebook_auth');
      } else {
        throw new Error(result.error || 'Ошибка входа через Facebook');
      }
      
    } catch (error) {
      const appError = ErrorHandler.createError(
        ErrorHandler.AUTH_ERRORS.INVALID_CREDENTIALS,
        'Ошибка входа через Facebook',
        'Попробуйте войти через email или другой способ'
      );
      setError(appError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await SocialAuthService.signInWithApple();
      
      if (result.success && result.user) {
        // Создаем пользователя из социальных данных
        const userData = SocialAuthService.createUserFromSocial(result.user);
        await login(result.user.email, 'apple_auth');
      } else {
        throw new Error(result.error || 'Ошибка входа через Apple');
      }
      
    } catch (error) {
      const appError = ErrorHandler.createError(
        ErrorHandler.AUTH_ERRORS.INVALID_CREDENTIALS,
        'Ошибка входа через Apple',
        'Попробуйте войти через email или другой способ'
      );
      setError(appError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail('client@fixdrive.com');
    setPassword('password123');
  };

  const handleRegister = () => {
    navigation.navigate('RoleSelect');
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
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
            <View style={[styles.logoContainer, isDark && styles.logoContainerDark]}>
              <Ionicons name="car-sport" size={60} color="#1E3A8A" />
            </View>
            <Text style={[styles.title, isDark && styles.titleDark]}>FixDrive</Text>
            <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
              Войдите в свой аккаунт
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
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
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
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
                name="lock-closed-outline" 
                size={20} 
                color={isDark ? '#9CA3AF' : '#666'} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                placeholder="Пароль"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (validationErrors.password) {
                    setValidationErrors(prev => ({ ...prev, password: '' }));
                  }
                }}
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
            {validationErrors.password && (
              <Text style={styles.errorText}>{validationErrors.password}</Text>
            )}

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
              <Text style={[styles.forgotPasswordText, isDark && styles.forgotPasswordTextDark]}>
                Забыли пароль?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            {/* Error Display */}
            <ErrorDisplay
              error={error}
              onRetry={handleRetry}
              onAction={handleAction}
              showDetails={__DEV__}
            />

            <TouchableOpacity 
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Вход...' : 'Войти'}
              </Text>
              {!isLoading && <Ionicons name="arrow-forward" size={20} color="#fff" />}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={[styles.dividerLine, isDark && styles.dividerLineDark]} />
              <Text style={[styles.dividerText, isDark && styles.dividerTextDark]}>или</Text>
              <View style={[styles.dividerLine, isDark && styles.dividerLineDark]} />
            </View>

            {/* Social Login Buttons */}
            <SocialAuthButtons
              onGooglePress={handleGoogleLogin}
              onFacebookPress={handleFacebookLogin}
              onApplePress={handleAppleLogin}
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
              Нет аккаунта? 
            </Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.linkText}>Зарегистрироваться</Text>
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
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
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
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
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
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#1E3A8A',
    fontSize: 14,
    fontWeight: '500',
  },
  forgotPasswordTextDark: {
    color: '#60A5FA',
  },
  loginButton: {
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
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
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
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16,
  },
});

export default LoginScreen;
