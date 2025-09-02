import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppCardStyles } from '../styles/components/AppCard.styles';

interface AppCardProps {
  title?: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  variant?: 'default' | 'primary' | 'secondary';
  disabled?: boolean;
  style?: ViewStyle;
  margin?: number;
  children?: React.ReactNode;
}

export default function AppCard({
  title,
  subtitle,
  icon,
  onPress,
  variant = 'default',
  disabled = false,
  style,
  margin = 0,
  children,
}: AppCardProps) {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';

  const cardStyle = [
    AppCardStyles.container,
    { margin },
    isPrimary && AppCardStyles.containerPrimary,
    isSecondary && AppCardStyles.containerSecondary,
    disabled && AppCardStyles.containerDisabled,
    style,
  ];

  const iconStyle = [
    AppCardStyles.icon,
    isPrimary && AppCardStyles.iconPrimary,
  ];

  const titleStyle = [
    AppCardStyles.title,
    isPrimary && AppCardStyles.titlePrimary,
  ];

  const subtitleStyle = [
    AppCardStyles.subtitle,
    isPrimary && AppCardStyles.subtitlePrimary,
  ];

  const CardContent = () => (
    <>
      {(title || subtitle || icon) && (
        <View style={AppCardStyles.content}>
          {icon && (
            <Ionicons name={icon} size={24} style={iconStyle} />
          )}
          {(title || subtitle) && (
            <View style={AppCardStyles.textContainer}>
              {title && <Text style={titleStyle}>{title}</Text>}
              {subtitle && <Text style={subtitleStyle}>{subtitle}</Text>}
            </View>
          )}
        </View>
      )}
      {children}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <CardContent />
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle}>
      <CardContent />
    </View>
  );
}
