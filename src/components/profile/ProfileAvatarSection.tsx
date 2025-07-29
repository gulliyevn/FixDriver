import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../hooks/useI18n';
import { useAvatar } from '../../hooks/useAvatar';
import { ProfileAvatarSectionStyles as styles, getProfileAvatarSectionColors } from '../../styles/components/profile/ProfileAvatarSection.styles';

interface ProfileAvatarSectionProps {
  userName: string;
  userSurname: string;
  onCirclePress: () => void;
  rotateAnim: Animated.Value;
}

const ProfileAvatarSection: React.FC<ProfileAvatarSectionProps> = ({
  userName,
  userSurname,
  onCirclePress,
  rotateAnim,
}) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const { avatarUri, loading, showAvatarOptions } = useAvatar();
  const dynamicStyles = getProfileAvatarSectionColors(isDark);

  return (
    <View style={styles.avatarSection}>
      <View style={[styles.profileNameBox, dynamicStyles.profileNameBox]}>
        <View style={styles.avatar}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          ) : (
            <Ionicons 
              name="person-circle-outline" 
              size={60} 
              color="#FFFFFF" 
            />
          )}
          <TouchableOpacity 
            style={[styles.addPhotoButton, loading && { opacity: 0.5 }]}
            onPress={showAvatarOptions}
            disabled={loading}
            accessibilityLabel={avatarUri ? t('profile.changePhoto') : t('profile.addPhoto')}
          >
            {loading ? (
              <Ionicons name="hourglass-outline" size={10} color="#083198" />
            ) : (
              <Ionicons name={avatarUri ? "camera" : "add"} size={10} color="#083198" />
            )}
          </TouchableOpacity>
        </View>
        <Text 
          style={[styles.profileName, dynamicStyles.profileName]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {userName} {userSurname}
        </Text>
        <TouchableOpacity 
          style={[styles.rightCircle, dynamicStyles.rightCircle]}
          onPress={onCirclePress}
          activeOpacity={0.7}
        >
          <Animated.View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              transform: [{
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '180deg']
                })
              }]
            }}
          >
            <Ionicons name="sync" size={20} color={isDark ? '#9CA3AF' : '#666666'} />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileAvatarSection; 