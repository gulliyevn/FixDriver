import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../shared/i18n';
import { Button } from '../../components';
import { AuthUseCase } from '../../../domain/usecases/auth/AuthUseCase';
import { AuthRepository } from '../../../data/repositories/AuthRepository';
import { LoginScreenStyles } from './LoginScreen.styles';

interface FormData {
  email: string;
  password: string;
}

interface LoginScreenProps {
  navigation?: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation: propNavigation }) => {
  const navigation = propNavigation || useNavigation();
  
  const { t } = useI18n();
  
  // Используем простые стили
  const styles = LoginScreenStyles;
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.email.trim()) {
      newErrors.email = t('auth.login.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.login.emailInvalid');
    }

    if (!formData.password) {
      newErrors.password = t('auth.login.passwordRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      console.log('Attempting login with:', formData.email);
      const useCase = new AuthUseCase(new AuthRepository());
      const result = await useCase.login(formData.email, formData.password, rememberMe);
      console.log('Login successful, result:', result);
      setLoading(false);
      if (!rememberMe) {
        // Если пользователь не хочет запоминаться, очищаем mock-хранилище стаба
        try {
          await AsyncStorage.multiRemove([
            '@AuthServiceStub:currentUser',
            '@AuthServiceStub:currentToken',
          ]);
        } catch {}
      }
      Alert.alert(t('common.messages.success'), t('common.messages.success'));
      // navigate to Main (with TabBar)
      // @ts-ignore - simple navigator typing
      navigation.navigate('Main');
    } catch (error) {
      console.log('Login failed with error:', error);
      setLoading(false);
      const errorMessage = error instanceof Error ? error.message : 'auth.login.loginErrorGeneric';
      
      // Show specific error message based on error type
      if (errorMessage === 'auth.login.userNotFound') {
        Alert.alert(t('auth.login.loginError'), t('auth.login.userNotFound'));
      } else if (errorMessage === 'auth.login.invalidPassword') {
        Alert.alert(t('auth.login.loginError'), t('auth.login.invalidPassword'));
      } else {
        Alert.alert(t('auth.login.loginError'), t('auth.login.loginErrorGeneric'));
      }
    }
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Очищаем ошибку при вводе
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword' as never);
  };

  const handleRegister = () => {
    navigation.navigate('RoleSelect' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.headerSpacer} />
          <View style={styles.header}>
            <Text style={styles.title}>
              {t('auth.login.title')}
            </Text>
            <Text style={styles.subtitle}>
              {t('auth.login.subtitle')}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('auth.login.email')}</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                value={formData.email}
                onChangeText={(text) => updateFormData('email', text)}
                placeholder={t('auth.login.emailPlaceholder')}
                placeholderTextColor="#64748B"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('auth.login.password')}</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.passwordInput, errors.password && styles.inputError]}
                  value={formData.password}
                  onChangeText={(text) => updateFormData('password', text)}
                  placeholder={t('auth.login.passwordPlaceholder')}
                  placeholderTextColor="#64748B"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons 
                    name={showPassword ? 'eye-off' : 'eye'} 
                    size={18} 
                    color="#64748B" 
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* Forgot Password */}
            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>
                {t('auth.login.forgotPassword')}
              </Text>
            </TouchableOpacity>

            {/* Remember Me */}
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 12 }}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={rememberMe ? 'checkbox' : 'square-outline'}
                size={18}
                color="#64748B"
              />
              <Text style={{ marginLeft: 8, color: '#64748B', fontSize: 14 }}>
                {t('auth.login.rememberMe')}
              </Text>
            </TouchableOpacity>

            <Button
              title={t('auth.login.loginButton')}
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.loginButton}
            />

          </View>



          {/* Register Link */}
          <View style={styles.registerSection}>
            <Text style={styles.registerText}>{t('auth.login.noAccount')} </Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.registerLink}>{t('auth.login.registerLink')}</Text>
            </TouchableOpacity>
          </View>

          

        </ScrollView>
      </KeyboardAvoidingView>

      
    </SafeAreaView>
  );
};

export default LoginScreen;
