import { AvatarService } from '../../../data/datasources/AvatarService';

/**
 * Domain usecase for avatar operations
 * Abstracts data layer access from presentation layer
 */
export const avatarOperations = {
  /**
   * Load avatar from storage
   */
  async loadAvatar(): Promise<string | null> {
    try {
      return await AvatarService.loadAvatar();
    } catch (error) {
      console.error('Error loading avatar:', error);
      return null;
    }
  },

  /**
   * Save avatar to storage
   */
  async saveAvatar(uri: string): Promise<boolean> {
    try {
      return await AvatarService.saveAvatar(uri);
    } catch (error) {
      console.error('Error saving avatar:', error);
      return false;
    }
  },

  /**
   * Delete avatar from storage
   */
  async deleteAvatar(): Promise<boolean> {
    try {
      return await AvatarService.deleteAvatar();
    } catch (error) {
      console.error('Error deleting avatar:', error);
      return false;
    }
  },

  /**
   * Take photo using camera
   */
  async takePhoto(): Promise<string | null> {
    try {
      return await AvatarService.takePhoto();
    } catch (error) {
      console.error('Error taking photo:', error);
      return null;
    }
  },

  /**
   * Pick photo from gallery
   */
  async pickFromGallery(): Promise<string | null> {
    try {
      return await AvatarService.pickFromGallery();
    } catch (error) {
      console.error('Error picking from gallery:', error);
      return null;
    }
  },

  /**
   * Upload avatar to server via gRPC
   */
  async uploadAvatarGrpc(uri: string): Promise<boolean> {
    try {
      return await AvatarService.uploadAvatarGrpc(uri);
    } catch (error) {
      console.error('Error uploading avatar via gRPC:', error);
      return false;
    }
  },

  /**
   * Delete avatar from server via gRPC
   */
  async deleteAvatarGrpc(): Promise<boolean> {
    try {
      return await AvatarService.deleteAvatarGrpc();
    } catch (error) {
      console.error('Error deleting avatar via gRPC:', error);
      return false;
    }
  }
};
