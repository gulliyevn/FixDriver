import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  ScrollView, 
  Animated, 
  Dimensions,
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../shared/i18n';
import { LanguageSelectorStyles } from './LanguageSelector.styles';

// Временно используем светлую тему (потом подключим ThemeProvider)
const useTheme = () => ({ isDark: false });

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
}

// Supported languages
const SUPPORTED_LANGUAGES = [
  { code: 'ar', name: 'العربية', native: 'العربية', flag: '🇸🇦' },
  { code: 'ru', name: 'Русский', native: 'Русский', flag: '🇷🇺' },
  { code: 'az', name: 'Azərbaycan', native: 'Azərbaycan', flag: '🇦🇿' },
  { code: 'tr', name: 'Türkçe', native: 'Türkçe', flag: '🇹🇷' },
  { code: 'de', name: 'Deutsch', native: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', native: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', native: 'Français', flag: '🇫🇷' },
  { code: 'kk', name: 'Қазақ', native: 'Қазақ', flag: '🇰🇿' },
  { code: 'ky', name: 'Кыргызча', native: 'Кыргызча', flag: '🇰🇬' },
  { code: 'zh', name: '中文', native: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
  { code: 'it', name: 'Italiano', native: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', native: 'Português', flag: '🇵🇹' },
  { code: 'ja', name: '日本語', native: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', native: '한국어', flag: '🇰🇷' },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ visible, onClose }) => {
  const { isDark } = useTheme();
  const { language, changeLanguage } = useI18n();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Hide animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim, slideAnim]);

  const handleLanguageSelect = async (selectedLanguage: string) => {
    try {
      changeLanguage(selectedLanguage);
      onClose();
    } catch (error) {
      console.warn('Language change error:', error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <StatusBar backgroundColor="rgba(0, 0, 0, 0.6)" barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <Animated.View 
        style={[
          LanguageSelectorStyles.modalOverlay,
          { opacity: fadeAnim }
        ]}
      >
        <Animated.View 
          style={[
            LanguageSelectorStyles.modalContent,
            {
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim }
              ]
            }
          ]}
        >
          <View style={LanguageSelectorStyles.header}>
            <Text style={LanguageSelectorStyles.title}>Select Language</Text>
            <TouchableOpacity 
              style={LanguageSelectorStyles.closeButton} 
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="close" 
                size={20} 
                color={isDark ? '#FFFFFF' : '#000000'} 
              />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={LanguageSelectorStyles.languageList} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={LanguageSelectorStyles.scrollViewContent}
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  LanguageSelectorStyles.languageItem,
                  language === lang.code && LanguageSelectorStyles.languageItemSelected
                ]}
                onPress={() => handleLanguageSelect(lang.code)}
                activeOpacity={0.7}
              >
                <View style={LanguageSelectorStyles.flagContainer}>
                  <Text style={LanguageSelectorStyles.flag}>{lang.flag}</Text>
                </View>
                
                <View style={LanguageSelectorStyles.languageInfo}>
                  <Text style={[
                    LanguageSelectorStyles.languageName,
                    language === lang.code && LanguageSelectorStyles.languageNameSelected
                  ]}>
                    {lang.name}
                  </Text>
                  <Text style={LanguageSelectorStyles.languageNative}>
                    {lang.native}
                  </Text>
                </View>
                
                {language === lang.code && (
                  <View style={LanguageSelectorStyles.checkIcon}>
                    <Ionicons 
                      name="checkmark" 
                      size={16} 
                      color="#FFFFFF"
                    />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default LanguageSelector;
