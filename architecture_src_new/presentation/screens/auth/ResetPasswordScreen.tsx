import React, { useState } from 'react';
import { SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../shared/i18n';
import { Button } from '../../components';
import { ResetPasswordScreenStyles as styles } from './ResetPasswordScreen.styles';
import { AuthRepository } from '../../../data/repositories/AuthRepository';
import { getCurrentColors } from '../../../shared/constants/colors';

interface ResetPasswordScreenProps {
  navigation: {
    goBack: () => void;
    reset: (state: { index: number; routes: { name: string }[] }) => void;
    replace?: (screen: string) => void;
    canGoBack?: () => boolean;
  };
  route?: { params?: { token: string } };
}

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({ navigation, route }) => {
  const { t } = useI18n();
  const colors = getCurrentColors(false);
  const token = route?.params?.token || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const policy = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!policy.test(password)) { setError(t('auth.register.passwordPolicy')); return false; }
    if (password !== confirmPassword) { setError(t('auth.register.passwordsDontMatch')); return false; }
    setError(null); return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    if (!token) {
      setError(t('auth.resetPassword.invalidToken'));
      return;
    }
    setLoading(true);
    try {
      console.log('🔑 Resetting password with token:', token);
      const repo = new AuthRepository();
      await repo.resetPassword(token, password);
      console.log('✅ Password reset successful, redirecting to login');
      // Show success message briefly then redirect
      setError(null);
      setTimeout(() => {
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      }, 1500);
    } catch (e) {
      console.error('❌ Password reset failed:', e);
      const errorMessage = e instanceof Error ? e.message : 'Unknown error';
      if (errorMessage.includes('Invalid reset token')) {
        setError(t('auth.resetPassword.invalidToken'));
      } else {
        setError(t('auth.resetPassword.passwordResetFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.scrollContent}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => {
                if (navigation?.canGoBack?.()) {
                  navigation.goBack();
                } else {
                  navigation?.replace?.('ForgotPassword');
                }
              }}
              style={styles.headerBackButton}
            >
              <Ionicons name="chevron-back" size={28} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={styles.title}>{t('auth.resetPassword.title')}</Text>
              <Text style={styles.subtitle}>{t('auth.resetPassword.subtitle')}</Text>
            </View>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('auth.resetPassword.newPassword')}</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.passwordInput, error && styles.inputError]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder={t('auth.resetPassword.newPasswordPlaceholder')}
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('auth.resetPassword.confirmPassword')}</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.passwordInput, error && styles.inputError]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder={t('auth.resetPassword.confirmPasswordPlaceholder')}
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity style={styles.eyeButton} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>

            {(() => {
              const pwd = password || '';
              const unmet: string[] = [];
              if (pwd.length < 8) unmet.push(t('auth.register.policy.minLength'));
              if (!/[A-Z]/.test(pwd)) unmet.push(t('auth.register.policy.uppercase'));
              if (!/\d/.test(pwd)) unmet.push(t('auth.register.policy.digit'));
              if (!/[^A-Za-z0-9]/.test(pwd)) unmet.push(t('auth.register.policy.special'));
              return password.length > 0 && unmet.length ? (
                <View style={styles.unmetContainer}>
                  {unmet.map((line, idx) => (
                    <Text key={idx} style={styles.errorText}>• {line}</Text>
                  ))}
                </View>
              ) : null;
            })()}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Button title={loading ? t('common.messages.loading') : t('common.buttons.save')} onPress={handleSubmit} loading={loading} disabled={loading} style={styles.submitButton} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;


