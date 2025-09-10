import { useState, useEffect, useCallback } from 'react';
import { profileOperations, UserProfile } from '../../domain/usecases/profile/profileOperations';
import { PROFILE_CONSTANTS } from '../constants/profileConstants';

/**
 * Hook for managing user profile
 * Provides comprehensive profile management functionality
 */
export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load profile
   */
  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First try to load saved data
      const savedProfile = await profileOperations.loadProfileFromStorage();
      
      if (savedProfile) {
        setProfile(savedProfile);
        setLoading(false);
        return;
      }
      
      // If no saved data, create initial profile from mock data
      const userProfile = await profileOperations.createInitialProfile();
      
      // Save initial data
      await profileOperations.saveProfileToStorage(userProfile);
      setProfile(userProfile);
    } catch (err) {
      setError(PROFILE_CONSTANTS.ERROR_MESSAGES.LOAD_FAILED);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update profile
   */
  const updateProfile = useCallback(async (updatedData: Partial<UserProfile>) => {
    try {
      setError(null);
      
      if (profile) {
        const updatedProfile = await profileOperations.updateProfile(profile, updatedData);
        setProfile(updatedProfile);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      setError(PROFILE_CONSTANTS.ERROR_MESSAGES.UPDATE_FAILED);
      return false;
    }
  }, [profile]);

  /**
   * Clear profile
   */
  const clearProfile = useCallback(async () => {
    try {
      await profileOperations.clearProfile();
      setProfile(null);
    } catch (err) {
      // Error clearing profile
    }
  }, []);

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    loading,
    error,
    loadProfile,
    updateProfile,
    clearProfile
  };
};