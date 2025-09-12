/**
 * LinksSection component
 * External links and contact information section
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { lightColors, darkColors } from '../../../../../shared/constants/colors';
import { AboutScreenStyles as styles } from '../styles/AboutScreen.styles';

interface LinksSectionProps {
  onOpenLink: (url: string) => void;
  onShowPrivacy: () => void;
  onShowTerms: () => void;
}

export const LinksSection: React.FC<LinksSectionProps> = ({
  onOpenLink,
  onShowPrivacy,
  onShowTerms
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : lightColors;

  const links = [
    {
      id: 'website',
      icon: 'globe',
      title: t('about.website'),
      url: 'https://junago.net',
      onPress: () => onOpenLink('https://junago.net')
    },
    {
      id: 'support',
      icon: 'mail',
      title: t('about.support'),
      url: 'mailto:junago@junago.net',
      onPress: () => onOpenLink('mailto:junago@junago.net')
    },
    {
      id: 'privacy',
      icon: 'shield-checkmark',
      title: t('about.privacy'),
      onPress: onShowPrivacy
    },
    {
      id: 'terms',
      icon: 'document-text',
      title: t('about.terms'),
      onPress: onShowTerms
    }
  ];

  return (
    <View style={styles.linksSection}>
      <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
        {t('about.links')}
      </Text>
      {links.map((link) => (
        <TouchableOpacity 
          key={link.id}
          style={[styles.linkItem, { backgroundColor: currentColors.surface }]}
          onPress={link.onPress}
        >
          <Ionicons 
            name={link.icon as keyof typeof Ionicons.glyphMap} 
            size={24} 
            color={currentColors.primary} 
          />
          <Text style={[styles.linkText, { color: currentColors.text }]}>
            {link.title}
          </Text>
          <Ionicons 
            name="open-outline" 
            size={20} 
            color={currentColors.textSecondary} 
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};
