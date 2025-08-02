import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../hooks/useI18n';
import { VipSectionStyles as styles, getVipSectionColors } from '../../styles/components/profile/VipSection.styles';

interface VipSectionProps {
  onVipPress?: () => void;
}

const VipSection: React.FC<VipSectionProps> = ({ onVipPress }) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const dynamicStyles = getVipSectionColors(isDark);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.vipButtonContainer}
        onPress={onVipPress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#FFD700', '#FFA500', '#FF8C00', '#FFD700']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.vipButton}
        >
          <Ionicons name="diamond" size={16} color="#fff" style={styles.buttonIcon} />
          <Text style={[styles.vipButtonText, { color: '#fff' }]}>{t('profile.becomePremium')}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default VipSection; 