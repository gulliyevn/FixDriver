import React, { useState } from 'react';
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
import { useTheme } from '../../context/ThemeContext';
import { createClientRegisterScreenStyles, getPlaceholderColor } from '../../styles/screens/ClientRegisterScreen.styles';
import PasswordStrengthIndicator from '../../components/PasswordStrengthIndicator';
import SocialAuthButtons from '../../components/SocialAuthButtons';

const ClientRegisterScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  
  // Создаем стили с учетом текущей темы
  const styles = createClientRegisterScreenStyles(isDark);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev: any) => ({ ...prev, [field]: undefined }));
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      // Здесь должна быть логика регистрации через API
      Alert.alert(t('register.successTitle'), t('register.successText'));
      navigation.reset({ index: 0, routes: [{ name: 'Login' as never }] });
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
    <KeyboardAvoidingView
        style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={isDark ? "#60A5FA" : "#23408E"} />
            </TouchableOpacity>
            <Text style={styles.title}>{t('register.title')}</Text>
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
                placeholderTextColor={getPlaceholderColor(isDark)}
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
                placeholderTextColor={getPlaceholderColor(isDark)}
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
                placeholderTextColor={getPlaceholderColor(isDark)}
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
                placeholderTextColor={getPlaceholderColor(isDark)}
                keyboardType="phone-pad"
              />
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('register.password')} <Text style={styles.requiredStar}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={form.password}
                onChangeText={(v) => handleChange('password', v)}
                placeholder={t('register.passwordPlaceholder')}
                placeholderTextColor={getPlaceholderColor(isDark)}
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
                placeholderTextColor={getPlaceholderColor(isDark)}
                secureTextEntry
              />
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          </View>
            {/* Чекбокс согласия */}
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                onPress={() => setAgree(!agree)}
                style={[styles.checkbox, agree && styles.checkboxChecked]}
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
              <TouchableOpacity onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' as never }] })}>
                <Text style={styles.loginLinkSmall}>{t('register.loginLink')}</Text>
                  </TouchableOpacity>
                </View>
          </View>

          {/* Divider */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 24 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
            <Text style={{ marginHorizontal: 12, color: '#6B7280', fontSize: 16 }}>{t('login.or')}</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
          </View>
          <SocialAuthButtons />
      </ScrollView>
    </KeyboardAvoidingView>
    {/* Модалка для условий */}
    <Modal visible={showTerms} transparent animationType="fade" onRequestClose={() => setShowTerms(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{t('register.agreeTermsRich').match(/<terms>(.*?)<\/terms>/)?.[1] || t('register.terms')}</Text>
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
          <Text style={styles.modalTitle}>{t('register.agreeTermsRich').match(/<privacy>(.*?)<\/privacy>/)?.[1] || t('register.privacy')}</Text>
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

export default ClientRegisterScreen;