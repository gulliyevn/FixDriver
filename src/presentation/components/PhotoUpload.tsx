import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { PhotoUploadStyles, getPhotoUploadColors } from '../styles/components/PhotoUpload.styles';

interface PhotoUploadProps {
  photo: string | null;
  onPhotoChange: (photo: string | null) => void;
  onError: (error: string | undefined) => void;
  type: 'license' | 'passport' | 'vehicle';
  uploading: boolean;
  onUploadingChange: (uploading: boolean) => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  photo,
  onPhotoChange,
  onError,
  type,
  uploading,
  onUploadingChange,
}) => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const dynamicStyles = getPhotoUploadColors(isDark);

  const getIconName = () => {
    if (uploading) return null;
    if (type === 'vehicle') return 'car-outline';
    return type === 'license' ? 'camera-outline' : 'document-outline';
  };

  const getButtonText = () => {
    if (uploading) return t('register.uploading');
    return photo ? t('register.changePhoto') : t('register.uploadPhoto');
  };

  const getLabelText = () => {
    if (type === 'vehicle') return t('register.passportPhoto');
    return type === 'license' ? t('register.licensePhoto') : t('register.passportPhoto');
  };

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        t('register.galleryAccess'),
        t('register.galleryAccessRequired'),
        [
          { text: t('register.cancel'), style: 'cancel' },
          { text: t('register.settings'), onPress: () => Linking.openSettings() }
        ]
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      onUploadingChange(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onPhotoChange(result.assets[0].uri);
        onError(undefined);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      onError(t('register.photoPickError'));
    } finally {
      onUploadingChange(false);
    }
  };

  const removePhoto = () => {
    Alert.alert(
      t('register.deletePhoto'),
      t('register.deletePhotoConfirm'),
      [
        { text: t('register.cancel'), style: 'cancel' },
        { text: t('register.delete'), onPress: () => onPhotoChange(null) }
      ]
    );
  };

  return (
    <View style={PhotoUploadStyles.inputContainer}>
      <Text style={[PhotoUploadStyles.label, dynamicStyles.label]}>
        {getLabelText()} 
        <Text style={PhotoUploadStyles.requiredStar}>*</Text>
      </Text>
      <TouchableOpacity 
        style={[PhotoUploadStyles.uploadButton, dynamicStyles.uploadButton, uploading && PhotoUploadStyles.uploadButtonDisabled]} 
        onPress={pickImage}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator size="small" color="#23408E" />
        ) : (
          <Ionicons name={getIconName()!} size={24} color="#23408E" />
        )}
        <Text style={[PhotoUploadStyles.uploadButtonText, dynamicStyles.uploadButtonText]}>{getButtonText()}</Text>
      </TouchableOpacity>
      {photo && (
        <View style={PhotoUploadStyles.photoPreview}>
          <Image source={{ uri: photo }} style={PhotoUploadStyles.photoPreviewImage} />
          <TouchableOpacity 
            style={[PhotoUploadStyles.removePhotoButton, dynamicStyles.removePhotoButton]} 
            onPress={removePhoto}
          >
            <Ionicons name="close-circle" size={24} color="#FF0000" />
          </TouchableOpacity>
          <Text style={[PhotoUploadStyles.photoPreviewText, dynamicStyles.photoPreviewText]}>{t('register.photoUploaded')}</Text>
        </View>
      )}
    </View>
  );
};

export default PhotoUpload; 