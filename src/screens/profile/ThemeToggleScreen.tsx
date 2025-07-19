import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { getCurrentColors } from '../../constants/colors';

const ThemeToggleScreen: React.FC = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { t } = useLanguage();
  
  const currentColors = getCurrentColors(isDark);
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentColors.background,
    },
    content: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: currentColors.text,
      marginBottom: 40,
      textAlign: 'center',
    },
    themeCard: {
      backgroundColor: currentColors.surface,
      borderRadius: 16,
      padding: 24,
      marginBottom: 20,
      width: '100%',
      alignItems: 'center',
      shadowColor: currentColors.cardShadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 4,
      borderWidth: 1,
      borderColor: currentColors.border,
    },
    themeTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: currentColors.text,
      marginBottom: 8,
    },
    themeDescription: {
      fontSize: 16,
      color: currentColors.textSecondary,
      textAlign: 'center',
      marginBottom: 20,
      lineHeight: 22,
    },
    toggleButton: {
      backgroundColor: currentColors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 32,
      alignItems: 'center',
      flexDirection: 'row',
      shadowColor: currentColors.cardShadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    toggleButtonText: {
      color: currentColors.surface,
      fontSize: 18,
      fontWeight: '600',
      marginLeft: 8,
    },
    currentTheme: {
      fontSize: 16,
      color: currentColors.textSecondary,
      marginTop: 20,
      textAlign: 'center',
    },
    themeIcon: {
      marginBottom: 16,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      <View style={styles.content}>
        <Text style={styles.title}>
          {t('profile.theme.title') || 'Настройки темы'}
        </Text>
        
        <View style={styles.themeCard}>
          <Ionicons
            name={isDark ? "moon" : "sunny"}
            size={48}
            color={isDark ? "#60A5FA" : "#F59E0B"}
            style={styles.themeIcon}
          />
          
          <Text style={styles.themeTitle}>
            {isDark ? (t('profile.theme.dark') || 'Темная тема') : (t('profile.theme.light') || 'Светлая тема')}
          </Text>
          
          <Text style={styles.themeDescription}>
            {isDark 
              ? (t('profile.theme.darkDescription') || 'Используйте темную тему для комфортного использования в условиях низкой освещенности')
              : (t('profile.theme.lightDescription') || 'Используйте светлую тему для четкого отображения в ярких условиях')
            }
          </Text>
          
          <TouchableOpacity style={styles.toggleButton} onPress={toggleTheme}>
            <Ionicons
              name={isDark ? "sunny" : "moon"}
              size={20}
              color={currentColors.surface}
            />
            <Text style={styles.toggleButtonText}>
              {isDark 
                ? (t('profile.theme.switchToLight') || 'Переключить на светлую')
                : (t('profile.theme.switchToDark') || 'Переключить на темную')
              }
            </Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.currentTheme}>
          {t('profile.theme.current') || 'Текущая тема'}: {theme === 'dark' ? 'Темная' : 'Светлая'}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ThemeToggleScreen;
