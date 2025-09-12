/**
 * ContactSection component
 * Support contact section with WhatsApp button
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../../../../context/LanguageContext';
import { HelpScreenStyles as styles } from '../styles/HelpScreen.styles';

interface ContactSectionProps {
  onSupportContact: () => void;
  colors: any;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ 
  onSupportContact, 
  colors 
}) => {
  const { t } = useLanguage();

  return (
    <View style={[styles.contactSection, { backgroundColor: colors.surface }]}>
      <Text style={[styles.contactTitle, { color: colors.text }]}>
        {t('help.contactTitle')}
      </Text>
      <Text style={[styles.contactDescription, { color: colors.textSecondary }]}>
        {t('help.contactDescription')}
      </Text>
      <TouchableOpacity 
        style={[styles.contactButton, { backgroundColor: colors.success }]} 
        onPress={onSupportContact}
        activeOpacity={0.8}
      >
        <Ionicons name="logo-whatsapp" size={24} color="#FFFFFF" />
        <Text style={styles.contactButtonText}>
          {t('help.contactWhatsApp')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
