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
  Image,
  ActivityIndicator,
  Linking,
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
  const [uploadingPhoto, setUploadingPhoto] = useState<'license' | 'passport' | null>(null);


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
    { label: t('register.tariffBasic'), value: 'Basic' },
    { label: t('register.tariffPlus'), value: 'Plus' },
    { label: t('register.tariffPremium'), value: 'Premium' },
  ];

  const experienceOptions = [
    { label: 'До 1 года', value: '0-1' },
    { label: '1 год', value: '1' },
    { label: '2 года', value: '2' },
    { label: '3 года', value: '3' },
    { label: '4 года', value: '4' },
    { label: '5 лет', value: '5' },
    { label: '6 лет', value: '6' },
    { label: '7 лет', value: '7' },
    { label: '8 лет', value: '8' },
    { label: '9 лет', value: '9' },
    { label: '10 лет', value: '10' },
    { label: '11 лет', value: '11' },
    { label: '12 лет', value: '12' },
    { label: '13 лет', value: '13' },
    { label: '14 лет', value: '14' },
    { label: '15 лет', value: '15' },
    { label: '16 лет', value: '16' },
    { label: '17 лет', value: '17' },
    { label: '18 лет', value: '18' },
    { label: '19 лет', value: '19' },
    { label: '20 лет', value: '20' },
    { label: '21 год', value: '21' },
    { label: '22 года', value: '22' },
    { label: '23 года', value: '23' },
    { label: '24 года', value: '24' },
    { label: '25 лет', value: '25' },
    { label: '26 лет', value: '26' },
    { label: '27 лет', value: '27' },
    { label: '28 лет', value: '28' },
    { label: '29 лет', value: '29' },
    { label: '30 лет', value: '30' },
    { label: '30+ лет', value: '30+' },
  ];

  // Генерируем годы от 1990 до текущего года + 1
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let year = currentYear + 1; year >= 1990; year--) {
    yearOptions.push({ label: year.toString(), value: year.toString() });
  }

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
                  error = t('register.dayTooBig');
      } else if (month > 12) {
        error = t('register.monthTooBig');
      } else if (year < 2025 || year > 2040) {
        error = t('register.yearRange');
      } else if (inputDate < today) {
        error = t('register.dateTooEarly');
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
      Alert.alert(
        t('register.galleryAccess'),
        t('register.galleryAccessRequired'),
        [
          { text: t('register.cancel'), style: 'cancel' },
          { text: t('register.settings'), onPress: () => Linking.openSettings() }
        ]
      );
      return false;
    }
    return true;
  };

  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        t('register.cameraAccess'),
        t('register.cameraAccessRequired'),
        [
          { text: t('register.cancel'), style: 'cancel' },
          { text: t('register.settings'), onPress: () => Linking.openSettings() }
        ]
      );
      return false;
    }
    return true;
  };

  const showImagePickerOptions = (type: 'license' | 'passport') => {
    Alert.alert(
      t('register.selectMethod'),
      t('register.howToAddPhoto'),
      [
        {
          text: t('register.camera'),
          onPress: () => handleTakePhoto(type),
        },
        {
          text: t('register.gallery'),
          onPress: () => handlePickImage(type),
        },
        {
          text: t('register.cancel'),
          style: 'cancel',
        },
      ]
    );
  };

  const handleTakePhoto = async (type: 'license' | 'passport') => {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return;

    setUploadingPhoto(type);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const photoUri = result.assets[0].uri;
        if (type === 'license') {
          setLicensePhoto(photoUri);
          setErrors((prev: any) => ({ ...prev, licensePhoto: undefined }));
        } else {
          setPassportPhoto(photoUri);
          setErrors((prev: any) => ({ ...prev, passportPhoto: undefined }));
        }
      }
    } catch (error) {
      Alert.alert(t('register.photoError'), t('register.photoTakeError'));
    } finally {
      setUploadingPhoto(null);
    }
  };

  const handlePickImage = async (type: 'license' | 'passport') => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setUploadingPhoto(type);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const photoUri = result.assets[0].uri;
        if (type === 'license') {
          setLicensePhoto(photoUri);
          setErrors((prev: any) => ({ ...prev, licensePhoto: undefined }));
        } else {
          setPassportPhoto(photoUri);
          setErrors((prev: any) => ({ ...prev, passportPhoto: undefined }));
        }
      }
    } catch (error) {
      Alert.alert(t('register.photoError'), t('register.photoPickError'));
    } finally {
      setUploadingPhoto(null);
    }
  };

  const handleRemovePhoto = (type: 'license' | 'passport') => {
    Alert.alert(
      t('register.deletePhoto'),
      t('register.deletePhotoConfirm'),
      [
        { text: t('register.cancel'), style: 'cancel' },
        {
          text: t('register.delete'),
          style: 'destructive',
          onPress: () => {
            if (type === 'license') {
              setLicensePhoto(null);
              setErrors((prev: any) => ({ ...prev, licensePhoto: t('register.licensePhotoRequired') }));
            } else {
              setPassportPhoto(null);
              setErrors((prev: any) => ({ ...prev, passportPhoto: t('register.passportPhotoRequired') }));
            }
          }
        }
      ]
    );
  };

  const handleSelectLicensePhoto = () => {
    showImagePickerOptions('license');
  };

  const handleSelectPassportPhoto = () => {
    showImagePickerOptions('passport');
  };



  const validate = () => {
    const newErrors: any = {};
    
    // Основная информация
    if (!form.firstName.trim()) newErrors.firstName = t('register.firstNameRequired');
    if (!form.lastName.trim()) newErrors.lastName = t('register.lastNameRequired');
    if (!form.email.trim()) newErrors.email = t('register.emailRequired');
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = t('register.emailInvalid');
    if (!form.phone.trim()) newErrors.phone = t('register.phoneRequired');
    
    // Пароль
    if (!form.password) newErrors.password = t('register.passwordRequired');
    else if (form.password.length < 8) newErrors.password = t('register.passwordShort');
    else if (!/(?=.*[a-z])/.test(form.password)) newErrors.password = t('register.passwordLowercase');
    else if (!/(?=.*[A-Z])/.test(form.password)) newErrors.password = t('register.passwordUppercase');
    else if (!/(?=.*\d)/.test(form.password)) newErrors.password = t('register.passwordNumbers');
    else if (!/(?=.*[!@#$%^&*])/.test(form.password)) newErrors.password = t('register.passwordSpecial');
    if (form.confirmPassword !== form.password) newErrors.confirmPassword = t('register.passwordsDontMatch');
    
    // Документы
    if (!form.country) newErrors.country = t('register.countryRequired');
    if (!form.licenseNumber.trim()) newErrors.licenseNumber = t('register.licenseNumberRequired');
    if (!form.licenseExpiry) newErrors.licenseExpiry = t('register.licenseExpiryRequired');
    else if (form.licenseExpiry.length !== 10) newErrors.licenseExpiry = t('register.licenseExpiryInvalid');
    if (!licensePhoto) newErrors.licensePhoto = t('register.licensePhotoRequired');
    if (!passportPhoto) newErrors.passportPhoto = t('register.passportPhotoRequired');
    
    // Информация об автомобиле
    if (!form.vehicleNumber.trim()) newErrors.vehicleNumber = t('register.vehicleNumberRequired');
    if (!form.experience) newErrors.experience = t('register.experienceRequired');
    if (!form.tariff) newErrors.tariff = t('register.tariffRequired');
    if (!form.carBrand) newErrors.carBrand = t('register.carBrandRequired');
    if (!form.carModel) newErrors.carModel = t('register.carModelRequired');
    if (!form.carYear) newErrors.carYear = t('register.carYearRequired');
    if (!form.carMileage.trim()) newErrors.carMileage = t('register.carMileageRequired');
    
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
            <Text style={styles.title}>{t('register.titleDriver')}</Text>
            <Text style={styles.subtitle}>{t('register.subtitle')}</Text>
        </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('register.firstName')} <Text style={styles.requiredStar}>*</Text></Text>
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
              <Text style={styles.label}>{t('register.lastName')} <Text style={styles.requiredStar}>*</Text></Text>
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
              <Text style={styles.label}>{t('register.email')} <Text style={styles.requiredStar}>*</Text></Text>
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
              <Text style={styles.label}>{t('register.phone')} <Text style={styles.requiredStar}>*</Text></Text>
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
              <Text style={styles.label}>{t('register.countryOfIssue')} <Text style={styles.requiredStar}>*</Text></Text>
            <Select
                value={form.country}
                onSelect={(option) => handleCountryChange(option)}
                options={COUNTRIES.map(country => ({ label: country.name, value: country.code }))}
                placeholder={t('register.countryOfIssuePlaceholder')}
                searchable={true}
              />
              {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('register.licenseNumber')} <Text style={styles.requiredStar}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={form.licenseNumber}
                onChangeText={(v) => handleChange('licenseNumber', v)}
                placeholder={t('register.licenseNumberPlaceholder')}
                placeholderTextColor={PLACEHOLDER_COLOR}
                autoCapitalize="characters"
                textContentType="none"
                autoComplete="off"
              />
              {errors.licenseNumber && <Text style={styles.errorText}>{errors.licenseNumber}</Text>}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('register.licenseExpiry')} <Text style={styles.requiredStar}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={form.licenseExpiry}
                onChangeText={(v) => handleChange('licenseExpiry', v)}
                placeholder={t('register.licenseExpiryPlaceholder')}
                placeholderTextColor={PLACEHOLDER_COLOR}
                keyboardType="numbers-and-punctuation"
                maxLength={10}
                textContentType="none"
                autoComplete="off"
              />
              {errors.licenseExpiry && <Text style={styles.errorText}>{errors.licenseExpiry}</Text>}
            </View>

            {/* Загрузка фото водительских прав */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('register.licensePhoto')} <Text style={styles.requiredStar}>*</Text></Text>
              <TouchableOpacity 
                style={[styles.uploadButton, uploadingPhoto === 'license' && styles.uploadButtonDisabled]} 
                onPress={handleSelectLicensePhoto}
                disabled={uploadingPhoto === 'license'}
              >
                {uploadingPhoto === 'license' ? (
                  <ActivityIndicator size="small" color="#23408E" />
                ) : (
                  <Ionicons name="camera-outline" size={24} color="#23408E" />
                )}
                <Text style={styles.uploadButtonText}>
                  {uploadingPhoto === 'license' 
                    ? t('register.uploading')
                    : licensePhoto 
                      ? t('register.changePhoto')
                      : t('register.uploadPhoto')
                  }
                </Text>
              </TouchableOpacity>
              {licensePhoto && (
                <View style={styles.photoPreview}>
                  <Image source={{ uri: licensePhoto }} style={styles.photoPreviewImage} />
                  <TouchableOpacity style={styles.removePhotoButton} onPress={() => handleRemovePhoto('license')}>
                    <Ionicons name="close-circle" size={24} color="#FF0000" />
                  </TouchableOpacity>
                  <Text style={styles.photoPreviewText}>{t('register.photoUploaded')}</Text>
                </View>
              )}
              {errors.licensePhoto && <Text style={styles.errorText}>{errors.licensePhoto}</Text>}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('register.vehicleNumber')} <Text style={styles.requiredStar}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={form.vehicleNumber}
                onChangeText={(v) => handleChange('vehicleNumber', v)}
                placeholder={t('register.vehicleNumberPlaceholder')}
                placeholderTextColor={PLACEHOLDER_COLOR}
                autoCapitalize="characters"
              />
              {errors.vehicleNumber && <Text style={styles.errorText}>{errors.vehicleNumber}</Text>}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('register.experience')} <Text style={styles.requiredStar}>*</Text></Text>
              <Select
                value={form.experience}
                onSelect={(option) => handleExperienceChange(option)}
                options={experienceOptions}
                placeholder={t('register.experienceRequired')}
              />
              {errors.experience && <Text style={styles.errorText}>{errors.experience}</Text>}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('register.tariff')} <Text style={styles.requiredStar}>*</Text></Text>
              <Select
                value={form.tariff}
                onSelect={(option) => handleTariffChange(option.value)}
                options={tariffOptions}
                placeholder={t('register.tariffRequired')}
              />
              {errors.tariff && <Text style={styles.errorText}>{errors.tariff}</Text>}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('register.carBrand')} <Text style={styles.requiredStar}>*</Text></Text>
              <Select
                value={form.carBrand}
                onSelect={(option) => handleBrandChange(option.value)}
                options={brandOptions}
                placeholder={t('register.carBrandRequired')}
                disabled={!form.tariff}
              />
              {errors.carBrand && <Text style={styles.errorText}>{errors.carBrand}</Text>}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('register.carModel')} <Text style={styles.requiredStar}>*</Text></Text>
              <Select
                value={form.carModel}
                onSelect={(option) => handleModelChange(option.value)}
                options={modelOptions}
                placeholder={t('register.carModelRequired')}
                disabled={!form.carBrand}
              />
              {errors.carModel && <Text style={styles.errorText}>{errors.carModel}</Text>}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('register.carYear')} <Text style={styles.requiredStar}>*</Text></Text>
            <Select
                value={form.carYear}
                onSelect={handleYearChange}
                options={yearOptions}
                placeholder={t('register.carYearRequired')}
              />
              {errors.carYear && <Text style={styles.errorText}>{errors.carYear}</Text>}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('register.carMileage')} <Text style={styles.requiredStar}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={form.carMileage}
                onChangeText={(v) => handleChange('carMileage', v)}
                placeholder={t('register.carMileagePlaceholder')}
                placeholderTextColor={PLACEHOLDER_COLOR}
                keyboardType="numeric"
              />
              {errors.carMileage && <Text style={styles.errorText}>{errors.carMileage}</Text>}
          </View>

            {/* Загрузка фото техпаспорта */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('register.passportPhoto')} <Text style={styles.requiredStar}>*</Text></Text>
              <TouchableOpacity 
                style={[styles.uploadButton, uploadingPhoto === 'passport' && styles.uploadButtonDisabled]} 
                onPress={handleSelectPassportPhoto}
                disabled={uploadingPhoto === 'passport'}
              >
                {uploadingPhoto === 'passport' ? (
                  <ActivityIndicator size="small" color="#23408E" />
                ) : (
                  <Ionicons name="document-outline" size={24} color="#23408E" />
                )}
                <Text style={styles.uploadButtonText}>
                  {uploadingPhoto === 'passport' 
                    ? t('register.uploading')
                    : passportPhoto 
                      ? t('register.changePhoto')
                      : t('register.uploadPhoto')
                  }
                </Text>
              </TouchableOpacity>
              {passportPhoto && (
                <View style={styles.photoPreview}>
                  <Image source={{ uri: passportPhoto }} style={styles.photoPreviewImage} />
                  <TouchableOpacity style={styles.removePhotoButton} onPress={() => handleRemovePhoto('passport')}>
                    <Ionicons name="close-circle" size={24} color="#FF0000" />
                  </TouchableOpacity>
                  <Text style={styles.photoPreviewText}>{t('register.photoUploaded')}</Text>
                </View>
              )}
              {errors.passportPhoto && <Text style={styles.errorText}>{errors.passportPhoto}</Text>}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('register.password')} <Text style={styles.requiredStar}>*</Text></Text>
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
              <Text style={styles.label}>{t('register.confirmPassword')} <Text style={styles.requiredStar}>*</Text></Text>
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
            <Text style={styles.modalTitle}>{termsMatch ? termsMatch[1] : t('register.terms')}</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              <Text style={styles.modalText}>{t('register.termsText')}</Text>
            </ScrollView>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowTerms(false)}>
              <Text style={styles.modalCloseText}>{t('register.ok')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Модалка для политики */}
      <Modal visible={showPrivacy} transparent animationType="fade" onRequestClose={() => setShowPrivacy(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{privacyMatch ? privacyMatch[1] : t('register.privacy')}</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              <Text style={styles.modalText}>{t('register.privacyText')}</Text>
            </ScrollView>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowPrivacy(false)}>
              <Text style={styles.modalCloseText}>{t('register.ok')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      

    </SafeAreaView>
  );
};

export default DriverRegisterScreen;
