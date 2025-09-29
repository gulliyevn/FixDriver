import React from 'react';
import { View, Text, TextInput } from 'react-native';

interface Props {
  t: (k: string) => string;
  styles: any;
  errors: Partial<Record<'firstName' | 'lastName', string>>;
  values: { firstName: string; lastName: string };
  onChange: (field: 'firstName' | 'lastName', value: string) => void;
}

const NameFields: React.FC<Props> = ({ t, styles, errors, values, onChange }) => (
  <View style={styles.row}>
    <View style={[styles.inputContainer, styles.halfWidth]}>
      <Text style={styles.label}>{t('auth.register.firstName')}</Text>
      <TextInput
        style={[styles.input, errors.firstName && styles.inputError]}
        value={values.firstName}
        onChangeText={(text) => onChange('firstName', text)}
        placeholder={t('auth.register.firstNamePlaceholder')}
        placeholderTextColor={styles.colors?.textSecondary || '#64748B'}
        autoCapitalize="words"
        autoCorrect={false}
      />
      {errors.firstName && (<Text style={styles.errorText}>{errors.firstName}</Text>)}
    </View>

    <View style={[styles.inputContainer, styles.halfWidth]}>
      <Text style={styles.label}>{t('auth.register.lastName')}</Text>
      <TextInput
        style={[styles.input, errors.lastName && styles.inputError]}
        value={values.lastName}
        onChangeText={(text) => onChange('lastName', text)}
        placeholder={t('auth.register.lastNamePlaceholder')}
        placeholderTextColor={styles.colors?.textSecondary || '#64748B'}
        autoCapitalize="words"
        autoCorrect={false}
      />
      {errors.lastName && (<Text style={styles.errorText}>{errors.lastName}</Text>)}
    </View>
  </View>
);

export default NameFields;


