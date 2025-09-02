import React, { useState } from 'react';
import { SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../shared/i18n';
import { Button } from '../../components';
import { ResetPasswordScreenStyles as styles } from './ResetPasswordScreen.styles';
import { AuthRepository } from '../../../data/repositories/AuthRepository';

interface ResetPasswordScreenProps {
  navigation?: any;
  route?: { params?: { token: string } };
}

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({ navigation, route }) => {
  const { t } = useI18n();
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
    setLoading(true);
    try {
      const repo = new AuthRepository();
      await repo.resetPassword(token, password);
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (e) {
      setError('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.scrollContent}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation?.goBack?.()} style={styles.headerBackButton}>
              <Ionicons name="chevron-back" size={28} color="#64748B" />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={styles.title}>{t('auth.register.password')}</Text>
              <Text style={styles.subtitle}>{t('auth.register.confirmPassword')}</Text>
            </View>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('auth.register.password')}</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.passwordInput, error && styles.inputError]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder={t('auth.register.passwordPlaceholder')}
                  placeholderTextColor="#64748B"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={18} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('auth.register.confirmPassword')}</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.passwordInput, error && styles.inputError]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder={t('auth.register.confirmPasswordPlaceholder')}
                  placeholderTextColor="#64748B"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity style={styles.eyeButton} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={18} color="#64748B" />
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
                <View style={{ marginTop: 4 }}>
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


