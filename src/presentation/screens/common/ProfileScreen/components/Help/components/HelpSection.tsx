/**
 * HelpSection component
 * Individual help section item
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../../../../context/LanguageContext';
import { HelpScreenStyles as styles } from '../styles/HelpScreen.styles';

interface HelpSectionData {
  id: string;
  title: string;
  icon: string;
  description: string;
}

interface HelpSectionProps {
  section: HelpSectionData;
  onPress: () => void;
  colors: any;
}

export const HelpSection: React.FC<HelpSectionProps> = ({ 
  section, 
  onPress, 
  colors 
}) => {
  const { t } = useLanguage();

  return (
    <TouchableOpacity 
      style={[styles.helpItem, { backgroundColor: colors.surface }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.helpIcon, { backgroundColor: colors.primary + '20' }]}>
        <Ionicons 
          name={section.icon as any} 
          size={24} 
          color={colors.primary} 
        />
      </View>
      <View style={styles.helpInfo}>
        <Text style={[styles.helpTitle, { color: colors.text }]}>
          {section.title}
        </Text>
        <Text style={[styles.helpDescription, { color: colors.textSecondary }]}>
          {section.description}
        </Text>
      </View>
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={colors.textSecondary} 
      />
    </TouchableOpacity>
  );
};
