import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Alert, Modal, Dimensions } from 'react-native';
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
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const handleAvatarPress = () => {
    if (avatarUri) {
      setShowAvatarModal(true);
    }
  };

  const closeAvatarModal = () => {
    setShowAvatarModal(false);
  };

  return (
    <View style={styles.avatarSection}>
      <View style={[styles.profileNameBox, dynamicStyles.profileNameBox]}>
        <TouchableOpacity 
          style={styles.avatar}
          onPress={handleAvatarPress}
          disabled={!avatarUri}
        >
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
              <Ionicons name="hourglass-outline" size={12} color="#083198" />
            ) : (
              <Ionicons name={avatarUri ? "camera" : "add"} size={12} color="#083198" />
            )}
          </TouchableOpacity>
        </TouchableOpacity>
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

      {/* Модальное окно для просмотра аватара */}
      <Modal
        visible={showAvatarModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeAvatarModal}
      >
        <View style={styles.avatarModalOverlay}>
          <TouchableOpacity 
            style={styles.avatarModalBackground} 
            onPress={closeAvatarModal}
            activeOpacity={1}
          >
            <TouchableOpacity 
              style={styles.avatarModalContent}
              onPress={() => {}} // Предотвращаем закрытие при нажатии на фото
              activeOpacity={1}
            >
              <Image 
                source={{ uri: avatarUri }} 
                style={styles.avatarModalImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileAvatarSection; 