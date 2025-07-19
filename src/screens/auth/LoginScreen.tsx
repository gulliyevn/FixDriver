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
import { LoginScreenStyles } from '../../styles/screens/LoginScreen.styles';
import Button from '../../components/Button';
import SocialAuthButtons from '../../components/SocialAuthButtons';
import { useLanguage } from '../../context/LanguageContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ServerConnectionTest } from '../../components/ServerConnectionTest';

type NavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface FormData {
  email: string;
  password: string;
}

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { login } = useAuth();
  const { t } = useLanguage();
  
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
    setLoading(true);
    try {
      const email = type === 'client' ? 'client@example.com' : 'driver@example.com';
      const password = 'password123';
      
      const success = await login(email, password);
      
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

  return (
    <SafeAreaView style={LoginScreenStyles.container}>
      <StatusBar barStyle="dark-content" />
      
      <KeyboardAvoidingView 
        style={LoginScreenStyles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={LoginScreenStyles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={LoginScreenStyles.scrollContent}
        >
          {/* Header */}
          <View style={LoginScreenStyles.headerSpacer} />
          <View style={LoginScreenStyles.header}>
            <Text style={LoginScreenStyles.title}>
              {t('login.title')}
            </Text>
            <Text style={LoginScreenStyles.subtitle}>
              {t('login.subtitle')}
            </Text>
          </View>

          {/* Form */}
          <View style={LoginScreenStyles.form}>
            <View style={LoginScreenStyles.inputContainer}>
              <Text style={LoginScreenStyles.label}>{t('login.email')}</Text>
              <TextInput
                style={LoginScreenStyles.input}
              value={formData.email}
              onChangeText={(text) => updateFormData('email', text)}
              placeholder={t('login.emailPlaceholder')}
              keyboardType="email-address"
              autoCapitalize="none"
            />
              {errors.email && (
                <Text style={LoginScreenStyles.errorText}>{errors.email}</Text>
              )}
            </View>
            
            <View style={LoginScreenStyles.inputContainer}>
              <Text style={LoginScreenStyles.label}>{t('login.password')}</Text>
              <TextInput
                style={LoginScreenStyles.input}
              value={formData.password}
              onChangeText={(text) => updateFormData('password', text)}
              placeholder={t('login.passwordPlaceholder')}
              secureTextEntry={!showPassword}
            />
              {errors.password && (
                <Text style={LoginScreenStyles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* Кнопка Забыли пароль? */}
            <TouchableOpacity 
              style={LoginScreenStyles.forgotPassword}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={LoginScreenStyles.registerLinkUnderlineDark}>
                {t('login.forgotPassword.title')}
              </Text>
            </TouchableOpacity>

            <Button
              title={t('login.loginButton')}
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={LoginScreenStyles.loginButton}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
              <TouchableOpacity onPress={() => handleAutoLogin('client')}>
                <Text style={LoginScreenStyles.registerLinkUnderlineDark}>Клиент</Text>
                  </TouchableOpacity>
              <Text style={{ marginHorizontal: 12 }}>|</Text>
              <TouchableOpacity onPress={() => handleAutoLogin('driver')}>
                <Text style={LoginScreenStyles.registerLinkUnderlineDark}>Водитель</Text>
                  </TouchableOpacity>
                </View>
          </View>

          {/* Divider */}
          <View style={LoginScreenStyles.divider}>
            <View style={LoginScreenStyles.dividerLine} />
            <Text style={LoginScreenStyles.dividerText}>{t('login.or')}</Text>
            <View style={LoginScreenStyles.dividerLine} />
          </View>

          {/* Social Auth */}
          <View style={LoginScreenStyles.socialAuth}>
            <SocialAuthButtons />
          </View>

          {/* Register Link */}
          <View style={LoginScreenStyles.registerSection}>
            <Text style={LoginScreenStyles.registerText}>{t('login.noAccount')} </Text>
            <TouchableOpacity onPress={() => navigation.reset({ index: 0, routes: [{ name: 'RoleSelect' }] })}>
              <Text style={LoginScreenStyles.registerLinkUnderlineDark}>{t('login.registerLink')}</Text>
            </TouchableOpacity>
          </View>

          {/* Server Connection Test */}
          {__DEV__ && (
            <View style={{ marginTop: 20 }}>
              <ServerConnectionTest />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
