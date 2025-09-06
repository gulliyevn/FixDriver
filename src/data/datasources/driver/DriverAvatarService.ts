import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { AVATAR_CONSTANTS } from '../../../shared/constants/adaptiveConstants';

export interface AvatarData {
  uri: string;
  timestamp: number;
  size: number;
  type: string;
}

export interface AvatarUploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export interface AvatarService {
  uploadAvatar(file: File): Promise<AvatarUploadResponse>;
  deleteAvatar(url: string): Promise<boolean>;
}

export class DriverAvatarService {
  private static readonly AVATAR_STORAGE_KEY = AVATAR_CONSTANTS.STORAGE_KEYS.AVATAR;
  private static readonly AVATAR_MOCK_KEY = AVATAR_CONSTANTS.STORAGE_KEYS.MOCK_DATA;

  /**
   * Load avatar from AsyncStorage
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
   * Save avatar to AsyncStorage
   */
  static async saveAvatar(uri: string): Promise<boolean> {
    try {
      const avatarData: AvatarData = {
        uri,
        timestamp: Date.now(),
        size: AVATAR_CONSTANTS.DEFAULTS.SIZE, // Will be filled during upload
        type: AVATAR_CONSTANTS.IMAGE_PICKER.DEFAULT_TYPE
      };

      await AsyncStorage.setItem(this.AVATAR_STORAGE_KEY, JSON.stringify(avatarData));
      
      // Save to mocks for compatibility
      await this.saveToMocks(uri);
      
      return true;
    } catch (error) {
      console.error('Error saving avatar:', error);
      return false;
    }
  }

  /**
   * Delete avatar
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
   * Launch camera to take photo
   */
  static async takePhoto(): Promise<string | null> {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        throw new Error(AVATAR_CONSTANTS.ERRORS.CAMERA_PERMISSION_DENIED);
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: AVATAR_CONSTANTS.IMAGE_PICKER.ASPECT_RATIO,
        quality: AVATAR_CONSTANTS.IMAGE_PICKER.QUALITY,
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
   * Pick photo from gallery
   */
  static async pickFromGallery(): Promise<string | null> {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        throw new Error(AVATAR_CONSTANTS.ERRORS.GALLERY_PERMISSION_DENIED);
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: AVATAR_CONSTANTS.IMAGE_PICKER.ASPECT_RATIO,
        quality: AVATAR_CONSTANTS.IMAGE_PICKER.QUALITY,
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
   * Save to mocks for compatibility with existing code
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
   * Delete from mocks
   */
  private static async deleteFromMocks(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.AVATAR_MOCK_KEY);
    } catch (error) {
      console.error('Error deleting from mocks:', error);
    }
  }

  /**
   * Load from mocks for compatibility
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

  /**
   * Upload avatar to server via gRPC
   * TODO: Implement real gRPC call
   */
  static async uploadAvatarToServer(file: File): Promise<AvatarUploadResponse> {
    try {
      // Mock implementation for now
      // TODO: Replace with real gRPC call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        url: `https://api.fixdrive.com/avatars/${Date.now()}.jpg`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  /**
   * Delete avatar from server via gRPC
   * TODO: Implement real gRPC call
   */
  static async deleteAvatarFromServer(url: string): Promise<boolean> {
    try {
      // Mock implementation for now
      // TODO: Replace with real gRPC call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    } catch (error) {
      console.error('Error deleting avatar from server:', error);
      return false;
    }
  }
}