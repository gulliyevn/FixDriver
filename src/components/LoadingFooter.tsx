import React from 'react';
import { View, Text } from 'react-native';
import { useI18n } from '../hooks/useI18n';

type LoadingFooterProps = {
  styles: any;
};

const LoadingFooter: React.FC<LoadingFooterProps> = ({ styles }) => {
  const { t } = useI18n();
  return (
    <View style={styles.loadingFooter}>
      <Text style={styles.loadingText}>{t('client.driversScreen.loadingMore')}</Text>
    </View>
  );
};

export default React.memo(LoadingFooter);


