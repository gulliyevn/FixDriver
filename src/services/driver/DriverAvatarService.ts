import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export interface AvatarData {
  uri: string;
  timestamp: number;
  size: number;
  type: string;
}

export class DriverAvatarService {
  private static readonly AVATAR_STORAGE_KEY = 'driver_avatar';
  private static readonly AVATAR_MOCK_KEY = 'avatar_mock_data';

  /**
   * Загружает аватар из AsyncStorage
   */
  static async loadAvatar(): Promise<string | null> {
    try {
      const avatarData = await AsyncStorage.getItem(this.AVATAR_STORAGE_KEY);
      if (avatarData) {
        const parsed: AvatarData = JSON.parse(avatarData);
        return parsed.uri;
      }
      return null;
    } catch (error) {
      console.error('Error loading avatar:', error);
      return null;
    }
  }

  /**
   * Сохраняет аватар в AsyncStorage
   */
  static async saveAvatar(uri: string): Promise<boolean> {
    try {
      const avatarData: AvatarData = {
        uri,
        timestamp: Date.now(),
        size: 0, // Будет заполнено при загрузке
        type: 'image/jpeg'
      };

      await AsyncStorage.setItem(this.AVATAR_STORAGE_KEY, JSON.stringify(avatarData));
      
      // Сохраняем в моках для совместимости
      await this.saveToMocks(uri);
      
      return true;
    } catch (error) {
      console.error('Error saving avatar:', error);
      return false;
    }
  }

  /**
   * Удаляет аватар
   */
  static async deleteAvatar(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(this.AVATAR_STORAGE_KEY);
      await this.deleteFromMocks();
      return true;
    } catch (error) {
      console.error('Error deleting avatar:', error);
      return false;
    }
  }

  /**
   * Запускает камеру для съемки фото
   */
  static async takePhoto(): Promise<string | null> {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Camera permission denied');
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
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
   * Выбирает фото из галереи
   */
  static async pickFromGallery(): Promise<string | null> {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Gallery permission denied');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }
      return null;
    } catch (error) {
      console.error('Error picking from gallery:', error);
      return null;
    }
  }

  /**
   * Сохраняет в моки для совместимости с существующим кодом
   */
  private static async saveToMocks(uri: string): Promise<void> {
    try {
      const mockData = { avatar: uri };
      await AsyncStorage.setItem(this.AVATAR_MOCK_KEY, JSON.stringify(mockData));
    } catch (error) {
      console.error('Error saving to mocks:', error);
    }
  }

  /**
   * Удаляет из моков
   */
  private static async deleteFromMocks(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.AVATAR_MOCK_KEY);
    } catch (error) {
      console.error('Error deleting from mocks:', error);
    }
  }

  /**
   * Загружает из моков для совместимости
   */
  static async loadFromMocks(): Promise<string | null> {
    try {
      const mockData = await AsyncStorage.getItem(this.AVATAR_MOCK_KEY);
      if (mockData) {
        const parsed = JSON.parse(mockData);
        return parsed.avatar || null;
      }
      return null;
    } catch (error) {
      console.error('Error loading from mocks:', error);
      return null;
    }
  }
}