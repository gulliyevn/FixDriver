import React, { useState, useEffect } from 'react';
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
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types/navigation';
import { AuthService } from '../../services/AuthService';
import { countries } from '../../utils/countries';
import { ClientRegisterScreenStyles } from '../../styles/screens/ClientRegisterScreen.styles';
import InputField from '../../components/InputField';
import Select from '../../components/Select';
import PhoneInput from '../../components/PhoneInput';
import Button from '../../components/Button';
import PasswordStrengthIndicator from '../../components/PasswordStrengthIndicator';

type NavigationProp = StackNavigationProp<AuthStackParamList, 'ClientRegister'>;

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  country: string;
  city: string;
  address: string;
  birthDate: string;
  gender: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  preferences: {
    notifications: boolean;
    marketing: boolean;
    terms: boolean;
  };
}

const ClientRegisterScreen: React.FC = () => {
  const { isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    country: '',
    city: '',
    address: '',
    birthDate: '',
    gender: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
    },
    preferences: {
      notifications: true,
      marketing: false,
      terms: false,
    },
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const countryOptions = countries.map(country => ({
    label: country.name,
    value: country.code,
  }));

  const genderOptions = [
    { label: 'Мужской', value: 'male' },
    { label: 'Женский', value: 'female' },
    { label: 'Другой', value: 'other' },
  ];

  const relationshipOptions = [
    { label: 'Супруг/Супруга', value: 'spouse' },
    { label: 'Родитель', value: 'parent' },
    { label: 'Ребенок', value: 'child' },
    { label: 'Друг', value: 'friend' },
    { label: 'Коллега', value: 'colleague' },
    { label: 'Другой', value: 'other' },
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {};

    switch (step) {
      case 1:
        if (!formData.firstName.trim()) {
          newErrors.firstName = 'Введите имя';
        }
        if (!formData.lastName.trim()) {
          newErrors.lastName = 'Введите фамилию';
        }
        if (!formData.email.trim()) {
          newErrors.email = 'Введите email';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Введите корректный email';
        }
        if (!formData.phone.trim()) {
          newErrors.phone = 'Введите номер телефона';
        }
        break;

      case 2:
        if (!formData.password) {
          newErrors.password = 'Введите пароль';
        } else if (formData.password.length < 8) {
          newErrors.password = 'Пароль должен содержать минимум 8 символов';
        }
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = 'Подтвердите пароль';
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Пароли не совпадают';
        }
        break;

      case 3:
        if (!formData.country) {
          newErrors.country = 'Выберите страну';
        }
        if (!formData.city.trim()) {
          newErrors.city = 'Введите город';
        }
        if (!formData.address.trim()) {
          newErrors.address = 'Введите адрес';
        }
        break;

      case 4:
        if (!formData.birthDate) {
          newErrors.birthDate = 'Выберите дату рождения';
        }
        if (!formData.gender) {
          newErrors.gender = 'Выберите пол';
        }
        break;

      case 5:
        if (!formData.emergencyContact.name.trim()) {
          newErrors.emergencyContact = { ...newErrors.emergencyContact, name: 'Введите имя контакта' };
        }
        if (!formData.emergencyContact.phone.trim()) {
          newErrors.emergencyContact = { ...newErrors.emergencyContact, phone: 'Введите телефон контакта' };
        }
        if (!formData.emergencyContact.relationship) {
          newErrors.emergencyContact = { ...newErrors.emergencyContact, relationship: 'Выберите отношение' };
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      } else {
        handleRegister();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRegister = async () => {
    if (!validateStep(5)) return;

    setLoading(true);
    try {
      const result = await AuthService.registerClient({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        country: formData.country,
        city: formData.city,
        address: formData.address,
        birthDate: formData.birthDate,
        gender: formData.gender,
        emergencyContact: formData.emergencyContact,
        preferences: formData.preferences,
      });

      if (result.success) {
        Alert.alert(
          'Успешная регистрация',
          'Проверьте ваш email для подтверждения аккаунта',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login'),
            },
          ]
        );
      } else {
        Alert.alert('Ошибка', result.message || 'Не удалось зарегистрироваться');
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Произошла ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateEmergencyContact = (field: keyof FormData['emergencyContact'], value: string) => {
    setFormData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value,
      },
    }));
  };

  const updatePreferences = (field: keyof FormData['preferences'], value: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value,
      },
    }));
  };

  const renderStep1 = () => (
    <View style={ClientRegisterScreenStyles.stepContainer}>
      <Text style={[ClientRegisterScreenStyles.stepTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
        Основная информация
      </Text>
      
      <InputField
        label="Имя"
        value={formData.firstName}
        onChangeText={(text) => updateFormData('firstName', text)}
        error={errors.firstName}
        placeholder="Введите ваше имя"
      />
      
      <InputField
        label="Фамилия"
        value={formData.lastName}
        onChangeText={(text) => updateFormData('lastName', text)}
        error={errors.lastName}
        placeholder="Введите вашу фамилию"
      />
      
      <InputField
        label="Email"
        value={formData.email}
        onChangeText={(text) => updateFormData('email', text)}
        error={errors.email}
        placeholder="example@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <PhoneInput
        label="Номер телефона"
        value={formData.phone}
        onChangeText={(text) => updateFormData('phone', text)}
        error={errors.phone}
        country={formData.country}
        onCountryChange={(country) => updateFormData('country', country)}
      />
    </View>
  );

  const renderStep2 = () => (
    <View style={ClientRegisterScreenStyles.stepContainer}>
      <Text style={[ClientRegisterScreenStyles.stepTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
        Безопасность
      </Text>
      
      <InputField
        label="Пароль"
        value={formData.password}
        onChangeText={(text) => updateFormData('password', text)}
        error={errors.password}
        placeholder="Создайте пароль"
        secureTextEntry={!showPassword}
        rightIcon={
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons 
              name={showPassword ? 'eye-off' : 'eye'} 
              size={20} 
              color={isDark ? '#9CA3AF' : '#6B7280'} 
            />
          </TouchableOpacity>
        }
      />
      
      <PasswordStrengthIndicator password={formData.password} />
      
      <InputField
        label="Подтвердите пароль"
        value={formData.confirmPassword}
        onChangeText={(text) => updateFormData('confirmPassword', text)}
        error={errors.confirmPassword}
        placeholder="Повторите пароль"
        secureTextEntry={!showConfirmPassword}
        rightIcon={
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons 
              name={showConfirmPassword ? 'eye-off' : 'eye'} 
              size={20} 
              color={isDark ? '#9CA3AF' : '#6B7280'} 
            />
          </TouchableOpacity>
        }
      />
    </View>
  );

  const renderStep3 = () => (
    <View style={ClientRegisterScreenStyles.stepContainer}>
      <Text style={[ClientRegisterScreenStyles.stepTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
        Адрес
      </Text>
      
      <Select
        label="Страна"
        value={formData.country}
        onValueChange={(value) => updateFormData('country', value)}
        options={countryOptions}
        error={errors.country}
        placeholder="Выберите страну"
      />
      
      <InputField
        label="Город"
        value={formData.city}
        onChangeText={(text) => updateFormData('city', text)}
        error={errors.city}
        placeholder="Введите город"
      />
      
      <InputField
        label="Адрес"
        value={formData.address}
        onChangeText={(text) => updateFormData('address', text)}
        error={errors.address}
        placeholder="Введите полный адрес"
        multiline
        numberOfLines={3}
      />
    </View>
  );

  const renderStep4 = () => (
    <View style={ClientRegisterScreenStyles.stepContainer}>
      <Text style={[ClientRegisterScreenStyles.stepTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
        Личная информация
      </Text>
      
      <InputField
        label="Дата рождения"
        value={formData.birthDate}
        onChangeText={(text) => updateFormData('birthDate', text)}
        error={errors.birthDate}
        placeholder="ДД.ММ.ГГГГ"
      />
      
      <Select
        label="Пол"
        value={formData.gender}
        onValueChange={(value) => updateFormData('gender', value)}
        options={genderOptions}
        error={errors.gender}
        placeholder="Выберите пол"
      />
    </View>
  );

  const renderStep5 = () => (
    <View style={ClientRegisterScreenStyles.stepContainer}>
      <Text style={[ClientRegisterScreenStyles.stepTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
        Экстренный контакт
      </Text>
      
      <InputField
        label="Имя контакта"
        value={formData.emergencyContact.name}
        onChangeText={(text) => updateEmergencyContact('name', text)}
        error={errors.emergencyContact?.name}
        placeholder="Введите имя контакта"
      />
      
      <PhoneInput
        label="Телефон контакта"
        value={formData.emergencyContact.phone}
        onChangeText={(text) => updateEmergencyContact('phone', text)}
        error={errors.emergencyContact?.phone}
        country={formData.country}
        onCountryChange={(country) => updateFormData('country', country)}
      />
      
      <Select
        label="Отношение"
        value={formData.emergencyContact.relationship}
        onValueChange={(value) => updateEmergencyContact('relationship', value)}
        options={relationshipOptions}
        error={errors.emergencyContact?.relationship}
        placeholder="Выберите отношение"
      />
      
      <View style={ClientRegisterScreenStyles.preferencesContainer}>
        <Text style={[ClientRegisterScreenStyles.preferencesTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
          Настройки
        </Text>
        
        <TouchableOpacity
          style={ClientRegisterScreenStyles.preferenceItem}
          onPress={() => updatePreferences('notifications', !formData.preferences.notifications)}
        >
          <Ionicons
            name={formData.preferences.notifications ? 'checkbox' : 'square-outline'}
            size={24}
            color={isDark ? '#F9FAFB' : '#1F2937'}
          />
          <Text style={[ClientRegisterScreenStyles.preferenceText, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
            Получать уведомления
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={ClientRegisterScreenStyles.preferenceItem}
          onPress={() => updatePreferences('marketing', !formData.preferences.marketing)}
        >
          <Ionicons
            name={formData.preferences.marketing ? 'checkbox' : 'square-outline'}
            size={24}
            color={isDark ? '#F9FAFB' : '#1F2937'}
          />
          <Text style={[ClientRegisterScreenStyles.preferenceText, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
            Получать маркетинговые материалы
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={ClientRegisterScreenStyles.preferenceItem}
          onPress={() => updatePreferences('terms', !formData.preferences.terms)}
        >
          <Ionicons
            name={formData.preferences.terms ? 'checkbox' : 'square-outline'}
            size={24}
            color={isDark ? '#F9FAFB' : '#1F2937'}
          />
          <Text style={[ClientRegisterScreenStyles.preferenceText, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
            Я согласен с условиями использования
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      default:
        return renderStep1();
    }
  };

  return (
    <SafeAreaView style={[ClientRegisterScreenStyles.container, { backgroundColor: isDark ? '#111827' : '#F8FAFC' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[ClientRegisterScreenStyles.header, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
        <TouchableOpacity
          style={ClientRegisterScreenStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? '#F9FAFB' : '#1F2937'} />
        </TouchableOpacity>
        
        <Text style={[ClientRegisterScreenStyles.title, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
          Регистрация клиента
        </Text>
        
        <View style={ClientRegisterScreenStyles.placeholder} />
      </View>

      {/* Progress Bar */}
      <View style={ClientRegisterScreenStyles.progressContainer}>
        <View style={ClientRegisterScreenStyles.progressBar}>
          <View 
            style={[
              ClientRegisterScreenStyles.progressFill, 
              { width: `${(currentStep / 5) * 100}%` }
            ]} 
          />
        </View>
        <Text style={[ClientRegisterScreenStyles.progressText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
          Шаг {currentStep} из 5
        </Text>
      </View>

      {/* Content */}
      <KeyboardAvoidingView 
        style={ClientRegisterScreenStyles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={ClientRegisterScreenStyles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={ClientRegisterScreenStyles.scrollContent}
        >
          {renderCurrentStep()}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer */}
      <View style={[ClientRegisterScreenStyles.footer, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
        {currentStep > 1 && (
          <Button
            title="Назад"
            onPress={handleBack}
            variant="secondary"
            style={ClientRegisterScreenStyles.backButtonFooter}
          />
        )}
        
        <Button
          title={currentStep === 5 ? 'Зарегистрироваться' : 'Далее'}
          onPress={handleNext}
          loading={loading}
          disabled={loading}
          style={ClientRegisterScreenStyles.nextButton}
        />
      </View>
    </SafeAreaView>
  );
};

export default ClientRegisterScreen;
