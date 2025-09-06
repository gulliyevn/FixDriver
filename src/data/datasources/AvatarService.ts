import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { AVATAR_CONSTANTS } from '../../shared/constants/adaptiveConstants';

export interface AvatarData {
  uri: string;
  timestamp: number;
  size: number;
  type: string;
}

export interface IAvatarService {
  loadAvatar(): Promise<string | null>;
  saveAvatar(uri: string): Promise<boolean>;
  deleteAvatar(): Promise<boolean>;
  takePhoto(): Promise<string | null>;
  pickFromGallery(): Promise<string | null>;
  loadFromMocks(): Promise<string | null>;
  uploadAvatarGrpc(uri: string): Promise<boolean>;
  deleteAvatarGrpc(): Promise<boolean>;
}

export class AvatarService {

  /**
   * Load avatar from AsyncStorage
   */
  static async loadAvatar(): Promise<string | null> {
    try {
      const avatarData = await AsyncStorage.getItem(AVATAR_CONSTANTS.STORAGE_KEYS.AVATAR);
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
        size: AVATAR_CONSTANTS.DEFAULTS.SIZE,
        type: AVATAR_CONSTANTS.IMAGE_PICKER.DEFAULT_TYPE
      };

      await AsyncStorage.setItem(AVATAR_CONSTANTS.STORAGE_KEYS.AVATAR, JSON.stringify(avatarData));
      
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
      await AsyncStorage.removeItem(AVATAR_CONSTANTS.STORAGE_KEYS.AVATAR);
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
      await AsyncStorage.setItem(AVATAR_CONSTANTS.STORAGE_KEYS.MOCK_DATA, JSON.stringify(mockData));
    } catch (error) {
      console.error('Error saving to mocks:', error);
    }
  }

  /**
   * Delete from mocks
   */
  private static async deleteFromMocks(): Promise<void> {
    try {
      await AsyncStorage.removeItem(AVATAR_CONSTANTS.STORAGE_KEYS.MOCK_DATA);
    } catch (error) {
      console.error('Error deleting from mocks:', error);
    }
  }

  /**
   * Load from mocks for compatibility
   */
  static async loadFromMocks(): Promise<string | null> {
    try {
      const mockData = await AsyncStorage.getItem(AVATAR_CONSTANTS.STORAGE_KEYS.MOCK_DATA);
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
   * Upload avatar via gRPC
   * TODO: Implement real gRPC call
   */
  static async uploadAvatarGrpc(uri: string): Promise<boolean> {
    try {
      // Mock implementation for now
      // TODO: Replace with real gRPC call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error('gRPC upload avatar error:', error);
      return false;
    }
  }

  /**
   * Delete avatar via gRPC
   * TODO: Implement real gRPC call
   */
  static async deleteAvatarGrpc(): Promise<boolean> {
    try {
      // Mock implementation for now
      // TODO: Replace with real gRPC call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    } catch (error) {
      console.error('gRPC delete avatar error:', error);
      return false;
    }
  }
}