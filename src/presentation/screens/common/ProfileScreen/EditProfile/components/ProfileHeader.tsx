import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../../../../shared/hooks/useI18n';
import { EditProfileScreenStyles as styles } from '../styles/EditProfileScreen.styles';

/**
 * Profile Header Component
 * 
 * Header with back button, title and edit button
 */

interface ProfileHeaderProps {
  onBackPress: () => void;
  onEditPress: () => void;
  isEditing: boolean;
  isDark: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  onBackPress,
  onEditPress,
  isEditing,
  isDark
}) => {
  const { t } = useI18n();

  return (
    <View style={[styles.header, isDark && styles.headerDark]}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={onBackPress}
      >
        <Ionicons name="arrow-back" size={24} color={isDark ? '#F9FAFB' : '#111827'} />
      </TouchableOpacity>
      
      <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
        {t('profile.editProfile')}
      </Text>
      
      <TouchableOpacity 
        style={styles.editButton}
        onPress={onEditPress}
      >
        <Ionicons 
          name={isEditing ? "checkmark" : "create-outline"} 
          size={24} 
          color={isDark ? '#F9FAFB' : '#111827'} 
        />
      </TouchableOpacity>
    </View>
  );
};
