import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Modal,
  Linking
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { DriverRegistrationData } from '../../types/driver';
import DriverService from '../../services/DriverService';
import InputField from '../../components/InputField';
import PhoneInput from '../../components/PhoneInput';
import Select, { SelectOption } from '../../components/Select';
import Button from '../../components/Button';

interface DriverRegisterScreenProps {
  navigation: any;
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

  // Опции для выбора года автомобиля
  const vehicleYearOptions: SelectOption[] = [];
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= 1990; year--) {
    vehicleYearOptions.push({
      label: year.toString(),
      value: year,
    });
  }

  // Автомобили по категориям
  const vehicleCategories: SelectOption[] = [
    { label: '🚗 База', value: 'base', icon: 'car-outline' },
    { label: '✨ Плюс', value: 'plus', icon: 'car-sport-outline' },
    { label: '👑 Премиум', value: 'premium', icon: 'diamond-outline' },
  ];

  // Марки автомобилей по категориям
  const getVehicleBrandsByCategory = (category?: string): SelectOption[] => {
    switch (category) {
      case 'base':
        return [
          { label: 'Lada', value: 'Lada' },
          { label: 'Chevrolet', value: 'Chevrolet' },
          { label: 'Daewoo', value: 'Daewoo' },
          { label: 'Hyundai', value: 'Hyundai' },
          { label: 'Kia', value: 'Kia' },
          { label: 'Renault', value: 'Renault' },
          { label: 'Nissan', value: 'Nissan' },
          { label: 'Ford', value: 'Ford' },
          { label: 'Volkswagen', value: 'Volkswagen' },
          { label: 'Skoda', value: 'Skoda' },
        ];
      case 'plus':
        return [
          { label: 'Toyota', value: 'Toyota' },
          { label: 'Honda', value: 'Honda' },
          { label: 'Mazda', value: 'Mazda' },
          { label: 'Subaru', value: 'Subaru' },
          { label: 'Mitsubishi', value: 'Mitsubishi' },
          { label: 'Peugeot', value: 'Peugeot' },
          { label: 'Citroen', value: 'Citroen' },
          { label: 'Opel', value: 'Opel' },
          { label: 'Volvo', value: 'Volvo' },
          { label: 'Lexus', value: 'Lexus' },
        ];
      case 'premium':
        return [
          { label: 'Mercedes-Benz', value: 'Mercedes-Benz' },
          { label: 'BMW', value: 'BMW' },
          { label: 'Audi', value: 'Audi' },
          { label: 'Porsche', value: 'Porsche' },
          { label: 'Jaguar', value: 'Jaguar' },
          { label: 'Land Rover', value: 'Land Rover' },
          { label: 'Cadillac', value: 'Cadillac' },
          { label: 'Lincoln', value: 'Lincoln' },
          { label: 'Infiniti', value: 'Infiniti' },
          { label: 'Acura', value: 'Acura' },
        ];
      default:
        return [
          { label: 'Выберите категорию сначала', value: 'select_category' },
        ];
    }
  };

  // Модели автомобилей по маркам
  const getVehicleModelsByBrand = (brand?: string): SelectOption[] => {
    const modelsByBrand: Record<string, SelectOption[]> = {
      'Toyota': [
        { label: 'Camry', value: 'Camry' },
        { label: 'Corolla', value: 'Corolla' },
        { label: 'Prius', value: 'Prius' },
        { label: 'RAV4', value: 'RAV4' },
        { label: 'Highlander', value: 'Highlander' },
        { label: 'Land Cruiser', value: 'Land Cruiser' },
        { label: 'Avalon', value: 'Avalon' },
      ],
      'Hyundai': [
        { label: 'Elantra', value: 'Elantra' },
        { label: 'Sonata', value: 'Sonata' },
        { label: 'Tucson', value: 'Tucson' },
        { label: 'Santa Fe', value: 'Santa Fe' },
        { label: 'Accent', value: 'Accent' },
        { label: 'Genesis', value: 'Genesis' },
      ],
      'Kia': [
        { label: 'Cerato', value: 'Cerato' },
        { label: 'Optima', value: 'Optima' },
        { label: 'Sportage', value: 'Sportage' },
        { label: 'Sorento', value: 'Sorento' },
        { label: 'Rio', value: 'Rio' },
        { label: 'Stinger', value: 'Stinger' },
      ],
      'Mercedes-Benz': [
        { label: 'C-Class', value: 'C-Class' },
        { label: 'E-Class', value: 'E-Class' },
        { label: 'S-Class', value: 'S-Class' },
        { label: 'GLE', value: 'GLE' },
        { label: 'GLS', value: 'GLS' },
        { label: 'A-Class', value: 'A-Class' },
        { label: 'CLS', value: 'CLS' },
      ],
      'BMW': [
        { label: '3 Series', value: '3 Series' },
        { label: '5 Series', value: '5 Series' },
        { label: '7 Series', value: '7 Series' },
        { label: 'X3', value: 'X3' },
        { label: 'X5', value: 'X5' },
        { label: 'X7', value: 'X7' },
        { label: 'i8', value: 'i8' },
      ],
      'Audi': [
        { label: 'A3', value: 'A3' },
        { label: 'A4', value: 'A4' },
        { label: 'A6', value: 'A6' },
        { label: 'A8', value: 'A8' },
        { label: 'Q3', value: 'Q3' },
        { label: 'Q5', value: 'Q5' },
        { label: 'Q7', value: 'Q7' },
      ],
      'Lada': [
        { label: 'Granta', value: 'Granta' },
        { label: 'Vesta', value: 'Vesta' },
        { label: 'XRAY', value: 'XRAY' },
        { label: 'Largus', value: 'Largus' },
        { label: 'Niva', value: 'Niva' },
        { label: 'Kalina', value: 'Kalina' },
        { label: 'Priora', value: 'Priora' },
      ],
      'Chevrolet': [
        { label: 'Aveo', value: 'Aveo' },
        { label: 'Cruze', value: 'Cruze' },
        { label: 'Malibu', value: 'Malibu' },
        { label: 'Tahoe', value: 'Tahoe' },
        { label: 'Traverse', value: 'Traverse' },
        { label: 'Equinox', value: 'Equinox' },
      ],
      'Daewoo': [
        { label: 'Matiz', value: 'Matiz' },
        { label: 'Nexia', value: 'Nexia' },
        { label: 'Lacetti', value: 'Lacetti' },
        { label: 'Gentra', value: 'Gentra' },
        { label: 'Cobalt', value: 'Cobalt' },
      ],
      'Renault': [
        { label: 'Logan', value: 'Logan' },
        { label: 'Sandero', value: 'Sandero' },
        { label: 'Duster', value: 'Duster' },
        { label: 'Megane', value: 'Megane' },
        { label: 'Captur', value: 'Captur' },
        { label: 'Koleos', value: 'Koleos' },
      ],
      'Nissan': [
        { label: 'Altima', value: 'Altima' },
        { label: 'Sentra', value: 'Sentra' },
        { label: 'Maxima', value: 'Maxima' },
        { label: 'Rogue', value: 'Rogue' },
        { label: 'Pathfinder', value: 'Pathfinder' },
        { label: 'Murano', value: 'Murano' },
        { label: 'Armada', value: 'Armada' },
      ],
      'Ford': [
        { label: 'Focus', value: 'Focus' },
        { label: 'Fusion', value: 'Fusion' },
        { label: 'Fiesta', value: 'Fiesta' },
        { label: 'Mustang', value: 'Mustang' },
        { label: 'Explorer', value: 'Explorer' },
        { label: 'Edge', value: 'Edge' },
        { label: 'Escape', value: 'Escape' },
      ],
      'Volkswagen': [
        { label: 'Jetta', value: 'Jetta' },
        { label: 'Passat', value: 'Passat' },
        { label: 'Golf', value: 'Golf' },
        { label: 'Tiguan', value: 'Tiguan' },
        { label: 'Atlas', value: 'Atlas' },
        { label: 'Beetle', value: 'Beetle' },
      ],
      'Skoda': [
        { label: 'Octavia', value: 'Octavia' },
        { label: 'Superb', value: 'Superb' },
        { label: 'Rapid', value: 'Rapid' },
        { label: 'Kodiaq', value: 'Kodiaq' },
        { label: 'Karoq', value: 'Karoq' },
        { label: 'Scala', value: 'Scala' },
      ],
      'Honda': [
        { label: 'Civic', value: 'Civic' },
        { label: 'Accord', value: 'Accord' },
        { label: 'CR-V', value: 'CR-V' },
        { label: 'Pilot', value: 'Pilot' },
        { label: 'Passport', value: 'Passport' },
        { label: 'Fit', value: 'Fit' },
        { label: 'Insight', value: 'Insight' },
      ],
      'Mazda': [
        { label: 'Mazda3', value: 'Mazda3' },
        { label: 'Mazda6', value: 'Mazda6' },
        { label: 'CX-3', value: 'CX-3' },
        { label: 'CX-5', value: 'CX-5' },
        { label: 'CX-9', value: 'CX-9' },
        { label: 'MX-5', value: 'MX-5' },
      ],
      'Subaru': [
        { label: 'Legacy', value: 'Legacy' },
        { label: 'Outback', value: 'Outback' },
        { label: 'Impreza', value: 'Impreza' },
        { label: 'Forester', value: 'Forester' },
        { label: 'Ascent', value: 'Ascent' },
        { label: 'WRX', value: 'WRX' },
      ],
      'Mitsubishi': [
        { label: 'Lancer', value: 'Lancer' },
        { label: 'Outlander', value: 'Outlander' },
        { label: 'Eclipse', value: 'Eclipse' },
        { label: 'Pajero', value: 'Pajero' },
        { label: 'ASX', value: 'ASX' },
      ],
      'Peugeot': [
        { label: '208', value: '208' },
        { label: '308', value: '308' },
        { label: '508', value: '508' },
        { label: '2008', value: '2008' },
        { label: '3008', value: '3008' },
        { label: '5008', value: '5008' },
      ],
      'Citroen': [
        { label: 'C3', value: 'C3' },
        { label: 'C4', value: 'C4' },
        { label: 'C5', value: 'C5' },
        { label: 'C4 Picasso', value: 'C4 Picasso' },
        { label: 'Berlingo', value: 'Berlingo' },
      ],
      'Opel': [
        { label: 'Astra', value: 'Astra' },
        { label: 'Corsa', value: 'Corsa' },
        { label: 'Insignia', value: 'Insignia' },
        { label: 'Mokka', value: 'Mokka' },
        { label: 'Grandland', value: 'Grandland' },
      ],
      'Volvo': [
        { label: 'S60', value: 'S60' },
        { label: 'S90', value: 'S90' },
        { label: 'XC40', value: 'XC40' },
        { label: 'XC60', value: 'XC60' },
        { label: 'XC90', value: 'XC90' },
        { label: 'V60', value: 'V60' },
      ],
      'Lexus': [
        { label: 'ES', value: 'ES' },
        { label: 'IS', value: 'IS' },
        { label: 'GS', value: 'GS' },
        { label: 'LS', value: 'LS' },
        { label: 'RX', value: 'RX' },
        { label: 'GX', value: 'GX' },
        { label: 'LX', value: 'LX' },
      ],
      'Porsche': [
        { label: '911', value: '911' },
        { label: 'Cayenne', value: 'Cayenne' },
        { label: 'Macan', value: 'Macan' },
        { label: 'Panamera', value: 'Panamera' },
        { label: 'Boxster', value: 'Boxster' },
        { label: 'Cayman', value: 'Cayman' },
      ],
      'Jaguar': [
        { label: 'XE', value: 'XE' },
        { label: 'XF', value: 'XF' },
        { label: 'XJ', value: 'XJ' },
        { label: 'F-PACE', value: 'F-PACE' },
        { label: 'E-PACE', value: 'E-PACE' },
        { label: 'I-PACE', value: 'I-PACE' },
      ],
      'Land Rover': [
        { label: 'Range Rover', value: 'Range Rover' },
        { label: 'Range Rover Sport', value: 'Range Rover Sport' },
        { label: 'Range Rover Evoque', value: 'Range Rover Evoque' },
        { label: 'Discovery', value: 'Discovery' },
        { label: 'Defender', value: 'Defender' },
      ],
      'Cadillac': [
        { label: 'ATS', value: 'ATS' },
        { label: 'CTS', value: 'CTS' },
        { label: 'XTS', value: 'XTS' },
        { label: 'Escalade', value: 'Escalade' },
        { label: 'XT4', value: 'XT4' },
        { label: 'XT5', value: 'XT5' },
      ],
      'Lincoln': [
        { label: 'Continental', value: 'Continental' },
        { label: 'MKZ', value: 'MKZ' },
        { label: 'Navigator', value: 'Navigator' },
        { label: 'Aviator', value: 'Aviator' },
        { label: 'Corsair', value: 'Corsair' },
      ],
      'Infiniti': [
        { label: 'Q50', value: 'Q50' },
        { label: 'Q60', value: 'Q60' },
        { label: 'Q70', value: 'Q70' },
        { label: 'QX50', value: 'QX50' },
        { label: 'QX60', value: 'QX60' },
        { label: 'QX80', value: 'QX80' },
      ],
      'Acura': [
        { label: 'ILX', value: 'ILX' },
        { label: 'TLX', value: 'TLX' },
        { label: 'RLX', value: 'RLX' },
        { label: 'RDX', value: 'RDX' },
        { label: 'MDX', value: 'MDX' },
        { label: 'NSX', value: 'NSX' },
      ],
    };

    return modelsByBrand[brand || ''] || [
      { label: 'Выберите марку сначала', value: 'select_brand' },
    ];
  };

  const vehicleBrandOptions = getVehicleBrandsByCategory(formData.vehicle_category);
  const popularVehicleModels = getVehicleModelsByBrand(formData.vehicle_brand);

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111827' : '#F8FAFC' }]}>
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
              <MaterialIcons name="directions-car" size={48} color="#1E3A8A" />
            </View>
            
            <Text style={[styles.title, { color: isDark ? '#F9FAFB' : '#111827' }]}>
              Регистрация водителя
            </Text>
            <Text style={[styles.subtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              Станьте партнером FixDrive
            </Text>

            {/* Quick Fill Button */}
            {__DEV__ && (
              <TouchableOpacity 
                style={styles.quickFillButton}
                onPress={handleQuickFill}
              >
                <Text style={styles.quickFillText}>🚀 Быстрое заполнение (DEV)</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Personal Info Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>
                Личная информация
              </Text>
              
              <View style={styles.inputRow}>
                <InputField
                  label="Имя"
                  value={formData.first_name}
                  onChangeText={(value) => updateFormData('first_name', value)}
                  leftIcon="person-outline"
                  placeholder="Введите ваше имя"
                  error={errors.first_name}
                  required
                  containerStyle={{ flex: 1, marginRight: 8 }}
                />
                <InputField
                  label="Фамилия"
                  value={formData.last_name}
                  onChangeText={(value) => updateFormData('last_name', value)}
                  leftIcon="person-outline"
                  placeholder="Введите вашу фамилию"
                  error={errors.last_name}
                  required
                  containerStyle={{ flex: 1, marginLeft: 8 }}
                />
              </View>

              <InputField
                label="Email"
                  value={formData.email}
                  onChangeText={(value) => updateFormData('email', value)}
                leftIcon="mail-outline"
                placeholder="example@mail.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                error={errors.email}
                required
                containerStyle={styles.inputSpacing}
              />

              <PhoneInput
                label="Номер телефона"
                value={formData.phone_number}
                onChangeText={(value) => updateFormData('phone_number', value)}
                placeholder="Введите номер телефона"
                error={errors.phone_number}
                required
                containerStyle={styles.inputSpacing}
              />
            </View>

            {/* Credentials Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>
                Данные для входа
              </Text>
              
              <InputField
                label="Пароль"
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                leftIcon="lock-closed-outline"
                placeholder="Минимум 6 символов"
                secureTextEntry
                error={errors.password}
                required
                containerStyle={styles.inputSpacing}
              />

              <InputField
                label="Подтвердите пароль"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                leftIcon="lock-closed-outline"
                placeholder="Повторите пароль"
                secureTextEntry
                error={errors.confirmPassword}
                required
                containerStyle={styles.inputSpacing}
                />
              </View>

            {/* License Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>
                Водительские права
              </Text>

              <InputField
                label="Номер водительских прав"
                value={formData.license_number}
                onChangeText={(value) => updateFormData('license_number', value)}
                leftIcon="card-outline"
                placeholder="AZ12345678"
                  autoCapitalize="characters"
                error={errors.license_number}
                required
                containerStyle={styles.inputSpacing}
              />

              <InputField
                label="Дата окончания прав"
                value={formData.license_expiry_date}
                onChangeText={(value) => updateFormData('license_expiry_date', value)}
                leftIcon="calendar-outline"
                placeholder="ГГГГ-ММ-ДД"
                error={errors.license_expiry_date}
                required
                containerStyle={styles.inputSpacing}
              />
            </View>

            {/* Vehicle Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>
                Информация об автомобиле
              </Text>
              
              <InputField
                label="Номер автомобиля"
                value={formData.vehicle_number}
                onChangeText={(value) => updateFormData('vehicle_number', value)}
                leftIcon="car-outline"
                placeholder="12-AB-123"
                autoCapitalize="characters"
                error={errors.vehicle_number}
                required
                containerStyle={styles.inputSpacing}
              />

              <Select
                label="Категория автомобиля"
                options={vehicleCategories}
                value={formData.vehicle_category}
                onSelect={(option) => {
                  updateFormData('vehicle_category', option.value as string);
                  // Сбросить марку и модель при смене категории
                  updateFormData('vehicle_brand', '');
                  updateFormData('vehicle_model', '');
                }}
                placeholder="Выберите категорию"
                error={errors.vehicle_category}
                required
                compact={true}
                containerStyle={styles.inputSpacing}
              />

              <Select
                label="Марка автомобиля"
                options={vehicleBrandOptions}
                value={formData.vehicle_brand}
                onSelect={(option) => {
                  updateFormData('vehicle_brand', option.value as string);
                  // Сбросить модель при смене марки
                  updateFormData('vehicle_model', '');
                }}
                placeholder="Выберите марку"
                searchable
                error={errors.vehicle_brand}
                required
                containerStyle={styles.inputSpacing}
              />

              <Select
                label="Модель автомобиля"
                options={popularVehicleModels}
                value={formData.vehicle_model}
                onSelect={(option) => updateFormData('vehicle_model', option.value as string)}
                placeholder="Выберите модель"
                searchable
                error={errors.vehicle_model}
                required
                containerStyle={styles.inputSpacing}
              />

              <Select
                label="Год выпуска"
                options={vehicleYearOptions}
                value={formData.vehicle_year}
                onSelect={(option) => updateFormData('vehicle_year', option.value as number)}
                placeholder="Выберите год"
                error={errors.vehicle_year}
                required
                containerStyle={styles.inputSpacing}
              />
            </View>

            {/* Agreements Section */}
            <View style={styles.agreementsSection}>
              <TouchableOpacity 
                style={styles.agreementRow}
                onPress={() => setAgreeToTermsAndPrivacy(!agreeToTermsAndPrivacy)}
              >
                <Ionicons
                  name={agreeToTermsAndPrivacy ? "checkbox" : "square-outline"}
                  size={24}
                  color={agreeToTermsAndPrivacy ? "#1E3A8A" : isDark ? "#9CA3AF" : "#6B7280"}
                />
                <Text style={[styles.agreementText, { color: isDark ? '#F9FAFB' : '#111827' }]}>
                  Я согласен с{' '}
                  <Text 
                    style={styles.linkText}
                    onPress={() => setShowTermsModal(true)}
                  >
                    условиями использования
                  </Text>
                  {' '}и{' '}
                  <Text 
                    style={styles.linkText}
                    onPress={() => setShowPrivacyModal(true)}
                  >
                    политикой конфиденциальности
                  </Text>
                </Text>
              </TouchableOpacity>

              {errors.agreement && (
                <Text style={styles.errorText}>
                  {errors.agreement}
                </Text>
              )}
            </View>

            {/* Register Button */}
            <Button
              title="Отправить заявку"
              onPress={handleRegister}
              loading={isLoading}
              disabled={isLoading}
              size="large"
              style={styles.registerButton}
            />

            {/* Support */}
              <TouchableOpacity 
              style={styles.supportButton}
              onPress={() => {
                const whatsappNumber = '+994516995513';
                const message = 'Здравствуйте! У меня вопрос по регистрации водителя в приложении FixDrive.';
                const whatsappUrl = `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
                Linking.openURL(whatsappUrl).catch(() => {
                  Alert.alert('Ошибка', 'Не удалось открыть WhatsApp');
                });
              }}
            >
              <Ionicons name="chatbubble-outline" size={20} color="#1E3A8A" />
              <Text style={styles.supportText}>Нужна помощь? Свяжитесь с нами</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Terms Modal */}
      <Modal
        visible={showTermsModal}
        transparent={true}
        animationType="slide"
        presentationStyle="overFullScreen"
        onRequestClose={() => setShowTermsModal(false)}
      >
              <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
                onPress={() => setShowTermsModal(false)}
              >
          <TouchableOpacity
            style={[styles.modalContent, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>
                Условия использования
              </Text>
              <TouchableOpacity onPress={() => setShowTermsModal(false)}>
                <Ionicons name="close" size={24} color={isDark ? '#F9FAFB' : '#111827'} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={[styles.modalText, { color: isDark ? '#D1D5DB' : '#374151' }]}>
                <Text style={[styles.modalText, { fontWeight: 'bold', fontSize: 18, color: isDark ? '#F9FAFB' : '#111827' }]}>
                  📋 Условия использования FixDrive{'\n\n'}
                </Text>

                <Text style={[styles.modalText, { fontWeight: 'bold', color: isDark ? '#F9FAFB' : '#111827' }]}>
                  ✅ 1️⃣ Кто может стать водителем FixDrive{'\n'}
                </Text>
                • Лицо старше 21 года с действующими водительскими правами.{'\n'}
                • Минимальный стаж вождения — 2–3 года.{'\n'}
                • Автомобиль в хорошем техническом состоянии или готовность работать на авто клиента.{'\n'}
                • Чистая история: отсутствие грубых нарушений ПДД и судимостей.{'\n'}
                • Прохождение интервью и внутренней проверки (KYC).{'\n'}
                • Страховка ОСАГО обязательно; CASCO — опция.{'\n\n'}

                <Text style={[styles.modalText, { fontWeight: 'bold', color: isDark ? '#F9FAFB' : '#111827' }]}>
                  ✅ 2️⃣ Основные обязанности водителя{'\n'}
                </Text>
                • Всегда приезжать вовремя, строго по расписанию.{'\n'}
                • Следить за чистотой автомобиля.{'\n'}
                • Поддерживать вежливый сервис.{'\n'}
                • Согласовывать маршрут заранее.{'\n'}
                • Не срывать поездки, не передавать заказы третьим лицам.{'\n'}
                • Быть на связи через чат FixDrive.{'\n\n'}

                <Text style={[styles.modalText, { fontWeight: 'bold', color: isDark ? '#F9FAFB' : '#111827' }]}>
                  ✅ 3️⃣ Комиссия и выплаты{'\n'}
                </Text>
                • FixDrive берёт 3–5% комиссии с каждого заказа.{'\n'}
                • Оплата — еженедельная или ежемесячная.{'\n'}
                • Безналичный расчёт (Stripe или локальный банк).{'\n'}
                • Возможность чаевых — всё идёт водителю без комиссии.{'\n'}
                • Штрафы за срыв поездок фиксируются в правилах.{'\n\n'}

                <Text style={[styles.modalText, { fontWeight: 'bold', color: isDark ? '#F9FAFB' : '#111827' }]}>
                  ✅ 4️⃣ Дополнительные условия{'\n'}
                </Text>
                • Водитель может обслуживать несколько клиентов.{'\n'}
                • Клиент видит рейтинг водителя и может оставить отзыв.{'\n'}
                • Система автоматически фильтрует накладки в расписании.{'\n'}
                • В спорных ситуациях: FixDrive выступает арбитром.{'\n\n'}

                <Text style={[styles.modalText, { fontWeight: 'bold', color: isDark ? '#F9FAFB' : '#111827' }]}>
                  ✅ 5️⃣ Что мы даём водителю{'\n'}
                </Text>
                ✔️ Постоянные и предсказуемые клиенты.{'\n'}
                ✔️ Минимальная комиссия — выше доход.{'\n'}
                ✔️ Чёткий график = нет простоев.{'\n'}
                ✔️ Программа лояльности.{'\n\n'}

                <Text style={[styles.modalText, { fontWeight: 'bold', color: isDark ? '#F9FAFB' : '#111827' }]}>
                  ✅ 6️⃣ Выход из сервиса{'\n'}
                </Text>
                • Водитель может приостановить работу по уведомлению (7–14 дней).{'\n'}
                • FixDrive может приостановить аккаунт за нарушения.{'\n\n'}

                <Text style={[styles.modalText, { fontWeight: 'bold', fontSize: 16, color: isDark ? '#10B981' : '#059669' }]}>
                  🔑 Главный посыл{'\n'}
                </Text>
                FixDrive = клуб проверенных водителей с постоянной загрузкой.{'\n'}
                Чем лучше водитель работает — тем выше рейтинг и доход.
              </Text>
            </ScrollView>
            </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Privacy Modal */}
      <Modal
        visible={showPrivacyModal}
        transparent={true}
        animationType="slide"
        presentationStyle="overFullScreen"
        onRequestClose={() => setShowPrivacyModal(false)}
      >
              <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
                onPress={() => setShowPrivacyModal(false)}
              >
          <TouchableOpacity
            style={[styles.modalContent, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>
                Политика конфиденциальности
              </Text>
              <TouchableOpacity onPress={() => setShowPrivacyModal(false)}>
                <Ionicons name="close" size={24} color={isDark ? '#F9FAFB' : '#111827'} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={[styles.modalText, { color: isDark ? '#D1D5DB' : '#374151' }]}>
                <Text style={[styles.modalText, { fontWeight: 'bold', fontSize: 18, color: isDark ? '#F9FAFB' : '#111827' }]}>
                  🔒 Политика конфиденциальности FixDrive{'\n\n'}
                </Text>

                <Text style={[styles.modalText, { fontWeight: 'bold', color: isDark ? '#F9FAFB' : '#111827' }]}>
                  🛡️ 1️⃣ Сбор и обработка данных{'\n'}
                </Text>
                • Мы собираем минимально необходимые данные для предоставления услуг.{'\n'}
                • Персональные данные: ФИО, телефон, email, данные водительского удостоверения.{'\n'}
                • Данные автомобиля: марка, модель, год, номер, фотографии.{'\n'}
                • Геолокация: только во время активных поездок для безопасности.{'\n'}
                • Финансовые данные: только для выплат и комиссий.{'\n\n'}

                <Text style={[styles.modalText, { fontWeight: 'bold', color: isDark ? '#F9FAFB' : '#111827' }]}>
                  🔐 2️⃣ Защита данных{'\n'}
                </Text>
                • Все данные шифруются при передаче и хранении.{'\n'}
                • Доступ к данным имеют только авторизованные сотрудники.{'\n'}
                • Регулярные аудиты безопасности и обновления систем.{'\n'}
                • Соответствие международным стандартам GDPR и ISO 27001.{'\n'}
                • Данные не передаются третьим лицам без согласия.{'\n\n'}

                <Text style={[styles.modalText, { fontWeight: 'bold', color: isDark ? '#F9FAFB' : '#111827' }]}>
                  📍 3️⃣ Геолокация и GPS{'\n'}
                </Text>
                • GPS-трекинг включается только во время поездок.{'\n'}
                • Данные геолокации используются для оптимизации маршрутов.{'\n'}
                • История поездок хранится для улучшения сервиса.{'\n'}
                • Геоданные не используются для слежения в личное время.{'\n\n'}

                <Text style={[styles.modalText, { fontWeight: 'bold', color: isDark ? '#F9FAFB' : '#111827' }]}>
                  🛡️ 4️⃣ Политика безопасности{'\n'}
                </Text>
                • В машине должен быть видеорегистратор для безопасности.{'\n'}
                • Все поездки автоматически логируются GPS.{'\n'}
                • Экстренная кнопка SOS в приложении.{'\n'}
                • Страховая поддержка при авариях — FixDrive помогает оформить.{'\n'}
                • Проверка водителей: KYC и background check.{'\n\n'}

                <Text style={[styles.modalText, { fontWeight: 'bold', color: isDark ? '#F9FAFB' : '#111827' }]}>
                  💳 5️⃣ Финансовая безопасность{'\n'}
                </Text>
                • Платежи обрабатываются через защищённые системы (Stripe).{'\n'}
                • Банковские данные не хранятся в нашей системе.{'\n'}
                • Регулярные выплаты согласно договору.{'\n'}
                • Прозрачность всех финансовых операций.{'\n\n'}

                <Text style={[styles.modalText, { fontWeight: 'bold', color: isDark ? '#F9FAFB' : '#111827' }]}>
                  👤 6️⃣ Ваши права{'\n'}
                </Text>
                • Право на просмотр ваших данных в любое время.{'\n'}
                • Право на удаление аккаунта и всех данных.{'\n'}
                • Право на исправление неточных данных.{'\n'}
                • Право на ограничение обработки данных.{'\n'}
                • Право на портативность данных.{'\n\n'}

                <Text style={[styles.modalText, { fontWeight: 'bold', color: isDark ? '#F9FAFB' : '#111827' }]}>
                  📞 7️⃣ Контакты по вопросам конфиденциальности{'\n'}
                </Text>
                • Email: privacy@fixdrive.com{'\n'}
                • Телефон: +7 (XXX) XXX-XX-XX{'\n'}
                • Адрес: г. [Город], ул. [Адрес]{'\n\n'}

                <Text style={[styles.modalText, { fontWeight: 'bold', fontSize: 16, color: isDark ? '#10B981' : '#059669' }]}>
                  🔒 Наше обещание{'\n'}
                </Text>
                FixDrive гарантирует максимальную защиту ваших данных и прозрачность в работе.{'\n'}
                Ваша конфиденциальность — наш приоритет.
              </Text>
            </ScrollView>
            </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  quickFillButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  quickFillText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  form: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  inputSpacing: {
    marginBottom: 16,
  },
  agreementsSection: {
    marginBottom: 24,
  },
  agreementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  agreementText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 12,
  },
  linkText: {
    color: '#1E3A8A',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
  },
  registerButton: {
    marginBottom: 16,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  supportText: {
    color: '#1E3A8A',
    fontSize: 14,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 60,
    zIndex: 1000,
    elevation: 1000,
  },
  modalContent: {
    borderRadius: 20,
    height: '90%',
    width: '100%',
    zIndex: 1001,
    elevation: 1001,
  },
  modalHeader: {
    flexDirection: 'row',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 231, 235, 0.3)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalBody: {
    flex: 1,
    padding: 20,
  },
  modalText: {
    fontSize: 14,
    lineHeight: 22,
  },
});

export default DriverRegisterScreen;
