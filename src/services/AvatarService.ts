import APIClient from './APIClient';
import * as ImagePicker from 'expo-image-picker';

export interface AvatarData {
  id: string;
  userId: string;
  url: string;
  thumbnailUrl?: string;
  timestamp: number;
  size: number;
  type: string;
  isDefault: boolean;
}

export interface UploadAvatarResponse {
  success: boolean;
  avatar?: AvatarData;
  error?: string;
}

export class AvatarService {
  /**
   * Получает аватар пользователя
   */
  static async getAvatar(userId: string): Promise<AvatarData | null> {
    try {
      const response = await APIClient.get<AvatarData>(`/avatars/user/${userId}`);
      return response.success && response.data ? response.data : null;
    } catch (error) {
      console.error('Error getting avatar:', error);
      return null;
    }
  }

  /**
   * Загружает новый аватар
   */
  static async uploadAvatar(userId: string, imageUri: string): Promise<UploadAvatarResponse> {
    try {
      const formData = new FormData();
      formData.append('avatar', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      } as any);
      formData.append('userId', userId);

      const response = await APIClient.post<AvatarData>('/avatars/upload', formData);
      
      if (response.success && response.data) {
        return {
          success: true,
          avatar: response.data
        };
      }
      
      return {
        success: false,
        error: response.error || 'Ошибка при загрузке аватара'
      };
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return {
        success: false,
        error: 'Ошибка при загрузке аватара'
      };
    }
  }

  /**
   * Удаляет аватар пользователя
   */
  static async deleteAvatar(userId: string): Promise<boolean> {
    try {
      const response = await APIClient.delete<{ success: boolean }>(`/avatars/user/${userId}`);
      return response.success && response.data?.success || false;
    } catch (error) {
      console.error('Error deleting avatar:', error);
      return false;
    }
  }

  /**
   * Устанавливает аватар по умолчанию
   */
  static async setDefaultAvatar(userId: string): Promise<boolean> {
    try {
      const response = await APIClient.post<{ success: boolean }>(`/avatars/user/${userId}/default`, {});
      return response.success && response.data?.success || false;
    } catch (error) {
      console.error('Error setting default avatar:', error);
      return false;
    }
  }

  /**
   * Получает список доступных аватаров по умолчанию
   */
  static async getDefaultAvatars(): Promise<Array<{ id: string; url: string; thumbnailUrl: string; name: string }>> {
    try {
      const response = await APIClient.get<Array<{ id: string; url: string; thumbnailUrl: string; name: string }>>('/avatars/defaults');
      return response.success && response.data ? response.data : [];
    } catch (error) {
      console.error('Error getting default avatars:', error);
      return [];
    }
  }

  /**
   * Устанавливает аватар по умолчанию по ID
   */
  static async setDefaultAvatarById(userId: string, avatarId: string): Promise<boolean> {
    try {
      const response = await APIClient.post<{ success: boolean }>(`/avatars/user/${userId}/set-default`, { avatarId });
      return response.success && response.data?.success || false;
    } catch (error) {
      console.error('Error setting default avatar by ID:', error);
      return false;
    }
  }

  /**
   * Открывает галерею для выбора изображения
   */
  static async pickImageFromGallery(): Promise<string | null> {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }
      return null;
    } catch (error) {
      console.error('Error picking image from gallery:', error);
      return null;
    }
  }

  /**
   * Открывает камеру для съемки
   */
  static async takePhoto(): Promise<string | null> {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }
      return null;
    } catch (error) {
      console.error('Error taking photo:', error);
      return null;
    }
  }

  /**
   * Запрашивает разрешения на доступ к камере и галерее
   */
  static async requestPermissions(): Promise<{ camera: boolean; gallery: boolean }> {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      return {
        camera: cameraPermission.status === 'granted',
        gallery: mediaLibraryPermission.status === 'granted'
      };
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return {
        camera: false,
        gallery: false
      };
    }
  }

  /**
   * Проверяет размер изображения
   */
  static validateImageSize(uri: string): Promise<boolean> {
    return new Promise((resolve) => {
      // В реальном приложении здесь была бы проверка размера файла
      // Пока возвращаем true
      resolve(true);
    });
  }

  /**
   * Сжимает изображение (заглушка)
   */
  static async compressImage(uri: string, quality: number = 0.8): Promise<string> {
    // В реальном приложении здесь была бы сжатие изображения
    // Пока возвращаем оригинальную URI
    return uri;
  }
}

export default AvatarService;