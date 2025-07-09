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
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types/navigation';
import { useAuth } from '../../context/AuthContext';
import { LoginScreenStyles } from '../../styles/screens/LoginScreen.styles';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import SocialAuthButtons from '../../components/SocialAuthButtons';
import { t } from '../../i18n';

type NavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface FormData {
  email: string;
  password: string;
}

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { login } = useAuth();
  
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
        console.log(t('login.loginSuccess'));
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
        console.log(`🧪 Автоматический вход как ${type}:`, email);
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
            <InputField
              label={t('login.email')}
              value={formData.email}
              onChangeText={(text) => updateFormData('email', text)}
              error={errors.email}
              placeholder={t('login.emailPlaceholder')}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <InputField
              label={t('login.password')}
              value={formData.password}
              onChangeText={(text) => updateFormData('password', text)}
              error={errors.password}
              placeholder={t('login.passwordPlaceholder')}
              secureTextEntry={!showPassword}
              rightIcon={showPassword ? 'eye-off' : 'eye'}
            />

            <TouchableOpacity 
              style={LoginScreenStyles.forgotPassword}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={LoginScreenStyles.forgotPasswordText}>
                {t('login.forgotPassword')}
              </Text>
            </TouchableOpacity>

            <Button
              title={t('login.loginButton')}
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={LoginScreenStyles.loginButton}
            />

            {/* Кнопки автозаполнения для разработки */}
            {__DEV__ && (
              <View style={LoginScreenStyles.autoFillContainer}>
                <Text style={LoginScreenStyles.autoFillTitle}>{t('login.autoFillTitle')}</Text>
                <View style={LoginScreenStyles.autoFillButtons}>
                  <TouchableOpacity
                    style={LoginScreenStyles.autoFillButton}
                    onPress={() => handleAutoFill('client')}
                  >
                    <Text style={LoginScreenStyles.autoFillButtonText}>{t('login.autoFillClient')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={LoginScreenStyles.autoFillButton}
                    onPress={() => handleAutoFill('driver')}
                  >
                    <Text style={LoginScreenStyles.autoFillButtonText}>{t('login.autoFillDriver')}</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={LoginScreenStyles.autoFillButtons}>
                  <TouchableOpacity
                    style={[LoginScreenStyles.autoFillButton, { backgroundColor: '#10B981' }]}
                    onPress={() => handleAutoLogin('client')}
                    disabled={loading}
                  >
                    <Text style={LoginScreenStyles.autoFillButtonText}>
                      {loading ? '⏳ Вход...' : '👤 Войти как клиент'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[LoginScreenStyles.autoFillButton, { backgroundColor: '#3B82F6' }]}
                    onPress={() => handleAutoLogin('driver')}
                    disabled={loading}
                  >
                    <Text style={LoginScreenStyles.autoFillButtonText}>
                      {loading ? '⏳ Вход...' : '🚗 Войти как водитель'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Divider */}
          <View style={LoginScreenStyles.divider}>
            <View style={LoginScreenStyles.dividerLine} />
            <Text style={LoginScreenStyles.dividerText}>или</Text>
            <View style={LoginScreenStyles.dividerLine} />
          </View>

          {/* Social Auth */}
          <View style={LoginScreenStyles.socialAuth}>
            <SocialAuthButtons />
          </View>

          {/* Register Link */}
          <View style={LoginScreenStyles.registerLink}>
            <Text style={LoginScreenStyles.registerText}>
              {t('login.noAccount')}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('RoleSelect')}>
              <Text style={LoginScreenStyles.registerLinkText}>
                {t('login.registerLink')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
