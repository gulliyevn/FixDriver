import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../../../../shared/hooks/useI18n';
import { EditProfileScreenStyles as styles } from '../styles/EditProfileScreen.styles';

/**
 * Profile Avatar Section Component
 * 
 * Avatar with user initials and role switching button
 */

interface ProfileAvatarSectionProps {
  userName: string;
  userSurname: string;
  onCirclePress: () => void;
  rotateAnim: Animated.Value;
  isDark: boolean;
}

export const ProfileAvatarSection: React.FC<ProfileAvatarSectionProps> = ({
  userName,
  userSurname,
  onCirclePress,
  rotateAnim,
  isDark
}) => {
  const { t } = useI18n();

  const getInitials = (name: string, surname: string) => {
    return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.avatarSection}>
      <View style={[styles.avatarContainer, isDark && styles.avatarContainerDark]}>
        <Text style={[styles.avatarText, isDark && styles.avatarTextDark]}>
          {getInitials(userName, userSurname)}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={[styles.roleSwitchButton, isDark && styles.roleSwitchButtonDark]}
        onPress={onCirclePress}
      >
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Ionicons 
            name="refresh" 
            size={24} 
            color={isDark ? '#F9FAFB' : '#111827'} 
          />
        </Animated.View>
      </TouchableOpacity>
      
      <Text style={[styles.roleSwitchText, isDark && styles.roleSwitchTextDark]}>
        {t('profile.switchRole')}
      </Text>
    </View>
  );
};
