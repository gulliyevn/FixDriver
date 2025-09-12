/**
 * Profile context
 * Main profile management context
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Client, Child, PaymentMethod } from '../../../shared/types/user';
import { ProfileContextType, ProfileProviderProps } from './types';
import { loadProfileFromStorage, saveProfileToStorage, createChild, createPaymentMethod } from './utils';

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profileData = await loadProfileFromStorage();
      setProfile(profileData);
    } catch (error) {
      console.warn('Profile load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (newProfile: User) => {
    try {
      const success = await saveProfileToStorage(newProfile);
      if (success) {
        setProfile(newProfile);
      }
      return success;
    } catch (error) {
      console.warn('Profile save error:', error);
      return false;
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!profile) return false;
    
    const updatedProfile = { ...profile, ...updates };
    return await saveProfile(updatedProfile);
  };

  const addChild = async (childData: Omit<Child, 'id'>): Promise<boolean> => {
    if (!profile || profile.role !== 'client') return false;
    
    const clientProfile = profile as Client;
    const newChild = createChild(childData);
    
    const updatedChildren = [...(clientProfile.children || []), newChild];
    const updatedProfile: Client = {
      ...clientProfile,
      children: updatedChildren,
    };
    
    return await saveProfile(updatedProfile);
  };

  const removeChild = async (childId: string): Promise<boolean> => {
    if (!profile || profile.role !== 'client') return false;
    
    const clientProfile = profile as Client;
    const updatedChildren = clientProfile.children?.filter(child => child.id !== childId) || [];
    const updatedProfile: Client = {
      ...clientProfile,
      children: updatedChildren,
    };
    
    return await saveProfile(updatedProfile);
  };

  const addPaymentMethod = async (paymentData: Omit<PaymentMethod, 'id'>): Promise<boolean> => {
    if (!profile || profile.role !== 'client') return false;
    
    const clientProfile = profile as Client;
    const newPaymentMethod = createPaymentMethod(paymentData);
    
    const updatedPaymentMethods = [...(clientProfile.paymentMethods || []), newPaymentMethod];
    const updatedProfile: Client = {
      ...clientProfile,
      paymentMethods: updatedPaymentMethods,
    };
    
    return await saveProfile(updatedProfile);
  };

  const removePaymentMethod = async (paymentMethodId: string): Promise<boolean> => {
    if (!profile || profile.role !== 'client') return false;
    
    const clientProfile = profile as Client;
    const updatedPaymentMethods = clientProfile.paymentMethods?.filter(
      payment => payment.id !== paymentMethodId
    ) || [];
    const updatedProfile: Client = {
      ...clientProfile,
      paymentMethods: updatedPaymentMethods,
    };
    
    return await saveProfile(updatedProfile);
  };

  const value: ProfileContextType = {
    profile,
    updateProfile,
    addChild,
    removeChild,
    addPaymentMethod,
    removePaymentMethod,
    loading,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};
