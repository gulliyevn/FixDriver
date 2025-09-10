import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockUsers } from '../../mocks';
import { driverAvatarOperations } from '../../../domain/usecases/driver/driverAvatarOperations';
import { PROFILE_CONSTANTS } from '../../constants/profileConstants';

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

export const useDriverProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First try to load saved data
      const savedProfile = await AsyncStorage.getItem(PROFILE_CONSTANTS.STORAGE_KEYS.DRIVER_PROFILE);
      
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        
        // Load avatar from new service
        const avatarUri = await driverAvatarOperations.loadAvatar();
        if (avatarUri) {
          parsedProfile.avatar = avatarUri;
        }
        
        setProfile(parsedProfile);
        setLoading(false);
        return;
      }
      
      // If no saved data, load from mocks
      const user = mockUsers[0];
      
      // Load avatar from new service
      const avatarUri = await driverAvatarOperations.loadAvatar();
      
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
      
      // Save initial data
      await AsyncStorage.setItem(PROFILE_CONSTANTS.STORAGE_KEYS.DRIVER_PROFILE, JSON.stringify(userProfile));
      setProfile(userProfile);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updatedData: Partial<UserProfile>) => {
    try {
      setError(null);
      
      // Update local state
      if (profile) {
        const updatedProfile = {
          ...profile,
          ...updatedData
        };
        
        // Save to AsyncStorage
        await AsyncStorage.setItem(PROFILE_CONSTANTS.STORAGE_KEYS.DRIVER_PROFILE, JSON.stringify(updatedProfile));
        
        // Update state
        setProfile(updatedProfile);
        
        // Update mock data for compatibility
        const user = mockUsers[0];
        if (updatedData.name !== undefined) user.name = updatedData.name;
        if (updatedData.surname !== undefined) user.surname = updatedData.surname;
        if (updatedData.phone !== undefined) user.phone = updatedData.phone;
        if (updatedData.email !== undefined) user.email = updatedData.email;
        if (updatedData.birthDate !== undefined) user.birthDate = updatedData.birthDate;
        if (updatedData.avatar !== undefined) user.avatar = updatedData.avatar;
        
        return true;
      } else {
        return false;
      }
    } catch (err) {
      setError('Failed to update profile');
      return false;
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const clearProfile = async () => {
    try {
      await AsyncStorage.removeItem(PROFILE_CONSTANTS.STORAGE_KEYS.DRIVER_PROFILE);
      await driverAvatarOperations.deleteAvatar();
      setProfile(null);
    } catch (err) {
      // Error clearing profile
    }
  };

  return {
    profile,
    loading,
    error,
    loadProfile,
    updateProfile,
    clearProfile
  };
};
