import React from 'react';
import { View, Text } from 'react-native';
import { useI18n } from '../../../../../shared/hooks/useI18n';
import { styles } from '../styles/SupportChatScreen.styles';

/**
 * Loading State Component
 * 
 * Shows loading indicator while connecting to support
 */

interface LoadingStateProps {
  isDark: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ isDark }) => {
  const { t } = useI18n();

  return (
    <View style={styles.loadingContainer}>
      <Text style={[
        styles.loadingText,
        isDark && styles.loadingTextDark
      ]}>
        {t('support.connecting')}
      </Text>
    </View>
  );
};
