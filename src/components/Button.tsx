import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TextStyle, ViewStyle, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ButtonStyles } from '../styles/components/Button.styles';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
}: ButtonProps) {
  const getButtonStyle = () => {
    const styleArr: ViewStyle[] = [ButtonStyles.button];
    if (variant === 'primary') styleArr.push(ButtonStyles.buttonPrimary);
    if (variant === 'secondary') styleArr.push(ButtonStyles.buttonSecondary);
    if (variant === 'outline') styleArr.push(ButtonStyles.buttonOutline);
    if (variant === 'ghost') styleArr.push(ButtonStyles.buttonGhost);
    if (size === 'small') styleArr.push(ButtonStyles.buttonSmall);
    if (size === 'large') styleArr.push(ButtonStyles.buttonLarge);
    if (disabled) styleArr.push(ButtonStyles.buttonDisabled);
    if (loading) styleArr.push(ButtonStyles.buttonLoading);
    if (style) styleArr.push(style);
    return styleArr;
  };

  const getTextStyle = () => {
    const styleArr: TextStyle[] = [ButtonStyles.text];
    if (variant === 'primary') styleArr.push(ButtonStyles.textPrimary);
    if (variant === 'secondary') styleArr.push(ButtonStyles.textSecondary);
    if (variant === 'outline') styleArr.push(ButtonStyles.textOutline);
    if (variant === 'ghost') styleArr.push(ButtonStyles.textGhost);
    if (size === 'small') styleArr.push(ButtonStyles.textSmall);
    if (size === 'large') styleArr.push(ButtonStyles.textLarge);
    if (textStyle) styleArr.push(textStyle);
    return styleArr;
  };

  const getIconStyle = () => {
    return iconPosition === 'right' ? ButtonStyles.iconRight : ButtonStyles.icon;
  };

  const getIconColor = (): string => {
    if (variant === 'outline' || variant === 'ghost') return '#007AFF'; // colors.light.primary
    if (variant === 'secondary') return '#222'; // colors.light.text
    return '#FFF'; // colors.light.surface
  };

  const getTextColor = () => {
    if (variant === 'outline' || variant === 'ghost') return '#007AFF';
    if (variant === 'secondary') return '#222';
    return '#FFF';
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading && (
        <View style={ButtonStyles.loadingContainer}>
          <ActivityIndicator size="small" color={getTextColor()} />
        </View>
      )}
      {icon && iconPosition === 'left' && !loading && (
        <Ionicons name={icon} size={20} color={getIconColor()} style={getIconStyle()} />
      )}
      <Text style={getTextStyle()}>
        {title}
      </Text>
      {icon && iconPosition === 'right' && !loading && (
        <Ionicons name={icon} size={20} color={getIconColor()} style={getIconStyle()} />
      )}
    </TouchableOpacity>
  );
}
