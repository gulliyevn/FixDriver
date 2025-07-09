import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../hooks/useI18n';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../constants/colors';

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ visible, onClose }) => {
  const { t, setLanguage, getCurrentLanguage, SUPPORTED_LANGUAGES } = useI18n();
  const { isDark } = useTheme();
  const currentColors = isDark ? colors.dark : colors.light;
  
  const [currentLanguage, setCurrentLanguage] = useState<string>('ru');

  useEffect(() => {
    setCurrentLanguage(getCurrentLanguage());
  }, [getCurrentLanguage]);

  const handleLanguageSelect = async (language: string) => {
    await setLanguage(language as any);
    setCurrentLanguage(language);
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
      borderRadius: 12,
      padding: 20,
      width: '80%',
      maxHeight: '70%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: currentColors.border,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: currentColors.text,
    },
    closeButton: {
      padding: 5,
    },
    languageList: {
      maxHeight: 400,
    },
    languageItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 10,
      borderRadius: 8,
      marginBottom: 8,
    },
    languageItemSelected: {
      backgroundColor: currentColors.primary + '20',
    },
    languageText: {
      fontSize: 16,
      color: currentColors.text,
      marginLeft: 12,
      flex: 1,
    },
    languageTextSelected: {
      fontWeight: '600',
      color: currentColors.primary,
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
                  currentLanguage === code && styles.languageItemSelected
                ]}
                onPress={() => handleLanguageSelect(code)}
              >
                <Text style={[
                  styles.languageText,
                  currentLanguage === code && styles.languageTextSelected
                ]}>
                  {name}
                </Text>
                {currentLanguage === code && (
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