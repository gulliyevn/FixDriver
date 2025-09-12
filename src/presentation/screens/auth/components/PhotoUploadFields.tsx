import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { DriverFormData, PhotoType } from './types';

interface Props {
  t: (k: string) => string;
  styles: any;
  formData: DriverFormData;
  errors: Partial<DriverFormData>;
  onChange: (field: keyof DriverFormData, value: string) => void;
}

const PhotoUploadFields: React.FC<Props> = ({ t, styles, formData, errors, onChange }) => {
  const [picking, setPicking] = useState<PhotoType | null>(null);

  const pickImage = async (target: PhotoType) => {
    try {
      setPicking(target);
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('common.permissionRequired'), t('common.mediaPermissionDenied'));
        setPicking(null);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets[0]) {
        const fieldName = target === 'license' ? 'licensePhotoUri' : 'techPassportPhotoUri';
        onChange(fieldName, result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('common.photoUploadError'));
    } finally {
      setPicking(null);
    }
  };

  const removeImage = (target: PhotoType) => {
    const fieldName = target === 'license' ? 'licensePhotoUri' : 'techPassportPhotoUri';
    onChange(fieldName, '');
  };

  const renderPhotoField = (type: PhotoType, title: string, errorKey: keyof DriverFormData) => {
    const photoUri = type === 'license' ? formData.licensePhotoUri : formData.techPassportPhotoUri;
    const error = errors[errorKey];

    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{title}</Text>
        <View style={[styles.photoContainer, error && styles.inputError]}>
          {photoUri ? (
            <View style={styles.photoPreview}>
              <Image source={{ uri: photoUri }} style={styles.photoImage} />
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => removeImage(type)}
              >
                <Ionicons name="close-circle" size={24} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.photoUploadButton}
              onPress={() => pickImage(type)}
              disabled={picking === type}
            >
              <Ionicons 
                name="camera" 
                size={32} 
                color={picking === type ? "#94A3B8" : "#64748B"} 
              />
              <Text style={[styles.photoUploadText, picking === type && styles.disabledText]}>
                {picking === type ? t('common.uploading') : t('common.takePhoto')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  };

  return (
    <>
      {renderPhotoField('license', t('auth.register.licensePhoto'), 'licensePhotoUri')}
      {renderPhotoField('tech', t('auth.register.techPassportPhoto'), 'techPassportPhotoUri')}
    </>
  );
};

export default PhotoUploadFields;
