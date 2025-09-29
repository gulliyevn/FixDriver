import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  Animated,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Icon } from '../../../shared/components/IconLibrary';
import { ButtonStyles } from './Button.styles';
import { useTheme } from '../../../core/context/ThemeContext';

export interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
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
  const { isDark, colors } = useTheme();

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
      fullWidth && ButtonStyles.fullWidth,
      disabled && ButtonStyles.disabled,
      loading && ButtonStyles.loading,
      style,
    ];

    // Add dynamic colors based on variant and theme
    const dynamicStyle: ViewStyle = {};
    
    switch (variant) {
      case 'primary':
        dynamicStyle.backgroundColor = colors.primary;
        break;
      case 'secondary':
        dynamicStyle.backgroundColor = colors.secondary;
        break;
      case 'outline':
        dynamicStyle.backgroundColor = 'transparent';
        dynamicStyle.borderWidth = 2;
        dynamicStyle.borderColor = colors.primary;
        break;
      case 'ghost':
        dynamicStyle.backgroundColor = 'transparent';
        break;
      case 'danger':
        dynamicStyle.backgroundColor = colors.error;
        break;
    }

    return [...baseStyle, dynamicStyle] as unknown as ViewStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle = [
      ButtonStyles.text,
      ButtonStyles[`${size}Text`],
      disabled && ButtonStyles.disabledText,
      textStyle,
    ];

    // Add dynamic text colors based on variant and theme
    const dynamicTextStyle: TextStyle = {};
    
    switch (variant) {
      case 'primary':
        dynamicTextStyle.color = colors.card;
        break;
      case 'secondary':
        dynamicTextStyle.color = colors.text;
        break;
      case 'outline':
        dynamicTextStyle.color = colors.primary;
        break;
      case 'ghost':
        dynamicTextStyle.color = colors.primary;
        break;
      case 'danger':
        dynamicTextStyle.color = colors.card;
        break;
    }

    return [...baseTextStyle, dynamicTextStyle] as unknown as TextStyle;
  };

  const getIconColor = (): string => {
    if (disabled) return colors.textTertiary;
    
    switch (variant) {
      case 'primary':
        return colors.card;
      case 'secondary':
        return colors.text;
      case 'outline':
        return colors.primary;
      case 'ghost':
        return colors.primary;
      case 'danger':
        return colors.card;
      default:
        return colors.card;
    }
  };

  const renderIcon = () => {
    if (!icon) return null;

    return (
      <Icon
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
          title && <Text style={getTextStyle()}>{title}</Text>
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
