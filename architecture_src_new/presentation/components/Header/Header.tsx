import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../core/context/ThemeContext';
import { useLanguage } from '../../core/context/LanguageContext';
import { createHeaderStyles } from './styles/Header.styles';

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  showNotifications?: boolean;
  showProfile?: boolean;
  onBackPress?: () => void;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
  rightComponent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  showNotifications = false,
  showProfile = false,
  onBackPress,
  onNotificationPress,
  onProfilePress,
  rightComponent,
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const styles = createHeaderStyles(isDark);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Left side */}
        <View style={styles.leftSection}>
          {showBackButton && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBackPress}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color={styles.icon.color} />
            </TouchableOpacity>
          )}
        </View>

        {/* Center */}
        <View style={styles.centerSection}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        {/* Right side */}
        <View style={styles.rightSection}>
          {rightComponent ? (
            rightComponent
          ) : (
            <>
              {showNotifications && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={onNotificationPress}
                  activeOpacity={0.7}
                >
                  <Ionicons name="notifications-outline" size={24} color={styles.icon.color} />
                </TouchableOpacity>
              )}
              
              {showProfile && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={onProfilePress}
                  activeOpacity={0.7}
                >
                  <Ionicons name="person-outline" size={24} color={styles.icon.color} />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Header;
