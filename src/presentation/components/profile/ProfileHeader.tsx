import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { ProfileHeaderStyles as styles, getProfileHeaderColors } from '../../styles/components/profile/ProfileHeader.styles';

interface ProfileHeaderProps {
  onBackPress: () => void;
  onEditPress: () => void;
  isEditing: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  onBackPress,
  onEditPress,
  isEditing,
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const dynamicStyles = getProfileHeaderColors(isDark);
  const currentColors = isDark ? { dark: { primary: '#3B82F6' } } : { light: { primary: '#083198' } };

  return (
    <View style={[styles.header, dynamicStyles.header]}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={dynamicStyles.backButton.color} />
      </TouchableOpacity>
      <Text style={[styles.title, dynamicStyles.title]}>{t('profile.editProfile')}</Text>
      <TouchableOpacity 
        onPress={onEditPress}
        style={styles.backButton}
      >
        <Ionicons 
          name={isEditing ? "checkmark" : "create-outline"} 
          size={24} 
          color={isDark ? currentColors.dark.primary : currentColors.light.primary} 
        />
      </TouchableOpacity>
    </View>
  );
};

export default ProfileHeader; 