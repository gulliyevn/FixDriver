import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockUsers } from '../mocks/users';

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

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      // Сначала пытаемся загрузить сохраненные данные
      const savedProfile = await AsyncStorage.getItem('user_profile');
      
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile(parsedProfile);
        setLoading(false);
        return;
      }
      
      // Если сохраненных данных нет, загружаем из моков
      const user = mockUsers[0];
      
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
        avatar: user.avatar,
      };
      
      // Сохраняем начальные данные
      await AsyncStorage.setItem('user_profile', JSON.stringify(userProfile));
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
        await AsyncStorage.setItem('user_profile', JSON.stringify(updatedProfile));
        
        // Обновляем состояние
        setProfile(updatedProfile);
        
        // Обновляем данные в моках для совместимости
        const user = mockUsers[0];
        if (updatedData.name) user.name = updatedData.name;
        if (updatedData.surname) user.surname = updatedData.surname;
        if (updatedData.phone) user.phone = updatedData.phone;
        if (updatedData.email) user.email = updatedData.email;
        if (updatedData.birthDate) user.birthDate = updatedData.birthDate;
        if (updatedData.avatar) user.avatar = updatedData.avatar;
      } else {
        // Профиль не загружен, не могу обновить
      }
      
      return true;
    } catch (err) {
      setError('Не удалось обновить профиль');
      return false;
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    loadProfile,
    updateProfile
  };
};
