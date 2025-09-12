import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useI18n } from '../../../../../shared/hooks/useI18n';

/**
 * Support Messages Hook
 * 
 * Manages message input and file attachments
 */

interface UseSupportMessagesParams {
  sendMessage: (text: string, files: any[]) => void;
  attachedFiles: any[];
  setAttachedFiles: (files: any[]) => void;
}

export const useSupportMessages = ({
  sendMessage,
  attachedFiles,
  setAttachedFiles
}: UseSupportMessagesParams) => {
  const { t } = useI18n();
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if ((!inputText.trim() && attachedFiles.length === 0)) return;

    const messageText = inputText.trim();
    const filesToSend = [...attachedFiles];
    
    setInputText('');
    setAttachedFiles([]);

    sendMessage(messageText, filesToSend);
  };

  const handleAttachFile = async () => {
    Alert.alert(
      t('support.attachFile'),
      t('support.selectFileType'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('support.takePhoto'), 
          onPress: () => takePhoto() 
        },
        { 
          text: t('support.choosePhoto'), 
          onPress: () => pickImage() 
        },
        { 
          text: t('support.document'), 
          onPress: () => pickDocument() 
        }
      ]
    );
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('errors.permissionDenied'), t('support.cameraPermissionError'));
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const newFile = {
          id: Date.now().toString(),
          name: `camera_${Date.now()}.jpg`,
          uri: asset.uri,
          type: 'image' as const,
          size: asset.fileSize,
        };
        setAttachedFiles(prev => [...prev, newFile]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert(t('errors.error'), t('support.cameraError'));
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('errors.permissionDenied'), t('support.photoPermissionError'));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const newFile = {
          id: Date.now().toString(),
          name: `photo_${Date.now()}.jpg`,
          uri: asset.uri,
          type: 'image' as const,
          size: asset.fileSize,
        };
        setAttachedFiles(prev => [...prev, newFile]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(t('errors.error'), t('support.photoSelectionError'));
    }
  };

  const pickDocument = async () => {
    Alert.alert(
      t('support.documentPicker'),
      t('support.documentPickerInfo'),
      [{ text: t('common.ok'), style: 'default' }]
    );
  };

  return {
    inputText,
    setInputText,
    handleAttachFile,
    handleSendMessage
  };
};
