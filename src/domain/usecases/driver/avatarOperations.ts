import { DriverAvatarService } from '../../../data/datasources/driver/DriverAvatarService';

/**
 * Domain usecase for driver avatar operations
 * Abstracts data layer access from presentation layer
 */
export const driverAvatarOperations = {
  /**
   * Load avatar from storage
   */
  async loadAvatar(): Promise<string | null> {
    return DriverAvatarService.loadAvatar();
  },

  /**
   * Save avatar to storage
   */
  async saveAvatar(uri: string): Promise<boolean> {
    return DriverAvatarService.saveAvatar(uri);
  },

  /**
   * Delete avatar from storage
   */
  async deleteAvatar(): Promise<boolean> {
    return DriverAvatarService.deleteAvatar();
  },

  /**
   * Take photo using camera
   */
  async takePhoto(): Promise<string | null> {
    return DriverAvatarService.takePhoto();
  },

  /**
   * Pick photo from gallery
   */
  async pickFromGallery(): Promise<string | null> {
    return DriverAvatarService.pickFromGallery();
  },

  /**
   * Upload avatar to server
   */
  async uploadAvatarToServer(file: File) {
    return DriverAvatarService.uploadAvatarToServer(file);
  },

  /**
   * Delete avatar from server
   */
  async deleteAvatarFromServer(url: string): Promise<boolean> {
    return DriverAvatarService.deleteAvatarFromServer(url);
  }
};
