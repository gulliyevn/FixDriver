import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface Props {
  t: (k: string) => string;
  styles: any;
  onRegister: () => void;
}

const LoginFooter: React.FC<Props> = ({ t, styles, onRegister }) => {
  return (
    <View style={styles.registerSection}>
      <Text style={styles.registerText}>{t('auth.login.noAccount')} </Text>
      <TouchableOpacity onPress={onRegister}>
        <Text style={styles.registerLink}>{t('auth.login.registerLink')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginFooter;
