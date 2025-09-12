/**
 * HelpScreen component
 * Main screen for help, FAQ, and support contact
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { useAuth } from '../../../../context/AuthContext';
import { HelpSection } from './components/HelpSection';
import { ContactSection } from './components/ContactSection';
import { HelpModal } from './components/HelpModal';
import { useHelpSections } from './hooks/useHelpSections';
import { useSupportContact } from './hooks/useSupportContact';
import { HelpScreenStyles as styles } from './styles/HelpScreen.styles';
import { lightColors, darkColors } from '../../../../../shared/constants/colors';

interface HelpScreenProps {
  navigation: any;
}

export const HelpScreen: React.FC<HelpScreenProps> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();
  const currentColors = isDark ? darkColors : lightColors;
  
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  const isDriver = user?.role === 'driver';
  const { helpSections } = useHelpSections(isDriver);
  const { handleSupportContact } = useSupportContact();

  const getScreenTitle = () => {
    return isDriver ? t('help.titleForDriver') : t('help.title');
  };

  const handleSectionPress = (sectionId: string) => {
    switch (sectionId) {
      case '1':
        setActiveModal('booking');
        break;
      case '2':
        setActiveModal('payment');
        break;
      case '3':
        setActiveModal('safety');
        break;
      case '4':
        setActiveModal('rules');
        break;
      case '5':
        navigation.navigate('SupportChat');
        break;
      default:
        break;
    }
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: currentColors.surface }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={currentColors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: currentColors.text }]}>
          {getScreenTitle()}
        </Text>
        <View style={styles.placeholder} />
      </View>
      
      {/* Content */}
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.description, { color: currentColors.textSecondary }]}>
          {t('help.description')}
        </Text>
        
        {/* Help Sections */}
        {helpSections.map((section) => (
          <HelpSection
            key={section.id}
            section={section}
            onPress={() => handleSectionPress(section.id)}
            colors={currentColors}
          />
        ))}

        {/* Contact Section */}
        <ContactSection
          onSupportContact={handleSupportContact}
          colors={currentColors}
        />
      </ScrollView>

      {/* Modals */}
      <HelpModal
        visible={activeModal !== null}
        modalType={activeModal}
        onClose={closeModal}
        colors={currentColors}
      />
    </View>
  );
};
