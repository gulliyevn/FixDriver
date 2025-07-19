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
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types/navigation';
import { useAuth } from '../../context/AuthContext';
import { createLoginScreenStyles } from '../../styles/screens/LoginScreen.styles';
import Button from '../../components/Button';
import SocialAuthButtons from '../../components/SocialAuthButtons';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';

type NavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface FormData {
  email: string;
  password: string;
}

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { login } = useAuth();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  
  // Создаем стили с учетом текущей темы
  const styles = createLoginScreenStyles(isDark);
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.email.trim()) {
      newErrors.email = t('login.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('login.emailInvalid');
    }

    if (!formData.password) {
      newErrors.password = t('login.passwordRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const success = await login(formData.email, formData.password);
      
      if (success) {
  
      } else {
        Alert.alert(t('login.loginError'), t('login.invalidCredentials'));
      }
    } catch (error) {
      Alert.alert(t('login.loginError'), t('login.loginErrorGeneric'));
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
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

  const handleAutoLogin = async (type: 'client' | 'driver') => {
    console.log('🚀 Auto login attempt for:', type);
    setLoading(true);
    try {
      const email = type === 'client' ? 'client@example.com' : 'driver@example.com';
      const password = 'password123';
      
      console.log('📧 Using credentials:', { email, password });
      
      const success = await login(email, password);
      
      console.log('✅ Login result:', success);
      
      if (success) {
        console.log('🎉 Auto login successful!');
      } else {
        console.log('❌ Auto login failed');
        Alert.alert(t('login.loginError'), t('login.invalidCredentials'));
      }
    } catch (error) {
      console.error('💥 Auto login error:', error);
      Alert.alert(t('login.loginError'), t('login.loginErrorGeneric'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
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
              {t('login.title')}
            </Text>
            <Text style={styles.subtitle}>
              {t('login.subtitle')}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('login.email')}</Text>
              <TextInput
                style={styles.input}
              value={formData.email}
              onChangeText={(text) => updateFormData('email', text)}
              placeholder={t('login.emailPlaceholder')}
              keyboardType="email-address"
              autoCapitalize="none"
            />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('login.password')}</Text>
              <TextInput
                style={styles.input}
              value={formData.password}
              onChangeText={(text) => updateFormData('password', text)}
              secureTextEntry={!showPassword}
            />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* Кнопка Забыли пароль? */}
            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.registerLinkUnderlineDark}>
                {t('login.forgotPassword.title')}
              </Text>
            </TouchableOpacity>

            <Button
              title={t('login.loginButton')}
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.loginButton}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
              <TouchableOpacity onPress={() => handleAutoLogin('client')}>
                <Text style={styles.registerLinkUnderlineDark}>Клиент</Text>
                  </TouchableOpacity>
              <Text style={{ marginHorizontal: 12 }}>|</Text>
              <TouchableOpacity onPress={() => handleAutoLogin('driver')}>
                <Text style={styles.registerLinkUnderlineDark}>Водитель</Text>
                  </TouchableOpacity>
                </View>
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t('login.or')}</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Auth */}
          <View style={styles.socialAuth}>
            <SocialAuthButtons />
          </View>

          {/* Register Link */}
          <View style={styles.registerSection}>
            <Text style={styles.registerText}>{t('login.noAccount')} </Text>
            <TouchableOpacity onPress={() => navigation.reset({ index: 0, routes: [{ name: 'RoleSelect' }] })}>
              <Text style={styles.registerLinkUnderlineDark}>{t('login.registerLink')}</Text>
            </TouchableOpacity>
          </View>


        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
