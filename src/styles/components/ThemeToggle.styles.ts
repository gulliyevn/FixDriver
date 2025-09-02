import { StyleSheet } from 'react-native';
import { getCurrentColors } from '../../constants/colors';

export const createThemeToggleStyles = (isDark: boolean) => {
  const currentColors = getCurrentColors(isDark);
  
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center', // по центру
      alignItems: 'center',
      paddingHorizontal: 20,
      marginTop: 16,
    },
    languageButton: {
      // Стили для кнопки языка (используются из LanguageButton)
    },
    themeToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: currentColors.surface,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: currentColors.border,
      shadowColor: currentColors.cardShadow,
      shadowOffset: { width: 0, height: isDark ? 2 : 1 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: isDark ? 4 : 2,
      elevation: isDark ? 4 : 2,
    },
    themeIcon: {
      marginRight: 8,
    },
    themeText: {
      fontSize: 14,
      color: currentColors.text,
      fontWeight: '600',
    },
    // iOS стиль переключателя
    iosToggleContainer: {
      width: 51,
      height: 31,
      borderRadius: 16,
      backgroundColor: isDark ? '#60A5FA' : '#E5E7EB',
      padding: 2,
      justifyContent: 'center',
    },
    iosToggleThumb: {
      width: 27,
      height: 27,
      borderRadius: 14,
      backgroundColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
      transform: [{ translateX: isDark ? 20 : 0 }],
    },
    iosToggleTrack: {
      width: 51,
      height: 31,
      borderRadius: 16,
      backgroundColor: isDark ? '#60A5FA' : '#E5E7EB',
      justifyContent: 'center',
      alignItems: 'center',
    },
    iosToggleIcon: {
      position: 'absolute',
      left: isDark ? 6 : 6,
      right: isDark ? undefined : 6,
    },
  });
}; 