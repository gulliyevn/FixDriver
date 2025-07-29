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
    <View style={[styles.container, dynamicStyles.container]}>
      <View style={styles.header}>
        <Ionicons name="diamond" size={24} color="#6366f1" style={styles.icon} />
        <View style={styles.titleContainer}>
          <Text style={[styles.title, dynamicStyles.title]}>
            {t('profile.premiumStatus')}
          </Text>
          <Text style={[styles.subtitle, dynamicStyles.subtitle]}>
            {t('profile.premiumSubscription')}
          </Text>
        </View>
      </View>
      
      <Text style={[styles.description, dynamicStyles.description]}>
        {t('profile.premiumDescription')}
      </Text>
      
      <TouchableOpacity
        style={styles.vipButtonContainer}
        onPress={onVipPress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={isDark ? ['#6366f1', '#4f46e5', '#3730a3'] : ['#6366f1', '#4f46e5', '#3730a3']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.vipButton}
        >
          <Text style={styles.vipButtonText}>{t('profile.becomePremium')}</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" style={styles.buttonIcon} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default VipSection; 