import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { AvatarService } from '../services/AvatarService';
import { useI18n } from './useI18n';

export const useAvatar = () => {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();

  // Загружаем аватар при инициализации
  useEffect(() => {
    loadAvatar();
  }, []);

  const loadAvatar = useCallback(async () => {
    try {
      setLoading(true);
      const uri = await AvatarService.loadAvatar();
      setAvatarUri(uri);
    } catch (error) {
      console.error('Error loading avatar:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const takePhoto = useCallback(async () => {
    try {
      setLoading(true);
      const uri = await AvatarService.takePhoto();
      
      if (uri) {
        const success = await AvatarService.saveAvatar(uri);
        if (success) {
          setAvatarUri(uri);
          Alert.alert(
            t('profile.photoSuccess'),
            t('profile.photoTakeSuccess')
          );
        } else {
          Alert.alert(
            t('profile.photoError'),
            t('profile.photoSaveError')
          );
        }
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert(
        t('profile.photoError'),
        t('profile.photoTakeError')
      );
    } finally {
      setLoading(false);
    }
  }, [t]);

  const pickFromGallery = useCallback(async () => {
    try {
      setLoading(true);
      const uri = await AvatarService.pickFromGallery();
      
      if (uri) {
        const success = await AvatarService.saveAvatar(uri);
        if (success) {
          setAvatarUri(uri);
          Alert.alert(
            t('profile.photoSuccess'),
            t('profile.photoPickSuccess')
          );
        } else {
          Alert.alert(
            t('profile.photoError'),
            t('profile.photoSaveError')
          );
        }
      }
    } catch (error) {
      console.error('Error picking from gallery:', error);
      Alert.alert(
        t('profile.photoError'),
        t('profile.photoPickError')
      );
    } finally {
      setLoading(false);
    }
  }, [t]);

  const deleteAvatar = useCallback(async () => {
    const confirmDelete = async () => {
      try {
        setLoading(true);
        const success = await AvatarService.deleteAvatar();
        if (success) {
          setAvatarUri(null);
          Alert.alert(
            t('profile.photoSuccess'),
            t('profile.photoDeleteSuccess')
          );
        } else {
          Alert.alert(
            t('profile.photoError'),
            t('profile.photoDeleteError')
          );
        }
      } catch (error) {
        console.error('Error deleting avatar:', error);
        Alert.alert(
          t('profile.photoError'),
          t('profile.photoDeleteError')
        );
      } finally {
        setLoading(false);
      }
    };

    Alert.alert(
      t('profile.deletePhotoConfirm'),
      t('profile.deletePhotoMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: confirmDelete
        }
      ]
    );
  }, [t]);

  const showAvatarOptions = useCallback(() => {
    if (avatarUri) {
      Alert.alert(
        t('profile.changePhoto'),
        t('profile.changePhotoMessage'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('profile.takePhoto'), onPress: takePhoto },
          { text: t('profile.chooseFromGallery'), onPress: pickFromGallery },
          { 
            text: t('profile.deletePhoto'), 
            style: 'destructive',
            onPress: deleteAvatar
          }
        ]
      );
    } else {
      Alert.alert(
        t('profile.addPhoto'),
        t('profile.addPhotoMessage'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('profile.takePhoto'), onPress: takePhoto },
          { text: t('profile.chooseFromGallery'), onPress: pickFromGallery }
        ]
      );
    }
  }, [avatarUri, takePhoto, pickFromGallery, deleteAvatar, t]);

  return {
    avatarUri,
    loading,
    takePhoto,
    pickFromGallery,
    deleteAvatar,
    showAvatarOptions,
    loadAvatar
  };
};