import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  t: (k: string) => string;
  styles: any;
  errors: Partial<Record<'password' | 'confirmPassword', string>>;
  values: { password: string; confirmPassword: string };
  onChange: (field: 'password' | 'confirmPassword', value: string) => void;
  showPassword: boolean;
  setShowPassword: (flag: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (flag: boolean) => void;
}

const PasswordFields: React.FC<Props> = ({ t, styles, errors, values, onChange, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword }) => {
  return (
    <>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('auth.register.password')}</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.passwordInput, errors.password && styles.inputError]}
            value={values.password}
            onChangeText={(text) => onChange('password', text)}
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
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('auth.register.confirmPassword')}</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.passwordInput, errors.confirmPassword && styles.inputError]}
            value={values.confirmPassword}
            onChangeText={(text) => onChange('confirmPassword', text)}
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
        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
      </View>
    </>
  );
};

export default PasswordFields;


