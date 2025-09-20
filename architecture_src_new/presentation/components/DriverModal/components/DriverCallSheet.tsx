import React from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../core/context/ThemeContext';
import { useI18n } from '../../../../shared/i18n';
import { createDriverModalStyles } from '../styles/DriverModal.styles';

interface DriverCallSheetProps {
  isVisible: boolean;
  isDark: boolean;
  role: 'client' | 'driver';
  callAnim: Animated.Value;
  driver: any;
  onClose: () => void;
  onNetworkCall: () => void;
  onInternetCall: () => void;
}

const DriverCallSheet: React.FC<DriverCallSheetProps> = ({
  isVisible,
  isDark,
  role,
  callAnim,
  driver,
  onClose,
  onNetworkCall,
  onInternetCall,
}) => {
  const { t } = useI18n();
  const styles = createDriverModalStyles(isDark, role);

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.callSheetOverlay}>
        <Pressable style={styles.callSheetBackdrop} onPress={onClose} />
        <Animated.View
          style={[
            styles.callSheetContainer,
            {
              transform: [
                {
                  translateY: callAnim.interpolate({ inputRange: [0, 1], outputRange: [300, 0] }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity style={styles.callSheetClose} onPress={onClose} accessibilityLabel={t('common.close')}>
            <Ionicons name="close" size={22} color={isDark ? '#F9FAFB' : '#111827'} />
          </TouchableOpacity>
          <View style={styles.callSheetHandle} />
          <Text style={styles.callSheetTitle}>
            {t('client.driversScreen.call.callTitle')}
          </Text>
          <TouchableOpacity style={styles.callSheetOption} onPress={onInternetCall}>
            <Ionicons name="wifi" size={24} color={isDark ? '#F9FAFB' : '#111827'} />
            <Text style={styles.callSheetOptionText}>{t('client.driversScreen.call.internetCall')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.callSheetOption} onPress={onNetworkCall}>
            <Ionicons name="call" size={24} color={isDark ? '#F9FAFB' : '#111827'} />
            <Text style={styles.callSheetOptionText}>
              {t('client.driversScreen.call.networkCall')}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default DriverCallSheet;
