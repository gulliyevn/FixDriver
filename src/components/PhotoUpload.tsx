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
        onPress={() => {
          // Логика удалена - кнопка остается без функциональности
        }}
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
          <TouchableOpacity 
            style={PhotoUploadStyles.removePhotoButton} 
            onPress={() => {
              // Логика удалена - кнопка остается без функциональности
            }}
          >
            <Ionicons name="close-circle" size={24} color="#FF0000" />
          </TouchableOpacity>
          <Text style={PhotoUploadStyles.photoPreviewText}>{t('register.photoUploaded')}</Text>
        </View>
      )}
    </View>
  );
};

export default PhotoUpload; 