import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Modal,
  Linking,
  StatusBar
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { DriverRegistrationData } from '../../types/driver';
import DriverService from '../../services/DriverService';
import InputField from '../../components/InputField';
import PhoneInput from '../../components/PhoneInput';
import Select from '../../components/Select';
import Button from '../../components/Button';
import { DriverRegisterScreenStyles } from '../../styles/screens/DriverRegisterScreen.styles';
import { 
  vehicleCategories, 
  getVehicleBrandsByCategory, 
  getVehicleModelsByBrand, 
  getVehicleYearOptions 
} from '../../utils/vehicleData';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types/navigation';
import { AuthService } from '../../services/AuthService';
import { countries } from '../../utils/countries';
import { vehicleData } from '../../utils/vehicleData';
import PasswordStrengthIndicator from '../../components/PasswordStrengthIndicator';

type NavigationProp = StackNavigationProp<AuthStackParamList, 'DriverRegister'>;

interface DriverRegisterScreenProps {
  navigation: NavigationProp;
}

const DriverRegisterScreen: React.FC<DriverRegisterScreenProps> = ({ navigation }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState<DriverRegistrationData>({
    email: '',
    password: '',
    license_number: '',
    license_expiry_date: '',
    vehicle_number: '',
    phone_number: '',
    first_name: '',
    last_name: '',
    vehicle_category: '',
    vehicle_brand: '',
    vehicle_model: '',
    vehicle_year: undefined,
  });
  
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTermsAndPrivacy, setAgreeToTermsAndPrivacy] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Опции для выбора года автомобиля
  const vehicleYearOptions = getVehicleYearOptions();

  const vehicleBrandOptions = getVehicleBrandsByCategory(formData.vehicle_category);
  const popularVehicleModels = getVehicleModelsByBrand(formData.vehicle_brand);

  const countryOptions = countries.map(country => ({
    label: country.name,
    value: country.code,
  }));

  const genderOptions = [
    { label: 'Мужской', value: 'male' },
    { label: 'Женский', value: 'female' },
    { label: 'Другой', value: 'other' },
  ];

  const experienceOptions = [
    { label: 'Менее 1 года', value: '0-1' },
    { label: '1-3 года', value: '1-3' },
    { label: '3-5 лет', value: '3-5' },
    { label: '5-10 лет', value: '5-10' },
    { label: 'Более 10 лет', value: '10+' },
  ];

  const relationshipOptions = [
    { label: 'Супруг/Супруга', value: 'spouse' },
    { label: 'Родитель', value: 'parent' },
    { label: 'Ребенок', value: 'child' },
    { label: 'Друг', value: 'friend' },
    { label: 'Коллега', value: 'colleague' },
    { label: 'Другой', value: 'other' },
  ];

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Обязательные поля
    if (!formData.first_name) newErrors.first_name = 'Имя обязательно';
    if (!formData.last_name) newErrors.last_name = 'Фамилия обязательна';
    if (!formData.email) newErrors.email = 'Email обязателен';
    if (!formData.phone_number) newErrors.phone_number = 'Номер телефона обязателен';
    if (!formData.password) newErrors.password = 'Пароль обязателен';
    if (!formData.license_number) newErrors.license_number = 'Номер водительских прав обязателен';
    if (!formData.license_expiry_date) newErrors.license_expiry_date = 'Дата истечения прав обязательна';
    if (!formData.vehicle_category) newErrors.vehicle_category = 'Категория автомобиля обязательна';
    if (!formData.vehicle_brand) newErrors.vehicle_brand = 'Марка автомобиля обязательна';
    if (!formData.vehicle_model) newErrors.vehicle_model = 'Модель автомобиля обязательна';
    if (!formData.vehicle_year) newErrors.vehicle_year = 'Год выпуска обязателен';
    if (!formData.vehicle_number) newErrors.vehicle_number = 'Номер автомобиля обязателен';

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Некорректный email адрес';
    }

    // Валидация пароля
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    // Валидация номера прав
    const licenseValidation = DriverService.validateLicenseNumber(formData.license_number);
    if (!licenseValidation.isValid) {
      newErrors.license_number = licenseValidation.message || 'Некорректный номер прав';
    }

    // Валидация номера автомобиля
    const vehicleValidation = DriverService.validateVehicleNumber(formData.vehicle_number);
    if (!vehicleValidation.isValid) {
      newErrors.vehicle_number = vehicleValidation.message || 'Некорректный номер автомобиля';
    }

    // Валидация даты истечения прав
    if (formData.license_expiry_date) {
      const expiryDate = new Date(formData.license_expiry_date);
      const today = new Date();
      if (expiryDate <= today) {
        newErrors.license_expiry_date = 'Срок действия прав истек';
      }
    }

    // Проверка согласий
    if (!agreeToTermsAndPrivacy) {
      newErrors.agreement = 'Необходимо согласиться с условиями использования и политикой конфиденциальности';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      Alert.alert('Ошибка валидации', 'Пожалуйста, исправьте ошибки в форме');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await DriverService.registerDriver(formData);
      
      if (response.success) {
        // Переходим на экран OTP верификации
        navigation.navigate('OTPVerification' as never, {
          phoneNumber: formData.phone_number,
          userRole: 'driver',
          userData: response,
        } as never);
      } else {
        Alert.alert('Ошибка', response.message);
      }
    } catch (error) {
      Alert.alert('Ошибка', error instanceof Error ? error.message : 'Произошла ошибка при регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = () => {
    const today = new Date();
    const futureDate = new Date(today.getFullYear() + 3, today.getMonth(), today.getDate());
    
    setFormData({
      email: 'driver@example.com',
      password: 'password123',
      license_number: 'AZ12345678',
      license_expiry_date: futureDate.toISOString().split('T')[0],
      vehicle_number: '12-AB-123',
      phone_number: '+994501234567',
      first_name: 'Александр',
      last_name: 'Петров',
      vehicle_category: 'plus',
      vehicle_brand: 'Toyota',
      vehicle_model: 'Camry',
      vehicle_year: 2020,
    });
    setConfirmPassword('password123');
    setAgreeToTermsAndPrivacy(true);
  };

  const updateFormData = (field: keyof DriverRegistrationData, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Очистить ошибку для этого поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<DriverRegistrationData> = {};

    switch (step) {
      case 1:
        if (!formData.first_name) {
          newErrors.first_name = 'Введите имя';
        }
        if (!formData.last_name) {
          newErrors.last_name = 'Введите фамилию';
        }
        if (!formData.email) {
          newErrors.email = 'Введите email';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Введите корректный email';
        }
        if (!formData.phone_number) {
          newErrors.phone_number = 'Введите номер телефона';
        }
        break;

      case 2:
        if (!formData.password) {
          newErrors.password = 'Введите пароль';
        } else if (formData.password.length < 8) {
          newErrors.password = 'Пароль должен содержать минимум 8 символов';
        }
        if (!formData.license_number) {
          newErrors.license_number = 'Введите номер водительского удостоверения';
        }
        if (!formData.license_expiry_date) {
          newErrors.license_expiry_date = 'Выберите дату окончания действия удостоверения';
        }
        break;

      case 3:
        if (!formData.vehicle_category) {
          newErrors.vehicle_category = 'Выберите категорию автомобиля';
        }
        if (!formData.vehicle_brand) {
          newErrors.vehicle_brand = 'Выберите марку автомобиля';
        }
        if (!formData.vehicle_model) {
          newErrors.vehicle_model = 'Выберите модель автомобиля';
        }
        if (!formData.vehicle_year) {
          newErrors.vehicle_year = 'Выберите год выпуска';
        }
        if (!formData.vehicle_number) {
          newErrors.vehicle_number = 'Введите номер автомобиля';
        }
        break;

      case 4:
        if (!formData.phone_number) {
          newErrors.phone_number = 'Введите номер телефона';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
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

  const renderStep1 = () => (
    <View style={DriverRegisterScreenStyles.stepContainer}>
      <Text style={[DriverRegisterScreenStyles.stepTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
        Основная информация
      </Text>
      
      <InputField
        label="Имя"
        value={formData.first_name}
        onChangeText={(text) => updateFormData('first_name', text)}
        error={errors.first_name}
        placeholder="Введите ваше имя"
      />
      
      <InputField
        label="Фамилия"
        value={formData.last_name}
        onChangeText={(text) => updateFormData('last_name', text)}
        error={errors.last_name}
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
        value={formData.phone_number}
        onChangeText={(text) => updateFormData('phone_number', text)}
        error={errors.phone_number}
        country={formData.country}
        onCountryChange={(country) => updateFormData('country', country)}
      />
    </View>
  );

  const renderStep2 = () => (
    <View style={DriverRegisterScreenStyles.stepContainer}>
      <Text style={[DriverRegisterScreenStyles.stepTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
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
        value={confirmPassword}
        onChangeText={setConfirmPassword}
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
    <View style={DriverRegisterScreenStyles.stepContainer}>
      <Text style={[DriverRegisterScreenStyles.stepTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
        Информация об автомобиле
      </Text>
      
      <Select
        label="Категория автомобиля"
        value={formData.vehicle_category}
        onValueChange={(value) => {
          updateFormData('vehicle_category', value as string);
          // Сбросить марку и модель при смене категории
          updateFormData('vehicle_brand', '');
          updateFormData('vehicle_model', '');
        }}
        options={vehicleCategories}
        error={errors.vehicle_category}
        placeholder="Выберите категорию"
      />
      
      <Select
        label="Марка автомобиля"
        value={formData.vehicle_brand}
        onValueChange={(value) => {
          updateFormData('vehicle_brand', value as string);
          // Сбросить модель при смене марки
          updateFormData('vehicle_model', '');
        }}
        options={vehicleBrandOptions}
        error={errors.vehicle_brand}
        placeholder="Выберите марку"
        searchable
      />
      
      <Select
        label="Модель автомобиля"
        value={formData.vehicle_model}
        onValueChange={(value) => updateFormData('vehicle_model', value as string)}
        options={popularVehicleModels}
        error={errors.vehicle_model}
        placeholder="Выберите модель"
        searchable
      />
      
      <Select
        label="Год выпуска"
        value={formData.vehicle_year}
        onValueChange={(value) => updateFormData('vehicle_year', value as number)}
        options={vehicleYearOptions}
        error={errors.vehicle_year}
        placeholder="Выберите год"
      />
      
      <InputField
        label="Номер автомобиля"
        value={formData.vehicle_number}
        onChangeText={(text) => updateFormData('vehicle_number', text)}
        error={errors.vehicle_number}
        placeholder="Введите номер"
      />
    </View>
  );

  const renderStep4 = () => (
    <View style={DriverRegisterScreenStyles.stepContainer}>
      <Text style={[DriverRegisterScreenStyles.stepTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
        Личная информация
      </Text>
      
      <InputField
        label="Дата рождения"
        value={formData.birth_date}
        onChangeText={(text) => updateFormData('birth_date', text)}
        error={errors.birth_date}
        placeholder="ДД.ММ.ГГГГ"
      />
      
      <Select
        label="Пол"
        value={formData.gender}
        onValueChange={(value) => updateFormData('gender', value as string)}
        options={genderOptions}
        error={errors.gender}
        placeholder="Выберите пол"
      />
      
      <InputField
        label="Номер водительского удостоверения"
        value={formData.license_number}
        onChangeText={(text) => updateFormData('license_number', text)}
        error={errors.license_number}
        placeholder="Введите номер удостоверения"
      />
      
      <InputField
        label="Дата окончания действия"
        value={formData.license_expiry_date}
        onChangeText={(text) => updateFormData('license_expiry_date', text)}
        error={errors.license_expiry_date}
        placeholder="ДД.ММ.ГГГГ"
      />
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
      default:
        return renderStep1();
    }
  };

  return (
    <SafeAreaView style={[DriverRegisterScreenStyles.container, { backgroundColor: isDark ? '#111827' : '#F8FAFC' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[DriverRegisterScreenStyles.header, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
        <TouchableOpacity
          style={DriverRegisterScreenStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? '#F9FAFB' : '#1F2937'} />
        </TouchableOpacity>
        
        <Text style={[DriverRegisterScreenStyles.title, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
          Регистрация водителя
        </Text>
        
        <View style={DriverRegisterScreenStyles.placeholder} />
      </View>

      {/* Progress Bar */}
      <View style={DriverRegisterScreenStyles.progressContainer}>
        <View style={DriverRegisterScreenStyles.progressBar}>
          <View 
            style={[
              DriverRegisterScreenStyles.progressFill, 
              { width: `${(currentStep / 4) * 100}%` }
            ]} 
          />
        </View>
        <Text style={[DriverRegisterScreenStyles.progressText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
          Шаг {currentStep} из 4
        </Text>
      </View>

      {/* Content */}
      <KeyboardAvoidingView 
        style={DriverRegisterScreenStyles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={DriverRegisterScreenStyles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={DriverRegisterScreenStyles.scrollContent}
        >
          {renderCurrentStep()}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer */}
      <View style={[DriverRegisterScreenStyles.footer, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
        {currentStep > 1 && (
          <Button
            title="Назад"
            onPress={handleBack}
            variant="secondary"
            style={DriverRegisterScreenStyles.backButtonFooter}
          />
        )}
        
        <Button
          title={currentStep === 4 ? 'Зарегистрироваться' : 'Далее'}
          onPress={handleNext}
          loading={isLoading}
          disabled={isLoading}
          style={DriverRegisterScreenStyles.nextButton}
        />
      </View>
    </SafeAreaView>
  );
};

export default DriverRegisterScreen;
