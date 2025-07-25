import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import * as ImagePicker from 'expo-image-picker';
import { ProfileAvatarSectionStyles as styles, getProfileAvatarSectionColors } from '../../styles/components/profile/ProfileAvatarSection.styles';

interface ProfileAvatarSectionProps {
  userName: string;
  userSurname: string;
  profilePhoto: string | null;
  setProfilePhoto: (photo: string | null) => void;
  onCirclePress: () => void;
  rotateAnim: Animated.Value;
}

const ProfileAvatarSection: React.FC<ProfileAvatarSectionProps> = ({
  userName,
  userSurname,
  profilePhoto,
  setProfilePhoto,
  onCirclePress,
  rotateAnim,
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const dynamicStyles = getProfileAvatarSectionColors(isDark);

  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        t('profile.cameraAccess'),
        t('profile.cameraAccessRequired'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('profile.settings'), onPress: () => {} }
        ]
      );
      return false;
    }
    return true;
  };

  const requestGalleryPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        t('profile.galleryAccess'),
        t('profile.galleryAccessRequired'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('profile.settings'), onPress: () => {} }
        ]
      );
      return false;
    }
    return true;
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        setProfilePhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert(t('profile.photoError'), t('profile.photoTakeError'));
    }
  };

  const handleChooseFromGallery = async () => {
    const hasPermission = await requestGalleryPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        setProfilePhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert(t('profile.photoError'), t('profile.photoPickError'));
    }
  };

  return (
    <View style={styles.avatarSection}>
      <View style={[styles.profileNameBox, dynamicStyles.profileNameBox]}>
        <View style={styles.avatar}>
          {profilePhoto ? (
            <Image source={{ uri: profilePhoto }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>{userName[0]}{userSurname[0]}</Text>
          )}
          <TouchableOpacity 
            style={styles.addPhotoButton}
            onPress={() => {
              if (profilePhoto) {
                Alert.alert(
                  t('profile.changePhoto'),
                  t('profile.changePhotoMessage'),
                  [
                    { text: t('common.cancel'), style: 'cancel' },
                    { text: t('profile.takePhoto'), onPress: handleTakePhoto },
                    { text: t('profile.chooseFromGallery'), onPress: handleChooseFromGallery },
                    { 
                      text: t('profile.deletePhoto'), 
                      style: 'destructive',
                      onPress: () => {
                        Alert.alert(
                          t('profile.deletePhotoConfirm'),
                          t('profile.deletePhotoMessage'),
                          [
                            { text: t('common.cancel'), style: 'cancel' },
                            { 
                              text: t('common.delete'), 
                              style: 'destructive',
                              onPress: () => setProfilePhoto(null)
                            }
                          ]
                        );
                      }
                    }
                  ]
                );
              } else {
                Alert.alert(
                  t('profile.addPhoto'),
                  t('profile.addPhotoMessage'),
                  [
                    { text: t('common.cancel'), style: 'cancel' },
                    { text: t('profile.takePhoto'), onPress: handleTakePhoto },
                    { text: t('profile.chooseFromGallery'), onPress: handleChooseFromGallery }
                  ]
                );
              }
            }}
            accessibilityLabel={profilePhoto ? t('profile.changePhoto') : t('profile.addPhoto')}
          >
            <Ionicons name={profilePhoto ? "camera" : "add"} size={10} color="#083198" />
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