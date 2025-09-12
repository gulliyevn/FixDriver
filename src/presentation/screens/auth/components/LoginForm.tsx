import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../../shared/constants/adaptiveConstants/adaptiveColors';

interface FormData {
  email: string;
  password: string;
}

interface Props {
  t: (k: string) => string;
  styles: any;
  formData: FormData;
  errors: Partial<FormData>;
  showPassword: boolean;
  loading: boolean;
  updateFormData: (field: keyof FormData, value: string) => void;
  setShowPassword: (flag: boolean) => void;
  handleLogin: () => void;
  handleForgotPassword: () => void;
}

const LoginForm: React.FC<Props> = ({
  t,
  styles,
  formData,
  errors,
  showPassword,
  loading,
  updateFormData,
  setShowPassword,
  handleLogin,
  handleForgotPassword,
}) => {
  return (
    <View style={styles.form}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('auth.login.email')}</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          value={formData.email}
          onChangeText={(text) => updateFormData('email', text)}
          placeholder={t('auth.login.emailPlaceholder')}
          placeholderTextColor={colors.light.textSecondary}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email}</Text>
        )}
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('auth.login.password')}</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.passwordInput, errors.password && styles.inputError]}
            value={formData.password}
            onChangeText={(text) => updateFormData('password', text)}
            placeholder={t('auth.login.passwordPlaceholder')}
            placeholderTextColor={colors.light.textSecondary}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons 
              name={showPassword ? 'eye-off' : 'eye'} 
              size={18} 
              color={colors.light.textSecondary} 
            />
          </TouchableOpacity>
        </View>
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
      </View>

      {/* Forgot Password */}
      <TouchableOpacity 
        style={styles.forgotPassword}
        onPress={handleForgotPassword}
      >
        <Text style={styles.forgotPasswordText}>
          {t('auth.login.forgotPassword')}
        </Text>
      </TouchableOpacity>

      <Button
        title={t('auth.login.loginButton')}
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
        style={styles.loginButton}
      />
    </View>
  );
};

export default LoginForm;
