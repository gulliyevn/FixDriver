import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../../../../shared/hooks/useI18n';
import { EditProfileScreenStyles as styles } from '../styles/EditProfileScreen.styles';

/**
 * VIP Section Component
 * 
 * Section for premium packages and VIP features
 */

interface VipSectionProps {
  onVipPress: () => void;
  isDark: boolean;
}

export const VipSection: React.FC<VipSectionProps> = ({
  onVipPress,
  isDark
}) => {
  const { t } = useI18n();

  return (
    <View style={[styles.section, isDark && styles.sectionDark]}>
      <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
        {t('profile.vip.title')}
      </Text>
      
      <TouchableOpacity
        style={[styles.vipCard, isDark && styles.vipCardDark]}
        onPress={onVipPress}
      >
        <View style={styles.vipContent}>
          <View style={styles.vipIconContainer}>
            <Ionicons name="star" size={24} color="#F59E0B" />
          </View>
          
          <View style={styles.vipInfo}>
            <Text style={[styles.vipTitle, isDark && styles.vipTitleDark]}>
              {t('profile.vip.upgrade')}
            </Text>
            <Text style={[styles.vipSubtitle, isDark && styles.vipSubtitleDark]}>
              {t('profile.vip.benefits')}
            </Text>
          </View>
          
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDark ? '#9CA3AF' : '#6B7280'}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};
