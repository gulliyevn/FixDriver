import React, { useRef } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  Animated, 
  ViewStyle 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../constants/colors';
import { LanguageButtonStyles } from '../styles/components/LanguageButton.styles';

interface LanguageButtonProps {
  onPress: () => void;
  style?: ViewStyle;
  size?: 'small' | 'medium' | 'large';
}

const LanguageButton: React.FC<LanguageButtonProps> = ({ 
  onPress, 
  style, 
  size = 'medium' 
}) => {
  const { language, getLanguageInfo } = useLanguage();
  const { isDark } = useTheme();
  const currentColors = isDark ? colors.dark : colors.light;
  
  const languageInfo = getLanguageInfo(language);
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

  const styles = {
    button: {
      ...LanguageButtonStyles.button,
      backgroundColor: currentColors.surface,
      borderWidth: 1,
      borderColor: currentColors.border,
      ...sizeStyles.buttonStyle,
    },
    flag: {
      ...LanguageButtonStyles.flag,
      ...sizeStyles.flagStyle,
    },
    text: {
      ...LanguageButtonStyles.text,
      ...sizeStyles.textStyle,
      color: currentColors.text,
    },
    icon: {
      ...LanguageButtonStyles.icon,
    },
  };

  return (
    <Animated.View style={[LanguageButtonStyles.animatedContainer, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={[styles.button, style]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Text style={styles.flag}>{languageInfo.flag}</Text>
        <Text style={styles.text}>{languageInfo.name}</Text>
        <Ionicons 
          name="chevron-down" 
          size={sizeStyles.fontSize - 2} 
          color={currentColors.textSecondary}
          style={styles.icon}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default LanguageButton; 