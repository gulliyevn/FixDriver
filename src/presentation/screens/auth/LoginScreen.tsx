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
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../shared/i18n';
import { Button } from '../../components';
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
      // TODO: Подключить AuthUseCase
      console.log('Login attempt:', formData);
      
      // Временная заглушка
      setTimeout(() => {
        setLoading(false);
        Alert.alert('Success', 'Login successful!');
      }, 1000);
      
    } catch (error) {
      Alert.alert(t('auth.login.loginError'), t('auth.login.loginErrorGeneric'));
      setLoading(false);
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

  const handleAutoFill = (type: 'client' | 'driver') => {
    if (type === 'client') {
      setFormData({
        email: 'client@example.com',
        password: 'password123',
      });
    } else {
      setFormData({
        email: 'driver@example.com',
        password: 'password123',
      });
    }
    setErrors({});
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword' as never);
  };

  const handleRegister = () => {
    // Reset navigation stack to avoid accumulation
    navigation.reset({
      index: 0,
      routes: [{ name: 'RoleSelect' as never }],
    });
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

            <Button
              title={t('auth.login.loginButton')}
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.loginButton}
            />

            {/* Quick Login Buttons */}
            <View style={styles.quickLoginContainer}>
              <Text style={styles.quickLoginText}>Быстрый вход:</Text>
              <View style={styles.quickLoginButtons}>
                <TouchableOpacity 
                  style={styles.quickLoginButton}
                  onPress={() => handleAutoFill('client')}
                >
                  <Text style={styles.quickLoginButtonText}>Клиент</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.quickLoginButton}
                  onPress={() => handleAutoFill('driver')}
                >
                  <Text style={styles.quickLoginButtonText}>Водитель</Text>
                </TouchableOpacity>
              </View>
            </View>
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
