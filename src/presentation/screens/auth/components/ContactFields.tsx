import React from 'react';
import { View, Text, TextInput } from 'react-native';

interface Props {
  t: (k: string) => string;
  styles: any;
  errors: Partial<Record<'email' | 'phone', string>>;
  values: { email: string; phone: string };
  onChange: (field: 'email' | 'phone', value: string) => void;
}

const ContactFields: React.FC<Props> = ({ t, styles, errors, values, onChange }) => (
  <>
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{t('auth.register.email')}</Text>
      <TextInput
        style={[styles.input, errors.email && styles.inputError]}
        value={values.email}
        onChangeText={(text) => onChange('email', text)}
        placeholder={t('auth.register.emailPlaceholder')}
        placeholderTextColor="#64748B"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {errors.email && (<Text style={styles.errorText}>{errors.email}</Text>)}
    </View>

    <View style={styles.inputContainer}>
      <Text style={styles.label}>{t('auth.register.phone')}</Text>
      <TextInput
        style={[styles.input, errors.phone && styles.inputError]}
        value={values.phone}
        onChangeText={(text) => onChange('phone', text)}
        placeholder={t('auth.register.phonePlaceholder')}
        placeholderTextColor="#64748B"
        keyboardType="phone-pad"
        autoCorrect={false}
      />
      {errors.phone && (<Text style={styles.errorText}>{errors.phone}</Text>)}
    </View>
  </>
);

export default ContactFields;


