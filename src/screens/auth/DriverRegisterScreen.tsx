import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLanguage } from '../../context/LanguageContext';
import { DriverRegisterScreenStyles as styles, PLACEHOLDER_COLOR } from '../../styles/screens/DriverRegisterScreen.styles';
import SocialAuthButtons from '../../components/SocialAuthButtons';
import Select from '../../components/Select';
import PasswordStrengthIndicator from '../../components/PasswordStrengthIndicator';
import vehicleSegments from '../../utils/vehicleSegments.json';
import { COUNTRIES } from '../../utils/countries';
import * as ImagePicker from 'expo-image-picker';


const DriverRegisterScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t, isLoading, language } = useLanguage();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    country: '',
    licenseNumber: '',
    licenseExpiry: '',
    vehicleNumber: '',
    experience: '',
    carBrand: '',
    carModel: '',
    carYear: '',
    carMileage: '',
    tariff: '',
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [brandOptions, setBrandOptions] = useState<{ label: string; value: string }[]>([]);
  const [modelOptions, setModelOptions] = useState<{ label: string; value: string; tariff?: string }[]>([]);
  const [licensePhoto, setLicensePhoto] = useState<string | null>(null);
  const [passportPhoto, setPassportPhoto] = useState<string | null>(null);


  useEffect(() => {
    if (form.tariff) {
      setBrandOptions(vehicleSegments[form.tariff]?.brands || []);
      setModelOptions([]);
      setForm((prev) => ({ ...prev, carBrand: '', carModel: '' }));
    }
  }, [form.tariff]);

  const carBrands = [
    { label: 'Mercedes', value: 'Mercedes' },
    { label: 'Toyota', value: 'Toyota' },
    { label: 'BMW', value: 'BMW' },
    { label: 'Hyundai', value: 'Hyundai' },
    // ... другие марки
  ];
  const carModelsByBrand: Record<string, { label: string; value: string; tariff?: string }[]> = {
    Mercedes: [
      { label: 'E-class', value: 'E-class', tariff: 'Plus' },
      { label: 'S-class', value: 'S-class', tariff: 'Premium' },
      { label: 'C-class', value: 'C-class', tariff: 'Basic' },
    ],
    Toyota: [
      { label: 'Camry', value: 'Camry', tariff: 'Plus' },
      { label: 'Corolla', value: 'Corolla', tariff: 'Basic' },
    ],
    BMW: [
      { label: '5 Series', value: '5 Series', tariff: 'Plus' },
      { label: '7 Series', value: '7 Series', tariff: 'Premium' },
      { label: '3 Series', value: '3 Series', tariff: 'Basic' },
    ],
    Hyundai: [
      { label: 'Sonata', value: 'Sonata', tariff: 'Basic' },
      { label: 'Genesis', value: 'Genesis', tariff: 'Plus' },
    ],
    // ... другие бренды
  };
  const tariffOptions = [
    { label: t('register.tariffBasic') || 'Базовый', value: 'Basic' },
    { label: t('register.tariffPlus') || 'Плюс', value: 'Plus' },
    { label: t('register.tariffPremium') || 'Премиум', value: 'Premium' },
  ];

  const experienceOptions = [
    { label: '0-1 лет', value: '0-1' },
    { label: '1-2 года', value: '1-2' },
    { label: '2-3 года', value: '2-3' },
    { label: '3-4 года', value: '3-4' },
    { label: '4-5 лет', value: '4-5' },
    { label: '5-6 лет', value: '5-6' },
    { label: '6-7 лет', value: '6-7' },
    { label: '7-8 лет', value: '7-8' },
    { label: '8-9 лет', value: '8-9' },
    { label: '9-10 лет', value: '9-10' },
    { label: '10-11 лет', value: '10-11' },
    { label: '11-12 лет', value: '11-12' },
    { label: '12-13 лет', value: '12-13' },
    { label: '13-14 лет', value: '13-14' },
    { label: '14-15 лет', value: '14-15' },
    { label: '15-16 лет', value: '15-16' },
    { label: '16-17 лет', value: '16-17' },
    { label: '17-18 лет', value: '17-18' },
    { label: '18-19 лет', value: '18-19' },
    { label: '19-20 лет', value: '19-20' },
    { label: '20-21 год', value: '20-21' },
    { label: '21-22 года', value: '21-22' },
    { label: '22-23 года', value: '22-23' },
    { label: '23-24 года', value: '23-24' },
    { label: '24-25 лет', value: '24-25' },
    { label: '25-26 лет', value: '25-26' },
    { label: '26-27 лет', value: '26-27' },
    { label: '27-28 лет', value: '27-28' },
    { label: '28-29 лет', value: '28-29' },
    { label: '29-30 лет', value: '29-30' },
    { label: '30+ лет', value: '30+' },
  ];

  // Генерируем годы от 1990 до текущего года + 1
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let year = currentYear + 1; year >= 1990; year--) {
    yearOptions.push({ label: year.toString(), value: year.toString() });
  }

  console.log('tariffOptions перед Select:', tariffOptions);

  const handleChange = (field: string, value: string) => {
    if (field === 'licenseExpiry') {
      // Если пользователь удаляет символы, разрешаем это
      if (value.length < form.licenseExpiry.length) {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev: any) => ({ ...prev, [field]: undefined }));
        return;
      }
      
      // Обработка поля даты с автоформатированием
      let formattedValue = value.replace(/[^0-9]/g, ''); // Убираем все кроме цифр
      
      // Валидация в реальном времени только для новых цифр
      if (formattedValue.length >= 1) {
        const day = parseInt(formattedValue.slice(0, 2));
        if (day > 31) {
          return; // Блокируем ввод
        }
      }
      
      if (formattedValue.length >= 3) {
        const month = parseInt(formattedValue.slice(2, 4));
        if (month > 12) {
          return; // Блокируем ввод
        }
      }
      
      // Для годов проверяем только когда введены все 4 цифры
      if (formattedValue.length >= 8) {
        const year = parseInt(formattedValue.slice(4, 8));
        if (year < 2025 || year > 2040) {
          return; // Блокируем ввод
        }
      }
      
      // Добавляем точки автоматически после 2 и 4 цифр
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '.' + formattedValue.slice(2);
      }
      if (formattedValue.length >= 5) {
        formattedValue = formattedValue.slice(0, 5) + '.' + formattedValue.slice(5);
      }
      
      // Ограничиваем длину до 10 символов (ДД.ММ.ГГГГ)
      if (formattedValue.length > 10) {
        formattedValue = formattedValue.slice(0, 10);
      }
      
      setForm((prev) => ({ ...prev, [field]: formattedValue }));
      
      // Финальная валидация даты
      if (formattedValue.length === 10) {
        const parts = formattedValue.split('.');
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const year = parseInt(parts[2]);
        
        const today = new Date();
        const inputDate = new Date(year, month - 1, day);
        
        let error = null;
        
        if (day > 31) {
          error = 'День не может быть больше 31';
        } else if (month > 12) {
          error = 'Месяц не может быть больше 12';
        } else if (year < 2025 || year > 2040) {
          error = 'Год должен быть от 2025 до 2040';
        } else if (inputDate < today) {
          error = 'Дата не может быть меньше сегодняшнего дня';
        }
        
        setErrors((prev: any) => ({ ...prev, [field]: error }));
      } else {
        setErrors((prev: any) => ({ ...prev, [field]: undefined }));
      }
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev: any) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBrandChange = (brand: string) => {
    setForm((prev) => ({ ...prev, carBrand: brand, carModel: '' }));
    setModelOptions(vehicleSegments[form.tariff]?.models[brand] || []);
  };
  const handleModelChange = (model: string) => {
    setForm((prev) => ({ ...prev, carModel: model }));
    // Автоматически выставлять тариф, если у модели есть жёсткое соответствие
    const selectedBrand = form.carBrand;
    const found = (carModelsByBrand[selectedBrand] || []).find((m) => m.value === model);
    if (found?.tariff) {
      setForm((prev) => ({ ...prev, tariff: found.tariff }));
    }
  };
  const handleTariffChange = (tariff: string) => {
    setForm((prev) => ({ ...prev, tariff }));
  };

  const handleExperienceChange = (option: { label: string; value: string | number }) => {
    setForm((prev) => ({ ...prev, experience: option.value.toString() }));
    setErrors((prev: any) => ({ ...prev, experience: undefined }));
  };

  const handleCountryChange = (option: { label: string; value: string | number }) => {
    setForm((prev) => ({ ...prev, country: option.value.toString() }));
    setErrors((prev: any) => ({ ...prev, country: undefined }));
  };



  const handleYearChange = (option: { label: string; value: string | number }) => {
    setForm((prev) => ({ ...prev, carYear: option.value.toString() }));
    setErrors((prev: any) => ({ ...prev, carYear: undefined }));
  };

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Ошибка', 'Необходим доступ к галерее для выбора фото');
      return false;
    }
    return true;
  };

  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Ошибка', 'Необходим доступ к камере для съемки фото');
      return false;
    }
    return true;
  };

  const showImagePickerOptions = (type: 'license' | 'passport') => {
    Alert.alert(
      'Выберите способ',
      'Как вы хотите добавить фото?',
      [
        {
          text: 'Камера',
          onPress: () => handleTakePhoto(type),
        },
        {
          text: 'Галерея',
          onPress: () => handlePickImage(type),
        },
        {
          text: 'Отмена',
          style: 'cancel',
        },
      ]
    );
  };

  const handleTakePhoto = async (type: 'license' | 'passport') => {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        if (type === 'license') {
          setLicensePhoto(result.assets[0].uri);
          setErrors((prev: any) => ({ ...prev, licensePhoto: undefined }));
        } else {
          setPassportPhoto(result.assets[0].uri);
          setErrors((prev: any) => ({ ...prev, passportPhoto: undefined }));
        }
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сделать фото');
    }
  };

  const handlePickImage = async (type: 'license' | 'passport') => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        if (type === 'license') {
          setLicensePhoto(result.assets[0].uri);
          setErrors((prev: any) => ({ ...prev, licensePhoto: undefined }));
        } else {
          setPassportPhoto(result.assets[0].uri);
          setErrors((prev: any) => ({ ...prev, passportPhoto: undefined }));
        }
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось выбрать фото');
    }
  };

  const handleSelectLicensePhoto = () => {
    showImagePickerOptions('license');
  };

  const handleSelectPassportPhoto = () => {
    showImagePickerOptions('passport');
  };



  const validate = () => {
    const newErrors: any = {};
    if (!form.firstName.trim()) newErrors.firstName = t('register.firstNameRequired');
    if (!form.lastName.trim()) newErrors.lastName = t('register.lastNameRequired');
    if (!form.email.trim()) newErrors.email = t('register.emailRequired');
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = t('register.emailInvalid');
    if (!form.phone.trim()) newErrors.phone = t('register.phoneRequired');
    if (!form.password) newErrors.password = t('register.passwordRequired');
    else if (form.password.length < 8) newErrors.password = 'Пароль должен содержать минимум 8 символов';
    else if (!/(?=.*[a-z])/.test(form.password)) newErrors.password = 'Пароль должен содержать строчные буквы';
    else if (!/(?=.*[A-Z])/.test(form.password)) newErrors.password = 'Пароль должен содержать заглавные буквы';
    else if (!/(?=.*\d)/.test(form.password)) newErrors.password = 'Пароль должен содержать цифры';
    else if (!/(?=.*[!@#$%^&*])/.test(form.password)) newErrors.password = 'Пароль должен содержать специальные символы (!@#$%^&*)';
    if (form.confirmPassword !== form.password) newErrors.confirmPassword = t('register.passwordsDontMatch');
    if (!form.licenseExpiry) newErrors.licenseExpiry = 'Введите срок действия прав';
    else if (form.licenseExpiry.length !== 10) newErrors.licenseExpiry = 'Введите дату в формате ДД.ММ.ГГГГ';
    if (!licensePhoto) newErrors.licensePhoto = 'Необходимо загрузить фото водительских прав';
    if (!passportPhoto) newErrors.passportPhoto = 'Необходимо загрузить фото техпаспорта';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      // Здесь должна быть логика регистрации через API
      Alert.alert(t('register.successTitle'), t('register.successText'));
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (e) {
      Alert.alert(t('register.errorTitle'), t('register.errorText'));
    } finally {
      setLoading(false);
    }
  };

  const agreeTermsRich = t('register.agreeTermsRich');
  const termsMatch = agreeTermsRich.match(/<terms>(.*?)<\/terms>/);
  const privacyMatch = agreeTermsRich.match(/<privacy>(.*?)<\/privacy>/);
  const beforeTerms = agreeTermsRich.split('<terms>')[0];
  const afterTerms = agreeTermsRich.split('<terms>')[1]?.split('</terms>')[1]?.split('<privacy>')[0] || '';
  const afterPrivacy = agreeTermsRich.split('</privacy>')[1] || '';

  if (isLoading) return null;



  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
    <KeyboardAvoidingView
        style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#23408E" />
            </TouchableOpacity>
            <Text style={styles.title}>Регистрация водителя</Text>
            <Text style={styles.subtitle}>Создайте новый аккаунт Водителя</Text>
        </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('register.firstName')}</Text>
              <TextInput
                style={styles.input}
                value={form.firstName}
                onChangeText={(v) => handleChange('firstName', v)}
                placeholder={t('register.firstNamePlaceholder')}
                placeholderTextColor={PLACEHOLDER_COLOR}
                autoCapitalize="words"
              />
              {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('register.lastName')}</Text>
              <TextInput
                style={styles.input}
                value={form.lastName}
                onChangeText={(v) => handleChange('lastName', v)}
                placeholder={t('register.lastNamePlaceholder')}
                placeholderTextColor={PLACEHOLDER_COLOR}
                autoCapitalize="words"
              />
              {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('register.email')}</Text>
              <TextInput
                style={styles.input}
                value={form.email}
                onChangeText={(v) => handleChange('email', v)}
                placeholder={t('register.emailPlaceholder')}
                placeholderTextColor={PLACEHOLDER_COLOR}
              keyboardType="email-address"
              autoCapitalize="none"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('register.phone')}</Text>
              <TextInput
                style={styles.input}
                value={form.phone}
                onChangeText={(v) => handleChange('phone', v)}
                placeholder={t('register.phonePlaceholder')}
                placeholderTextColor={PLACEHOLDER_COLOR}
                keyboardType="phone-pad"
              />
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Страна выдачи документа</Text>
            <Select
                value={form.country}
                onSelect={(option) => handleCountryChange(option)}
                options={COUNTRIES.map(country => ({ label: country.name, value: country.code }))}
                placeholder="Выберите страну"
                searchable={true}
              />
              {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Номер водительских прав</Text>
              <TextInput
                style={styles.input}
                value={form.licenseNumber}
                onChangeText={(v) => handleChange('licenseNumber', v)}
                placeholder="Введите номер прав"
                placeholderTextColor={PLACEHOLDER_COLOR}
                autoCapitalize="characters"
              />
              {errors.licenseNumber && <Text style={styles.errorText}>{errors.licenseNumber}</Text>}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Срок действия прав</Text>
              <TextInput
                style={styles.input}
                value={form.licenseExpiry}
                onChangeText={(v) => handleChange('licenseExpiry', v)}
                placeholder="ДД.ММ.ГГГГ"
                placeholderTextColor={PLACEHOLDER_COLOR}
                keyboardType="numeric"
                maxLength={10}
              />
              {errors.licenseExpiry && <Text style={styles.errorText}>{errors.licenseExpiry}</Text>}
            </View>

            {/* Загрузка фото водительских прав */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Фото водительских прав</Text>
              <TouchableOpacity style={styles.uploadButton} onPress={handleSelectLicensePhoto}>
                <Ionicons name="camera-outline" size={24} color="#23408E" />
                <Text style={styles.uploadButtonText}>
                  {licensePhoto ? 'Изменить фото' : 'Выбрать фото'}
                </Text>
              </TouchableOpacity>
              {licensePhoto && (
                <View style={styles.photoPreview}>
                  <Text style={styles.photoPreviewText}>✓ Фото загружено</Text>
                </View>
              )}
              {errors.licensePhoto && <Text style={styles.errorText}>{errors.licensePhoto}</Text>}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Номер автомобиля</Text>
              <TextInput
                style={styles.input}
                value={form.vehicleNumber}
                onChangeText={(v) => handleChange('vehicleNumber', v)}
                placeholder="Введите номер авто"
                placeholderTextColor={PLACEHOLDER_COLOR}
                autoCapitalize="characters"
              />
              {errors.vehicleNumber && <Text style={styles.errorText}>{errors.vehicleNumber}</Text>}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Стаж вождения (лет)</Text>
              <Select
                value={form.experience}
                onSelect={(option) => handleExperienceChange(option)}
                options={experienceOptions}
                placeholder="Выберите стаж вождения"
              />
              {errors.experience && <Text style={styles.errorText}>{errors.experience}</Text>}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Тариф</Text>
              <Select
                value={form.tariff}
                onSelect={(option) => handleTariffChange(option.value)}
                options={tariffOptions}
                placeholder="Выберите тариф"
              />
              {errors.tariff && <Text style={styles.errorText}>{errors.tariff}</Text>}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Марка автомобиля</Text>
              <Select
                value={form.carBrand}
                onSelect={(option) => handleBrandChange(option.value)}
                options={brandOptions}
                placeholder="Выберите марку авто"
                disabled={!form.tariff}
              />
              {errors.carBrand && <Text style={styles.errorText}>{errors.carBrand}</Text>}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Модель автомобиля</Text>
              <Select
                value={form.carModel}
                onSelect={(option) => handleModelChange(option.value)}
                options={modelOptions}
                placeholder="Выберите модель авто"
                disabled={!form.carBrand}
              />
              {errors.carModel && <Text style={styles.errorText}>{errors.carModel}</Text>}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Год выпуска</Text>
            <Select
                value={form.carYear}
                onSelect={handleYearChange}
                options={yearOptions}
                placeholder="Выберите год выпуска"
              />
              {errors.carYear && <Text style={styles.errorText}>{errors.carYear}</Text>}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Пробег (км)</Text>
              <TextInput
                style={styles.input}
                value={form.carMileage}
                onChangeText={(v) => handleChange('carMileage', v)}
                placeholder="Введите пробег авто"
                placeholderTextColor={PLACEHOLDER_COLOR}
                keyboardType="numeric"
              />
              {errors.carMileage && <Text style={styles.errorText}>{errors.carMileage}</Text>}
          </View>

            {/* Загрузка фото техпаспорта */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Фото техпаспорта</Text>
              <TouchableOpacity style={styles.uploadButton} onPress={handleSelectPassportPhoto}>
                <Ionicons name="document-outline" size={24} color="#23408E" />
                <Text style={styles.uploadButtonText}>
                  {passportPhoto ? 'Изменить фото' : 'Выбрать фото'}
                </Text>
              </TouchableOpacity>
              {passportPhoto && (
                <View style={styles.photoPreview}>
                  <Text style={styles.photoPreviewText}>✓ Фото загружено</Text>
                </View>
              )}
              {errors.passportPhoto && <Text style={styles.errorText}>{errors.passportPhoto}</Text>}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('register.password')}</Text>
              <TextInput
                style={styles.input}
                value={form.password}
                onChangeText={(v) => handleChange('password', v)}
                placeholder={t('register.passwordPlaceholder')}
                placeholderTextColor={PLACEHOLDER_COLOR}
                secureTextEntry
              />
              {form.password && <PasswordStrengthIndicator value={form.password} showFeedback={true} />}
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('register.confirmPassword')}</Text>
              <TextInput
                style={styles.input}
                value={form.confirmPassword}
                onChangeText={(v) => handleChange('confirmPassword', v)}
                placeholder={t('register.confirmPasswordPlaceholder')}
                placeholderTextColor={PLACEHOLDER_COLOR}
                secureTextEntry
              />
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>
            {/* Чекбокс согласия */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', flex: 1 }}>
              <TouchableOpacity
                onPress={() => setAgree(!agree)}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  borderWidth: 2,
                  borderColor: agree ? '#23408E' : '#E5E7EB',
                  backgroundColor: agree ? '#23408E' : '#fff',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 8,
                }}
              >
                {agree && <Ionicons name="checkmark" size={18} color="#fff" />}
              </TouchableOpacity>
              <Text style={styles.agreeText}>
                {beforeTerms as React.ReactNode}
                <Text style={styles.link} onPress={() => setShowTerms(true)}>{termsMatch ? termsMatch[1] : ''}</Text>
                {afterTerms as React.ReactNode}
                <Text style={styles.link} onPress={() => setShowPrivacy(true)}>{privacyMatch ? privacyMatch[1] : ''}</Text>
                {afterPrivacy as React.ReactNode}
              </Text>
            </View>
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading || !agree}>
              <Text style={styles.registerButtonText}>{loading ? t('register.loading') : t('register.button')}</Text>
            </TouchableOpacity>
            <View style={styles.loginRow}>
              <Text style={styles.alreadyRegisteredText}>{t('register.alreadyRegistered')}</Text>
              <TouchableOpacity onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}>
                <Text style={styles.loginLinkSmall}>{t('register.loginLink')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* Модалка для условий */}
      <Modal visible={showTerms} transparent animationType="fade" onRequestClose={() => setShowTerms(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{termsMatch ? termsMatch[1] : 'Условия'}</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              <Text style={styles.modalText}>{t('register.termsText')}</Text>
            </ScrollView>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowTerms(false)}>
              <Text style={styles.modalCloseText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Модалка для политики */}
      <Modal visible={showPrivacy} transparent animationType="fade" onRequestClose={() => setShowPrivacy(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{privacyMatch ? privacyMatch[1] : 'Политика'}</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              <Text style={styles.modalText}>{t('register.privacyText')}</Text>
            </ScrollView>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowPrivacy(false)}>
              <Text style={styles.modalCloseText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      

    </SafeAreaView>
  );
};

export default DriverRegisterScreen;
