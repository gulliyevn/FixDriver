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
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../shared/i18n';
import { Button } from '../../components';
import { RegisterScreenStyles } from './RegisterScreen.styles';
import { DriverRegisterScreenStyles as driverStyles } from './DriverRegisterScreen.styles';
import SelectModal from '../../components/ui/SelectModal';
import DriverFields from './components/DriverFields';
import Header from './components/Header';
import PasswordFields from './components/PasswordFields';
import NameFields from './components/NameFields';
import ContactFields from './components/ContactFields';
import AgreementRow from './components/AgreementRow';
import { useRegisterForm } from './hooks/useRegisterForm';
 

interface RegisterScreenProps {
  navigation?: any;
  route?: {
    params?: {
      role?: 'client' | 'driver';
    };
  };
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  // Driver-only fields
  country?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  vehicleNumber?: string;
  experience?: string;
  tariff?: string;
  carBrand?: string;
  carModel?: string;
  carYear?: string;
  carMileage?: string;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation: propNavigation, route }) => {
  const navigation = propNavigation || useNavigation();
  
  const { t } = useI18n();
  
  // Get role from route params or default to client
  const role = route?.params?.role || 'client';
  
  // Use styles
  const styles = RegisterScreenStyles;

  const {
    formData,
    errors,
    loading,
    agree,
    showPassword,
    showConfirmPassword,
    setAgree,
    setShowPassword,
    setShowConfirmPassword,
    updateFormData,
    handleSelect: hookHandleSelect,
    submit,
  } = useRegisterForm(role as any);
  const [selectVisible, setSelectVisible] = useState(false);
  const [selectTitle, setSelectTitle] = useState('');
  const [selectField, setSelectField] = useState<keyof FormData | null>(null);
  const [selectOptions, setSelectOptions] = useState<{ label: string; value: string }[]>([]);

  // Validation handled inside useRegisterForm

  const handleRegister = async () => {
    await submit(() => {
      Alert.alert(
        t('auth.register.successTitle'),
        t('auth.register.successText'),
        [{ text: t('common.buttons.confirm'), onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' as never }] }) }]
      );
    });
  };

  // updateFormData provided by hook

  const handleBack = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'RoleSelect' as never }],
    });
  };

  const handleLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' as never }],
    });
  };

  const handleSelect = (field: keyof FormData, title: string) => {
    hookHandleSelect(field as any, title, (ttl, fld, opts) => {
      setSelectTitle(ttl);
      setSelectField(fld as any);
      setSelectOptions(opts);
      setSelectVisible(true);
    });
  };

  const getRoleTitle = () => {
    return t('auth.register.title');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Header t={t} styles={styles} onBack={handleBack} />

          {/* Form */}
          <View style={styles.form}>
            <NameFields
              t={t}
              styles={styles}
              errors={{ firstName: errors.firstName, lastName: errors.lastName }}
              values={{ firstName: formData.firstName, lastName: formData.lastName }}
              onChange={(f, v) => updateFormData(f as any, v)}
            />

            {role === 'driver' && null}

            <ContactFields
              t={t}
              styles={styles}
              errors={{ email: errors.email, phone: errors.phone }}
              values={{ email: formData.email, phone: formData.phone }}
              onChange={(f, v) => updateFormData(f as any, v)}
            />

            {/* Driver-specific fields (after email and phone) */}
            {role === 'driver' && (
              <DriverFields
                t={t}
                styles={styles}
                driverStyles={driverStyles}
                formData={formData}
                errors={errors}
                onChange={(field, value) => updateFormData(field as any, value)}
                onOpenSelect={(field, title) => handleSelect(field as any, title)}
              />
            )}

            

            <PasswordFields
              t={t}
              styles={styles}
              errors={{ password: errors.password, confirmPassword: errors.confirmPassword }}
              values={{ password: formData.password, confirmPassword: formData.confirmPassword }}
              onChange={(field, value) => updateFormData(field as any, value)}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              showConfirmPassword={showConfirmPassword}
              setShowConfirmPassword={setShowConfirmPassword}
            />

            <AgreementRow
              t={t}
              styles={styles}
              agree={agree}
              setAgree={setAgree}
              onOpen={(type) => navigation.navigate('Modal' as never, { type })}
            />

            

            <Button
              title={t('auth.register.registerButton')}
              onPress={handleRegister}
              loading={loading}
              disabled={loading || !agree}
              style={styles.registerButton}
            />
          </View>

          {/* Login Link */}
          <View style={styles.loginSection}>
            <Text style={styles.loginText}>{t('auth.register.haveAccount')} </Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginLink}>{t('auth.register.loginLink')}</Text>
            </TouchableOpacity>
          </View>

          

        </ScrollView>
      </KeyboardAvoidingView>

      <SelectModal
        visible={selectVisible}
        title={selectTitle}
        options={selectOptions}
        selected={selectField ? String((formData as any)[selectField] || '') : undefined}
        onSelect={(value) => {
          if (selectField) {
            updateFormData(selectField as any, value);
            if (selectField === 'carBrand') updateFormData('carModel', '');
          }
          setSelectVisible(false);
        }}
        onClose={() => setSelectVisible(false)}
      />
    </SafeAreaView>
  );
};

export default RegisterScreen;