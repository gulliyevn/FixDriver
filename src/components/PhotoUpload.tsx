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
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { useLanguage } from '../context/LanguageContext';
import { PhotoUploadStyles } from '../styles/components/PhotoUpload.styles';

interface PhotoUploadProps {
  photo: string | null;
  onPhotoChange: (photo: string | null) => void;
  onError: (error: string | undefined) => void;
  type: 'license' | 'passport';
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

  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        t('register.cameraAccess'),
        t('register.cameraAccessRequired'),
        [
          { text: t('register.cancel'), style: 'cancel' },
          { text: t('register.settings'), onPress: () => Linking.openSettings() }
        ]
      );
      return false;
    }
    return true;
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      t('register.selectMethod'),
      t('register.howToAddPhoto'),
      [
        {
          text: t('register.camera'),
          onPress: () => handleTakePhoto(),
        },
        {
          text: t('register.gallery'),
          onPress: () => handlePickImage(),
        },
        {
          text: t('register.cancel'),
          style: 'cancel',
        },
      ]
    );
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return;

    onUploadingChange(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const photoUri = result.assets[0].uri;
        onPhotoChange(photoUri);
        onError(undefined);
      }
    } catch (error) {
      Alert.alert(t('register.photoError'), t('register.photoTakeError'));
    } finally {
      onUploadingChange(false);
    }
  };

  const handlePickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    onUploadingChange(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const photoUri = result.assets[0].uri;
        onPhotoChange(photoUri);
        onError(undefined);
      }
    } catch (error) {
      Alert.alert(t('register.photoError'), t('register.photoPickError'));
    } finally {
      onUploadingChange(false);
    }
  };

  const handleRemovePhoto = () => {
    Alert.alert(
      t('register.deletePhoto'),
      t('register.deletePhotoConfirm'),
      [
        { text: t('register.cancel'), style: 'cancel' },
        {
          text: t('register.delete'),
          style: 'destructive',
          onPress: () => {
            onPhotoChange(null);
            onError(type === 'license' ? t('register.licensePhotoRequired') : t('register.passportPhotoRequired'));
          }
        }
      ]
    );
  };

  const getIconName = () => {
    if (uploading) return null;
    return type === 'license' ? 'camera-outline' : 'document-outline';
  };

  const getButtonText = () => {
    if (uploading) return t('register.uploading');
    return photo ? t('register.changePhoto') : t('register.uploadPhoto');
  };

  return (
    <View style={PhotoUploadStyles.inputContainer}>
      <Text style={PhotoUploadStyles.label}>
        {type === 'license' ? t('register.licensePhoto') : t('register.passportPhoto')} 
        <Text style={PhotoUploadStyles.requiredStar}>*</Text>
      </Text>
      <TouchableOpacity 
        style={[PhotoUploadStyles.uploadButton, uploading && PhotoUploadStyles.uploadButtonDisabled]} 
        onPress={showImagePickerOptions}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator size="small" color="#23408E" />
        ) : (
          <Ionicons name={getIconName()!} size={24} color="#23408E" />
        )}
        <Text style={PhotoUploadStyles.uploadButtonText}>{getButtonText()}</Text>
      </TouchableOpacity>
      {photo && (
        <View style={PhotoUploadStyles.photoPreview}>
          <Image source={{ uri: photo }} style={PhotoUploadStyles.photoPreviewImage} />
          <TouchableOpacity style={PhotoUploadStyles.removePhotoButton} onPress={handleRemovePhoto}>
            <Ionicons name="close-circle" size={24} color="#FF0000" />
          </TouchableOpacity>
          <Text style={PhotoUploadStyles.photoPreviewText}>{t('register.photoUploaded')}</Text>
        </View>
      )}
    </View>
  );
};

export default PhotoUpload; 