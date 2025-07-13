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
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 16,
          fontSize: 14,
          flagSize: 16,
        };
      case 'large':
        return {
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: 20,
          fontSize: 18,
          flagSize: 20,
        };
      default: // medium
        return {
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 18,
          fontSize: 16,
          flagSize: 18,
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
      ...sizeStyles,
    },
    flag: {
      ...LanguageButtonStyles.flag,
      fontSize: sizeStyles.flagSize,
    },
    text: {
      ...LanguageButtonStyles.text,
      fontSize: sizeStyles.fontSize,
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