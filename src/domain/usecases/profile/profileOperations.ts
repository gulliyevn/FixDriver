import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockUsers } from '../../../shared/mocks';
import { avatarOperations } from '../avatar/avatarOperations';
import { getUserStorageKey, STORAGE_KEYS } from '../../../shared/utils/storageKeys';
import { PROFILE_CONSTANTS } from '../../../shared/constants/profileConstants';

export interface UserProfile {
  id: string;
  name: string;
  surname: string;
  phone: string;
  email: string;
  birthDate: string;
  rating: number;
  address: string;
  createdAt: string;
  role: string;
  avatar?: string;
}

/**
 * Domain usecase for profile operations
 * Abstracts data layer access from presentation layer
 */
export const profileOperations = {
  /**
   * Get profile storage key
   */
  getProfileStorageKey(): string {
    return getUserStorageKey(STORAGE_KEYS.USER_PROFILE);
  },

  /**
   * Load profile from storage
   */
  async loadProfileFromStorage(): Promise<UserProfile | null> {
    try {
      const profileKey = this.getProfileStorageKey();
      const savedProfile = await AsyncStorage.getItem(profileKey);
      
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        
        // Load avatar from avatar service
        const avatarUri = await avatarOperations.loadAvatar();
        if (avatarUri) {
          parsedProfile.avatar = avatarUri;
        }
        
        return parsedProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Error loading profile from storage:', error);
      return null;
    }
  },

  /**
   * Create initial profile from mock data
   */
  async createInitialProfile(): Promise<UserProfile> {
    try {
      const user = mockUsers[0];
      
      // Load avatar from avatar service
      const avatarUri = await avatarOperations.loadAvatar();
      
      const userProfile: UserProfile = {
        id: user.id,
        name: user.name,
        surname: user.surname,
        phone: user.phone,
        email: user.email,
        birthDate: PROFILE_CONSTANTS.DEFAULTS.BIRTH_DATE,
        rating: user.rating,
        address: user.address,
        createdAt: user.createdAt,
        role: user.role,
        avatar: avatarUri || user.avatar,
      };
      
      return userProfile;
    } catch (error) {
      console.error('Error creating initial profile:', error);
      throw error;
    }
  },

  /**
   * Save profile to storage
   */
  async saveProfileToStorage(profile: UserProfile): Promise<void> {
    try {
      const profileKey = this.getProfileStorageKey();
      await AsyncStorage.setItem(profileKey, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving profile to storage:', error);
      throw error;
    }
  },

  /**
   * Update profile
   */
  async updateProfile(currentProfile: UserProfile, updatedData: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const updatedProfile = {
        ...currentProfile,
        ...updatedData
      };
      
      // Save to AsyncStorage
      await this.saveProfileToStorage(updatedProfile);
      
      // Update mock data for compatibility
      const user = mockUsers[0];
      if (updatedData.name !== undefined) user.name = updatedData.name;
      if (updatedData.surname !== undefined) user.surname = updatedData.surname;
      if (updatedData.phone !== undefined) user.phone = updatedData.phone;
      if (updatedData.email !== undefined) user.email = updatedData.email;
      if (updatedData.birthDate !== undefined) user.birthDate = updatedData.birthDate;
      if (updatedData.avatar !== undefined) user.avatar = updatedData.avatar;
      
      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  /**
   * Clear profile
   */
  async clearProfile(): Promise<void> {
    try {
      const profileKey = this.getProfileStorageKey();
      await AsyncStorage.removeItem(profileKey);
      await avatarOperations.deleteAvatar();
    } catch (error) {
      console.error('Error clearing profile:', error);
      throw error;
    }
  }
};
