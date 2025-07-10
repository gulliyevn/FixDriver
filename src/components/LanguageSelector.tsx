import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../constants/colors';

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ visible, onClose }) => {
  const { t, setLanguage, language, SUPPORTED_LANGUAGES } = useLanguage();
  const { isDark } = useTheme();
  const currentColors = isDark ? colors.dark : colors.light;
  
  const handleLanguageSelect = async (language: string) => {
    await setLanguage(language as keyof typeof SUPPORTED_LANGUAGES);
    onClose();
  };

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: currentColors.background,
      borderRadius: 28,
      padding: 28,
      width: '88%',
      maxHeight: '75%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.18,
      shadowRadius: 24,
      elevation: 12,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
      paddingBottom: 18,
      borderBottomWidth: 1,
      borderBottomColor: currentColors.border,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: currentColors.primary,
      letterSpacing: 0.2,
    },
    closeButton: {
      padding: 8,
      borderRadius: 16,
      backgroundColor: currentColors.surface,
    },
    languageList: {
      maxHeight: 420,
    },
    languageItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 16,
      marginBottom: 10,
      backgroundColor: currentColors.surface,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    languageItemSelected: {
      backgroundColor: currentColors.primary + '22',
      borderColor: currentColors.primary,
    },
    languageText: {
      fontSize: 18,
      color: currentColors.text,
      marginLeft: 12,
      flex: 1,
      fontWeight: '500',
      letterSpacing: 0.1,
    },
    languageTextSelected: {
      fontWeight: '700',
      color: currentColors.primary,
      textShadowColor: currentColors.primary + '55',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    checkIcon: {
      marginLeft: 'auto',
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('common.selectLanguage')}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons 
                name="close" 
                size={24} 
                color={currentColors.text} 
              />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.languageList} showsVerticalScrollIndicator={false}>
            {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
              <TouchableOpacity
                key={code}
                style={[
                  styles.languageItem,
                  language === code && styles.languageItemSelected
                ]}
                onPress={() => handleLanguageSelect(code)}
              >
                <Text style={[
                  styles.languageText,
                  language === code && styles.languageTextSelected
                ]}>
                  {name}
                </Text>
                {language === code && (
                  <Ionicons 
                    name="checkmark" 
                    size={20} 
                    color={currentColors.primary}
                    style={styles.checkIcon}
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default LanguageSelector; 