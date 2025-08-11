import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Client, Child, PaymentMethod } from '../types/user';

interface ProfileContextType {
  profile: User | null;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  addChild: (child: Omit<Child, 'id'>) => Promise<boolean>;
  removeChild: (childId: string) => Promise<boolean>;
  addPaymentMethod: (paymentMethod: Omit<PaymentMethod, 'id'>) => Promise<boolean>;
  removePaymentMethod: (paymentMethodId: string) => Promise<boolean>;
  loading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

interface ProfileProviderProps {
  children: React.ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profileData = await AsyncStorage.getItem('profile');
      if (profileData) {
        setProfile(JSON.parse(profileData));
      }
    } catch (error) {
      console.warn('Profile load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (newProfile: User) => {
    try {
      await AsyncStorage.setItem('profile', JSON.stringify(newProfile));
      setProfile(newProfile);
      return true;
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
    const newChild: Child = {
      id: Date.now().toString(),
      ...childData,
    };
    
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
    const newPaymentMethod: PaymentMethod = {
      id: Date.now().toString(),
      ...paymentData,
    };
    
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

  const value = {
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
