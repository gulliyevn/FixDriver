import React, { useRef } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Animated, 
  ViewStyle 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../constants/colors';

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

  const styles = StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: currentColors.surface,
      borderWidth: 1,
      borderColor: currentColors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      ...sizeStyles,
    },
    flag: {
      fontSize: sizeStyles.flagSize,
      marginRight: 8,
    },
    text: {
      fontSize: sizeStyles.fontSize,
      fontWeight: '600',
      color: currentColors.text,
      letterSpacing: 0.2,
    },
    icon: {
      marginLeft: 4,
    },
  });

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
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