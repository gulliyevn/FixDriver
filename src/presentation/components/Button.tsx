import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  Animated,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { ButtonStyles } from '../styles/components/Button.styles';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
  children,
}) => {
  const { isDark } = useTheme();

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled || loading) return;
    
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    if (disabled || loading) return;
    onPress();
  };

  const getButtonStyle = (): ViewStyle => {
    const baseStyle = [
      ButtonStyles.button,
      ButtonStyles[size],
      ButtonStyles[variant],
      fullWidth && ButtonStyles.fullWidth,
      disabled && ButtonStyles.disabled,
      loading && ButtonStyles.loading,
      style,
    ];

    return baseStyle as unknown as ViewStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle = [
      ButtonStyles.text,
      ButtonStyles[`${size}Text`],
      ButtonStyles[`${variant}Text`],
      disabled && ButtonStyles.disabledText,
      textStyle,
    ];

    return baseTextStyle as unknown as TextStyle;
  };

  const getIconColor = (): string => {
    if (disabled) return isDark ? '#6B7280' : '#9CA3AF';
    
    switch (variant) {
      case 'primary':
        return '#FFFFFF';
      case 'secondary':
        return isDark ? '#F9FAFB' : '#1F2937';
      case 'outline':
        return isDark ? '#F9FAFB' : '#1F2937';
      case 'ghost':
        return isDark ? '#F9FAFB' : '#1F2937';
      case 'danger':
        return '#FFFFFF';
      default:
        return '#FFFFFF';
    }
  };

  const renderIcon = () => {
    if (!icon) return null;

    return (
      <Ionicons
        name={icon}
        size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
        color={getIconColor()}
        style={[
          ButtonStyles.icon,
          iconPosition === 'right' && ButtonStyles.iconRight,
        ]}
      />
    );
  };

  const renderContent = () => {
    if (children) {
      return children;
    }

    return (
      <>
        {icon && iconPosition === 'left' && renderIcon()}
        {loading ? (
          <ActivityIndicator
            size={size === 'small' ? 'small' : 'small'}
            color={getIconColor()}
            style={ButtonStyles.loader}
          />
        ) : (
          <Text style={getTextStyle()}>{title}</Text>
        )}
        {icon && iconPosition === 'right' && renderIcon()}
      </>
    );
  };

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={getButtonStyle()}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={1}
      >
        {renderContent()}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default Button;
