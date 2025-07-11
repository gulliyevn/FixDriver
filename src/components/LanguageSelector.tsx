import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  ScrollView, 
  StyleSheet, 
  Animated, 
  Dimensions,
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../constants/colors';
import { SupportedLanguage } from '../i18n';

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
}

const { height: screenHeight } = Dimensions.get('window');

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ visible, onClose }) => {
  const { t, setLanguage, language, languageOptions, isLoading } = useLanguage();
  const { isDark } = useTheme();
  const currentColors = isDark ? colors.dark : colors.light;
  
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
      await setLanguage(selectedLanguage as SupportedLanguage);
      onClose();
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    modalContent: {
      backgroundColor: currentColors.background,
      borderRadius: 24,
      padding: 24,
      width: '100%',
      maxWidth: 400,
      maxHeight: screenHeight * 0.8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.25,
      shadowRadius: 32,
      elevation: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: currentColors.border + '40',
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: currentColors.primary,
      letterSpacing: 0.3,
    },
    closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: currentColors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    languageList: {
      maxHeight: 480,
    },
    languageItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 16,
      marginBottom: 12,
      backgroundColor: currentColors.surface,
      borderWidth: 2,
      borderColor: 'transparent',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    languageItemSelected: {
      backgroundColor: currentColors.primary + '15',
      borderColor: currentColors.primary,
      shadowColor: currentColors.primary,
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 4,
    },
    flagContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
      backgroundColor: currentColors.background,
    },
    flag: {
      fontSize: 20,
    },
    languageInfo: {
      flex: 1,
    },
    languageName: {
      fontSize: 18,
      fontWeight: '600',
      color: currentColors.text,
      marginBottom: 2,
      letterSpacing: 0.2,
    },
    languageNative: {
      fontSize: 14,
      color: currentColors.textSecondary,
      fontWeight: '400',
    },
    languageNameSelected: {
      fontWeight: '700',
      color: currentColors.primary,
    },
    checkIcon: {
      marginLeft: 12,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: currentColors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingContainer: {
      padding: 40,
      alignItems: 'center',
    },
    loadingText: {
      fontSize: 16,
      color: currentColors.textSecondary,
      marginTop: 12,
    },
  });

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
          styles.modalOverlay,
          { opacity: fadeAnim }
        ]}
      >
        <Animated.View 
          style={[
            styles.modalContent,
            {
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim }
              ]
            }
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{t('common.selectLanguage')}</Text>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="close" 
                size={20} 
                color={currentColors.text} 
              />
            </TouchableOpacity>
          </View>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Ionicons name="refresh" size={32} color={currentColors.primary} />
              <Text style={styles.loadingText}>{t('common.loading')}</Text>
            </View>
          ) : (
            <ScrollView 
              style={styles.languageList} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 8 }}
            >
              {languageOptions.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageItem,
                    language === lang.code && styles.languageItemSelected
                  ]}
                  onPress={() => handleLanguageSelect(lang.code)}
                  activeOpacity={0.7}
                >
                  <View style={styles.flagContainer}>
                    <Text style={styles.flag}>{lang.flag}</Text>
                  </View>
                  
                  <View style={styles.languageInfo}>
                    <Text style={[
                      styles.languageName,
                      language === lang.code && styles.languageNameSelected
                    ]}>
                      {lang.name}
                    </Text>
                    <Text style={styles.languageNative}>
                      {lang.native}
                    </Text>
                  </View>
                  
                  {language === lang.code && (
                    <View style={styles.checkIcon}>
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
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default LanguageSelector; 