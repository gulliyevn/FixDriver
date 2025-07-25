import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { VipSectionStyles as styles, getVipSectionColors } from '../../styles/components/profile/VipSection.styles';

const VipSection: React.FC = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const dynamicStyles = getVipSectionColors(isDark);

  return (
    <View style={styles.vipSection}>
      <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
        {t('profile.vipStatus')}
      </Text>
      
      <View style={styles.vipCard}>
        <Text style={styles.vipTitle}>{t('profile.vipTitle')}</Text>
        <Text style={styles.vipDescription}>{t('profile.vipDescription')}</Text>
        <TouchableOpacity style={styles.vipButton}>
          <Text style={styles.vipButtonText}>{t('profile.upgradeToVip')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VipSection; 