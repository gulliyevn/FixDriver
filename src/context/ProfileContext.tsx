import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Client, Child, PaymentMethod } from '../types/user';
import { ProfileService } from '../services/ProfileService';
import { useAuth } from './AuthContext';

interface ProfileContextType {
  profile: User | null;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  addChild: (child: Omit<Child, 'id'>) => Promise<boolean>;
  removeChild: (childId: string) => Promise<boolean>;
  addPaymentMethod: (paymentMethod: Omit<PaymentMethod, 'id'>) => Promise<boolean>;
  removePaymentMethod: (paymentMethodId: string) => Promise<boolean>;
  loading: boolean;
  loadProfile: () => Promise<void>;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    console.error('useProfile must be used within a ProfileProvider'); return;
  }
  return context;
};

interface ProfileProviderProps {
  children: React.ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Загружаем профиль при изменении пользователя
  useEffect(() => {
    if (user) {
      loadProfile(user.id);
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const loadProfile = async (userId: string) => {
    try {
      setLoading(true);
      
      // Используем ProfileService (поддерживает DEV/PROD)
      const loadedProfile = await ProfileService.getProfile(userId);
      
      if (loadedProfile) {
        // Normalize/merge with current auth user to fill missing fields
        const normalized: User = {
          id: loadedProfile.id || user?.id || '',
          email: loadedProfile.email || user?.email || '',
          name: (loadedProfile as any).name || (user as any)?.name || (user as any)?.firstName || '',
          surname: (loadedProfile as any).surname || (user as any)?.surname || (user as any)?.lastName || '',
          role: loadedProfile.role || user?.role || 'client',
          phone: loadedProfile.phone || user?.phone || '',
          avatar: loadedProfile.avatar ?? null,
          rating: loadedProfile.rating ?? 5,
          address: loadedProfile.address || '',
          createdAt: loadedProfile.createdAt || user?.createdAt || new Date().toISOString(),
          birthDate: loadedProfile.birthDate || user?.birthDate,
        } as User;

        // If we filled any missing fields, persist back
        const changed = JSON.stringify(loadedProfile) !== JSON.stringify(normalized);
        if (changed) {
          await AsyncStorage.setItem(`@profile_${userId}`, JSON.stringify(normalized));
        }

        setProfile(normalized);
      } else {
        // Если профиль не найден, создаем из данных user
        if (user) {
          const newProfile: User = {
            ...user,
            createdAt: user.createdAt || new Date().toISOString(),
          };
          
          // Сохраняем профиль напрямую в AsyncStorage
          await AsyncStorage.setItem(`@profile_${userId}`, JSON.stringify(newProfile));
          setProfile(newProfile);
          
        }
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  // Публичный метод для загрузки профиля текущего пользователя
  const loadProfilePublic = async (): Promise<void> => {
    if (user?.id) {
      await loadProfile(user.id);
    }
  };

  const saveProfile = async (newProfile: User) => {
    try {
      await AsyncStorage.setItem('profile', JSON.stringify(newProfile));
      setProfile(newProfile);
      return true;
    } catch (error) {
      return false;
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!profile || !user) return false;
    
    try {
      
      // Используем ProfileService (поддерживает DEV/PROD)
      const result = await ProfileService.updateProfile(user.id, updates);
      
      if (result.success && result.profile) {
        setProfile(result.profile);
        return true;
      }
      
      return false;
    } catch (error) {
      return false;
    }
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
    loadProfile: loadProfilePublic,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};
