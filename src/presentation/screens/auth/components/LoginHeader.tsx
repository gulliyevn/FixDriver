import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  t: (k: string) => string;
  styles: any;
}

const LoginHeader: React.FC<Props> = ({ t, styles }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>
        {t('auth.login.title')}
      </Text>
      <Text style={styles.subtitle}>
        {t('auth.login.subtitle')}
      </Text>
    </View>
  );
};

export default LoginHeader;
