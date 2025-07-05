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
import { AuthService } from '../../services/AuthService';
import { LoginScreenStyles } from '../../styles/screens/LoginScreen.styles';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import SocialAuthButtons from '../../components/SocialAuthButtons';

type NavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface FormData {
  email: string;
  password: string;
}

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  
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
      newErrors.email = 'Введите email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    if (!formData.password) {
      newErrors.password = 'Введите пароль';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await AuthService.login(formData.email, formData.password);
      
      if (result.success) {
        // Успешный вход - навигация будет обработана в AuthContext
        console.log('Успешный вход');
      } else {
        Alert.alert('Ошибка', result.message || 'Неверный email или пароль');
      }
    } catch {
      Alert.alert('Ошибка', 'Произошла ошибка при входе');
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
              Добро пожаловать
            </Text>
            <Text style={LoginScreenStyles.subtitle}>
              Войдите в свой аккаунт
            </Text>
          </View>

          {/* Form */}
          <View style={LoginScreenStyles.form}>
            <InputField
              label="Email"
              value={formData.email}
              onChangeText={(text) => updateFormData('email', text)}
              error={errors.email}
              placeholder="Введите ваш email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <InputField
              label="Пароль"
              value={formData.password}
              onChangeText={(text) => updateFormData('password', text)}
              error={errors.password}
              placeholder="Введите пароль"
              secureTextEntry={!showPassword}
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons 
                    name={showPassword ? 'eye-off' : 'eye'} 
                    size={20} 
                    color="#6B7280" 
                  />
                </TouchableOpacity>
              }
            />

            <TouchableOpacity 
              style={LoginScreenStyles.forgotPassword}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={LoginScreenStyles.forgotPasswordText}>
                Забыли пароль?
              </Text>
            </TouchableOpacity>

            <Button
              title="Войти"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={LoginScreenStyles.loginButton}
            />
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
              Нет аккаунта?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('RoleSelect')}>
              <Text style={LoginScreenStyles.registerLinkText}>
                Зарегистрироваться
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
