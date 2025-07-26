import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { VipSectionStyles as styles, getVipSectionColors } from '../../styles/components/profile/VipSection.styles';

interface VipSectionProps {
  onVipPress?: () => void;
}

const VipSection: React.FC<VipSectionProps> = ({ onVipPress }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const dynamicStyles = getVipSectionColors(isDark);

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <View style={styles.header}>
        <Ionicons name="diamond" size={24} color="#FFD700" style={styles.icon} />
        <View style={styles.titleContainer}>
          <Text style={[styles.title, dynamicStyles.title]}>
            Премиум статус
          </Text>
          <Text style={[styles.subtitle, dynamicStyles.subtitle]}>
            Премиум подписка
          </Text>
        </View>
      </View>
      
      <Text style={[styles.description, dynamicStyles.description]}>
        Получите приоритетное обслуживание, эксклюзивные предложения и специальные скидки
      </Text>
      
      <TouchableOpacity
        style={styles.vipButton}
        onPress={onVipPress}
        activeOpacity={0.7}
      >
        <Text style={styles.vipButtonText}>Стать Премиум</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VipSection; 