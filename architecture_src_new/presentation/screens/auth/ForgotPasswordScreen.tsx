import React, { useState } from 'react';
import { SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, View, Text, TextInput, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../shared/i18n';
import { Button } from '../../components';
import { ForgotPasswordScreenStyles as styles } from './ForgotPasswordScreen.styles';
import { AuthRepository } from '../../../data/repositories/AuthRepository';
import { getCurrentColors } from '../../../shared/constants/colors';
import { SUPPORT_CONTACTS } from '../../../shared/constants/contacts';
import OTPModal from '../../components/ui/OTPModal';

interface ForgotPasswordScreenProps {
  navigation: {
    goBack: () => void;
    navigate: (screen: string, params?: any) => void;
    canGoBack?: () => boolean;
  };
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const { t } = useI18n();
  const colors = getCurrentColors(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [otpVisible, setOtpVisible] = useState(false);
  const [otpError, setOtpError] = useState<boolean>(false);

  const validate = () => {
    if (!email.trim()) {
      setError(t('auth.login.emailRequired'));
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(t('auth.login.emailInvalid'));
      return false;
    }
    setError(null);
    return true;
  };

  const handleSend = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      console.log('📧 Sending password reset for:', email);
      const repo = new AuthRepository();
      const { requestId } = await repo.sendPasswordReset(email);
      console.log('✅ Password reset sent, requestId:', requestId);
      setRequestId(requestId);
      setOtpVisible(true);
      setOtpError(false);
    } catch (e) {
      console.error('❌ Failed to send password reset:', e);
      setError(t('auth.forgotPassword.failedToSend'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation.navigate('Login');
    }
  };

  const handleContactSupport = () => {
    const phoneNumber = SUPPORT_CONTACTS.WHATSAPP;
    const message = encodeURIComponent(t('auth.forgotPassword.supportMessage'));
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
    Linking.canOpenURL(whatsappUrl).then(supported => {
      if (supported) {
        Linking.openURL(whatsappUrl);
      } else {
        const webUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        Linking.openURL(webUrl);
      }
    }).catch(() => {
      const webUrl = `https://wa.me/${phoneNumber}`;
      Linking.openURL(webUrl);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.scrollContent}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={handleBack} style={styles.headerBackButton}>
              <Ionicons name="chevron-back" size={28} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={styles.title}>{t('auth.forgotPassword.title')}</Text>
              <Text style={styles.subtitle}>{t('auth.forgotPassword.subtitle')}</Text>
            </View>
          </View>

          {!isSuccess ? (
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t('auth.login.email')}</Text>
                <TextInput
                  style={[styles.input, error && styles.inputError]}
                  placeholder={t('auth.login.emailPlaceholder')}
                  placeholderTextColor={colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {error && <Text style={styles.errorText}>{error}</Text>}
              </View>

              <Button
                title={isLoading ? t('auth.forgotPassword.loading') : t('auth.forgotPassword.sendButton')}
                onPress={handleSend}
                loading={isLoading}
                disabled={isLoading}
                style={styles.submitButton}
              />

            </View>
          ) : (
            <View style={styles.successContainer}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark" size={40} color={colors.card} />
              </View>
              <Text style={styles.successTitle}>{t('auth.forgotPassword.successTitle')}</Text>
              <Text style={styles.successText}>{t('auth.forgotPassword.successMessage')}</Text>
            </View>
          )}

          <TouchableOpacity style={styles.supportButton} onPress={handleContactSupport}>
            <Ionicons name="logo-whatsapp" size={20} color={colors.card} style={styles.supportIcon} />
            <Text style={styles.supportText}>{t('common.buttons.contactSupport')}</Text>
          </TouchableOpacity>
          <OTPModal
            visible={otpVisible}
            onClose={() => setOtpVisible(false)}
            title={t('auth.forgotPassword.otpTitle')}
            errorMessage={undefined}
            showError={otpError}
            onInputChange={() => otpError && setOtpError(false)}
            onVerify={async (code) => {
              if (!requestId) return;
              try {
                const repo = new AuthRepository();
                const { token } = await repo.verifyPasswordResetOtp(requestId, code);
                navigation.navigate('ResetPassword', { token });
              } catch (e) {
                setOtpError(true);
              }
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
