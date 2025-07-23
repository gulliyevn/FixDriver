import { useState, useEffect } from 'react';
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
      
      // Имитация асинхронной загрузки
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Получаем актуальные данные из моков
      const user = mockUsers[0];
      
      const userProfile: UserProfile = {
        id: user.id,
        name: user.name,
        surname: user.surname,
        phone: user.phone,
        email: user.email,
        birthDate: '1990-01-01', // Можно добавить в моки
        rating: user.rating,
        address: user.address,
        createdAt: user.createdAt,
        role: user.role,
        avatar: user.avatar,
      };
      
      setProfile(userProfile);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Не удалось загрузить профиль');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updatedData: Partial<UserProfile>) => {
    try {
      setLoading(true);
      setError(null);
      
      // Имитация асинхронного обновления
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Обновляем данные в моках
      const user = mockUsers[0];
      if (updatedData.name) user.name = updatedData.name;
      if (updatedData.surname) user.surname = updatedData.surname;
      if (updatedData.phone) user.phone = updatedData.phone;
      if (updatedData.email) user.email = updatedData.email;
      
      // Обновляем локальное состояние
      if (profile) {
        setProfile({
          ...profile,
          ...updatedData
        });
      }
      
      return true;
    } catch (err) {
      setError('Не удалось обновить профиль');
      console.error('Error updating profile:', err);
      return false;
    } finally {
      setLoading(false);
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
