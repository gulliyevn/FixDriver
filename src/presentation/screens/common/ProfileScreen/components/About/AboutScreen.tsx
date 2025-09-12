/**
 * AboutScreen component
 * Application information and links screen
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { useAuth } from '../../../../context/AuthContext';
import { lightColors, darkColors } from '../../../../../shared/constants/colors';
import { AppInfoSection } from './AppInfoSection';
import { LinksSection } from './LinksSection';
import { PrivacyModal } from './PrivacyModal';
import { TermsModal } from './TermsModal';
import { AboutScreenStyles as styles } from '../styles/AboutScreen.styles';

interface AboutScreenProps {
  navigation: {
    goBack: () => void;
  };
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();
  const currentColors = isDark ? darkColors : lightColors;
  
  const isDriver = user?.role === 'driver';
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  
  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

  const getScreenTitle = () => {
    return isDriver ? t('about.title') : t('about.title');
  };

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <View style={[styles.header, { backgroundColor: currentColors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={currentColors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: currentColors.text }]}>
          {getScreenTitle()}
        </Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <AppInfoSection />
        
        <LinksSection 
          onOpenLink={handleOpenLink}
          onShowPrivacy={() => setShowPrivacyModal(true)}
          onShowTerms={() => setShowTermsModal(true)}
        />
      </ScrollView>
      
      <PrivacyModal
        visible={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
      
      <TermsModal
        visible={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
    </View>
  );
};