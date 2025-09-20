import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import MockServices from '../../shared/mocks/MockServices';

// 📋 Types
interface Child {
  id: string;
  name: string;
  age: number;
  relationship: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'cash' | 'wallet';
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  isDefault: boolean;
}

interface ClientProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'client';
  avatar: string;
  isVerified: boolean;
  children?: Child[];
  paymentMethods?: PaymentMethod[];
  createdAt: string;
  updatedAt: string;
}

interface DriverProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'driver';
  avatar: string;
  isVerified: boolean;
  licenseNumber?: string;
  vehicleNumber?: string;
  licenseExpiry?: string;
  createdAt: string;
  updatedAt: string;
}

type Profile = ClientProfile | DriverProfile;

interface ProfileContextType {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (updates: Partial<Profile>) => Promise<boolean>;
  addChild: (child: Omit<Child, 'id'>) => Promise<boolean>;
  removeChild: (childId: string) => Promise<boolean>;
  addPaymentMethod: (paymentMethod: Omit<PaymentMethod, 'id'>) => Promise<boolean>;
  removePaymentMethod: (paymentMethodId: string) => Promise<boolean>;
  loadProfile: () => Promise<void>;
  clearError: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load profile when user changes
  useEffect(() => {
    console.log('🔄 ProfileContext useEffect triggered, user:', user?.id || 'null');
    if (user && user.id) {
      loadProfile();
    } else {
      console.log('❌ No user or user ID, clearing profile');
      setProfile(null);
      setError(null);
      setIsLoading(false);
    }
  }, [user]);

  const loadProfile = async (): Promise<void> => {
    try {
      console.log('🔄 ProfileContext.loadProfile() called');
      setIsLoading(true);
      setError(null);
      
      // Check if user exists and has valid ID
      if (!user || !user.id) {
        console.log('❌ No user or user ID, skipping profile load');
        setProfile(null);
        return;
      }
      
      console.log('👤 Loading profile for user:', user.id, user.email);
      const userProfile = await MockServices.profile.getProfile(user.id);
      console.log('✅ Profile loaded successfully:', userProfile?.id);
      setProfile(userProfile);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
      setError(errorMessage);
      console.error('❌ Error loading profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<boolean> => {
    try {
      setError(null);
      
      if (!profile) return false;
      
      const updatedProfile = await MockServices.profile.updateProfile(user?.id || '', updates);
      setProfile(updatedProfile);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      console.error('Error updating profile:', err);
      return false;
    }
  };

  const addChild = async (childData: Omit<Child, 'id'>): Promise<boolean> => {
    try {
      setError(null);
      
      if (!profile || profile.role !== 'client') return false;
      
      const newChild = await MockServices.profile.addChild(user?.id || '', childData);
      const updatedProfile = await MockServices.profile.getProfile(user?.id || '');
      setProfile(updatedProfile);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add child';
      setError(errorMessage);
      console.error('Error adding child:', err);
      return false;
    }
  };

  const removeChild = async (childId: string): Promise<boolean> => {
    try {
      setError(null);
      
      if (!profile || profile.role !== 'client') return false;
      
      await MockServices.profile.removeChild(user?.id || '', childId);
      const updatedProfile = await MockServices.profile.getProfile(user?.id || '');
      setProfile(updatedProfile);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove child';
      setError(errorMessage);
      console.error('Error removing child:', err);
      return false;
    }
  };

  const addPaymentMethod = async (paymentData: Omit<PaymentMethod, 'id'>): Promise<boolean> => {
    try {
      setError(null);
      
      if (!profile || profile.role !== 'client') return false;
      
      const newPaymentMethod = await MockServices.profile.addPaymentMethod(user?.id || '', paymentData);
      const updatedProfile = await MockServices.profile.getProfile(user?.id || '');
      setProfile(updatedProfile);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add payment method';
      setError(errorMessage);
      console.error('Error adding payment method:', err);
      return false;
    }
  };

  const removePaymentMethod = async (paymentMethodId: string): Promise<boolean> => {
    try {
      setError(null);
      
      if (!profile || profile.role !== 'client') return false;
      
      await MockServices.profile.removePaymentMethod(user?.id || '', paymentMethodId);
      const updatedProfile = await MockServices.profile.getProfile(user?.id || '');
      setProfile(updatedProfile);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove payment method';
      setError(errorMessage);
      console.error('Error removing payment method:', err);
      return false;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: ProfileContextType = {
    profile,
    isLoading,
    error,
    updateProfile,
    addChild,
    removeChild,
    addPaymentMethod,
    removePaymentMethod,
    loadProfile,
    clearError,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContext;
