import React, { useRef } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  Animated, 
  ViewStyle 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../shared/i18n';
import { LanguageButtonStyles } from './LanguageButton.styles';

// Временно используем светлую тему (потом подключим ThemeProvider)
const useTheme = () => ({ isDark: false });

interface LanguageButtonProps {
  onPress: () => void;
  style?: ViewStyle;
  size?: 'small' | 'medium' | 'large';
}

// Language info mapping
const LANGUAGE_INFO = {
  ar: { name: 'العربية', flag: '🇸🇦' },
  ru: { name: 'Русский', flag: '🇷🇺' },
  az: { name: 'Azərbaycan', flag: '🇦🇿' },
  tr: { name: 'Türkçe', flag: '🇹🇷' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  es: { name: 'Español', flag: '🇪🇸' },
  fr: { name: 'Français', flag: '🇫🇷' },
  kk: { name: 'Қазақ', flag: '🇰🇿' },
  ky: { name: 'Кыргызча', flag: '🇰🇬' },
  zh: { name: '中文', flag: '🇨🇳' },
  en: { name: 'English', flag: '🇺🇸' },
  it: { name: 'Italiano', flag: '🇮🇹' },
  pt: { name: 'Português', flag: '🇵🇹' },
  ja: { name: '日本語', flag: '🇯🇵' },
  ko: { name: '한국어', flag: '🇰🇷' },
};

const LanguageButton: React.FC<LanguageButtonProps> = ({ 
  onPress, 
  style, 
  size = 'medium' 
}) => {
  const { language } = useI18n();
  const { isDark } = useTheme();
  
  const languageInfo = LANGUAGE_INFO[language as keyof typeof LANGUAGE_INFO] || LANGUAGE_INFO.en;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    // Add press animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    onPress();
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          buttonStyle: LanguageButtonStyles.small,
          textStyle: LanguageButtonStyles.textSmall,
          flagStyle: LanguageButtonStyles.flagSmall,
          fontSize: 14,
        };
      case 'large':
        return {
          buttonStyle: LanguageButtonStyles.large,
          textStyle: LanguageButtonStyles.textLarge,
          flagStyle: LanguageButtonStyles.flagLarge,
          fontSize: 18,
        };
      default: // medium
        return {
          buttonStyle: LanguageButtonStyles.medium,
          textStyle: LanguageButtonStyles.textMedium,
          flagStyle: LanguageButtonStyles.flagMedium,
          fontSize: 16,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <Animated.View style={[LanguageButtonStyles.animatedContainer, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={[
          LanguageButtonStyles.button,
          {
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            borderColor: isDark ? '#374151' : '#E5E7EB',
          },
          sizeStyles.buttonStyle,
          style
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Text style={[LanguageButtonStyles.flag, sizeStyles.flagStyle]}>
          {languageInfo.flag}
        </Text>
        <Text style={[
          LanguageButtonStyles.text,
          sizeStyles.textStyle,
          { color: isDark ? '#F9FAFB' : '#1F2937' }
        ]}>
          {languageInfo.name}
        </Text>
        <Ionicons 
          name="chevron-down" 
          size={sizeStyles.fontSize - 2} 
          color={isDark ? '#9CA3AF' : '#6B7280'}
          style={LanguageButtonStyles.icon}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default LanguageButton;
