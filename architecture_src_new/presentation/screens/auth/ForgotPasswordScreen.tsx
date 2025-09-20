import React, { useState } from 'react';
import { SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, View, Text, TextInput, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../shared/i18n';
import { Button } from '../../components';
import { ForgotPasswordScreenStyles as styles } from './ForgotPasswordScreen.styles';
import { AuthRepository } from '../../../data/repositories/AuthRepository';
import OTPModal from '../../components/ui/OTPModal';

interface ForgotPasswordScreenProps {
  navigation?: any;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
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
      const repo = new AuthRepository();
      const { requestId } = await repo.sendPasswordReset(email);
      setRequestId(requestId);
      setOtpVisible(true);
      setOtpError(false);
    } catch (e) {
      setError('Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if ((navigation as any)?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation.navigate('Login');
    }
  };

  const handleContactSupport = () => {
    const phoneNumber = '+994516995513';
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent('Здравствуйте! Нужна помощь с восстановлением пароля.')}`;
    Linking.canOpenURL(whatsappUrl).then(supported => {
      if (supported) {
        Linking.openURL(whatsappUrl);
      } else {
        const webUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent('Здравствуйте! Нужна помощь с восстановлением пароля.')}`;
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
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.scrollContent}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={handleBack} style={styles.headerBackButton}>
              <Ionicons name="chevron-back" size={28} color="#64748B" />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={styles.title}>{t('auth.login.forgotPassword')}</Text>
              <Text style={styles.subtitle}>{t('auth.login.subtitle')}</Text>
            </View>
          </View>

          {!isSuccess ? (
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t('auth.login.email')}</Text>
                <TextInput
                  style={[styles.input, error && styles.inputError]}
                  placeholder={t('auth.login.emailPlaceholder')}
                  placeholderTextColor="#64748B"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {error && <Text style={styles.errorText}>{error}</Text>}
              </View>

              <Button
                title={isLoading ? t('common.messages.loading') : t('auth.login.forgotPassword')}
                onPress={handleSend}
                loading={isLoading}
                disabled={isLoading}
                style={styles.submitButton}
              />

              {otpVisible && (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>OTP</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="number-pad"
                    maxLength={4}
                    value={otp}
                    onChangeText={setOtp}
                    placeholder="____"
                  />
                  <Button
                    title="Verify"
                    onPress={async () => {
                      if (!requestId || otp.length !== 4) return;
                      try {
                        const repo = new AuthRepository();
                        const { token } = await repo.verifyPasswordResetOtp(requestId, otp);
                        navigation.navigate('ResetPassword', { token } as never);
                      } catch (e) {
                        setError('Invalid OTP');
                      }
                    }}
                    style={styles.submitButton}
                  />
                </View>
              )}
            </View>
          ) : (
            <View style={styles.successContainer}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark" size={40} color="#FFFFFF" />
              </View>
              <Text style={styles.successTitle}>{t('common.messages.success')}</Text>
              <Text style={styles.successText}>{t('auth.login.forgotPassword')}</Text>
            </View>
          )}

          <TouchableOpacity style={styles.supportButton} onPress={handleContactSupport}>
            <Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" style={styles.supportIcon} />
            <Text style={styles.supportText}>{t('common.buttons.contactSupport')}</Text>
          </TouchableOpacity>
          <OTPModal
            visible={otpVisible}
            onClose={() => setOtpVisible(false)}
            title="Enter OTP"
            errorMessage={undefined}
            showError={otpError}
            onInputChange={() => otpError && setOtpError(false)}
            onVerify={async (code) => {
              if (!requestId) return;
              try {
                const repo = new AuthRepository();
                const { token } = await repo.verifyPasswordResetOtp(requestId, code);
                console.log('[ForgotPassword] OTP verified, navigating with reset token', token);
                navigation.navigate('ResetPassword', { token } as never);
              } catch (e) {
                console.warn('[ForgotPassword] OTP verification failed', e);
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


