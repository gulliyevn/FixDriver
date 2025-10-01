import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockUsers } from '../../mocks/data/users';
import { DriverAvatarService } from '../../services/driver/DriverAvatarService';

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
      
      // Сначала пытаемся загрузить сохраненные данные
      const savedProfile = await AsyncStorage.getItem('driver_profile');
      
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        
        // Загружаем аватар из нового сервиса
        const avatar = await DriverAvatarService.getAvatar(userId);
        if (avatar?.url) {
          parsedProfile.avatar = avatar.url;
        }
        
        setProfile(parsedProfile);
        setLoading(false);
        return;
      }
      
      // Если сохраненных данных нет, загружаем из моков
      const user = mockUsers[0];
      
      // Загружаем аватар из нового сервиса
      const avatar = await DriverAvatarService.getAvatar(userId);
      const avatarUri = avatar?.url || null;
      
      const userProfile: UserProfile = {
        id: user.id,
        name: user.name,
        surname: user.surname,
        phone: user.phone,
        email: user.email,
        birthDate: '1990-01-01',
        rating: user.rating,
        address: user.address,
        createdAt: user.createdAt,
        role: user.role,
        avatar: avatarUri || user.avatar,
      };
      
      // Сохраняем начальные данные
      await AsyncStorage.setItem('driver_profile', JSON.stringify(userProfile));
      setProfile(userProfile);
    } catch (err) {
      setError('Не удалось загрузить профиль');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updatedData: Partial<UserProfile>) => {
    try {
      setError(null);
      
      // Обновляем локальное состояние
      if (profile) {
        const updatedProfile = {
          ...profile,
          ...updatedData
        };
        
        // Сохраняем в AsyncStorage
        await AsyncStorage.setItem('driver_profile', JSON.stringify(updatedProfile));
        
        // Обновляем состояние
        setProfile(updatedProfile);
        
        // Обновляем данные в моках для совместимости
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
      setError('Не удалось обновить профиль');
      return false;
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const clearProfile = async () => {
    try {
      await AsyncStorage.removeItem('driver_profile');
      await DriverAvatarService.deleteAvatar(userId);
      setProfile(null);
    } catch (err) {
      // Ошибка при очистке профиля
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
