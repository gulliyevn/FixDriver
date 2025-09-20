import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../../../../../core/context/AuthContext';
// import { useProfile } from '../../../../../../shared/hooks/useProfile';

// Временные типы до создания в shared/types
interface FamilyMember {
  id: string;
  name: string;
  surname: string;
  type: 'account_owner' | 'family_member';
  birthDate: string;
  age: number;
  phone?: string;
  phoneVerified: boolean;
}

export const useFixDriveFamilyMembers = () => {
  const { user } = useAuth();
  // const { profile } = useProfile();
  const profile = null; // Временно отключено
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFamilyMembers = async () => {
      try {
        setLoading(true);
        
        // Загружаем данные напрямую из AsyncStorage
        const savedMembers = await AsyncStorage.getItem('family_members');
        
        let members: FamilyMember[] = [];
        
        if (savedMembers) {
          members = JSON.parse(savedMembers);
        }
        
        // Создаем владельца аккаунта как участника семьи
        const accountOwner: FamilyMember = {
          id: 'account-owner',
          name: profile?.name || user?.name || 'Пользователь',
          surname: profile?.surname || user?.surname || '',
          type: 'account_owner',
          birthDate: profile?.birthDate || '1990-01-01',
          age: profile?.age || 30,
          phone: profile?.phone || user?.phone,
          phoneVerified: profile?.phoneVerified || false
        };
        
        // Если есть добавленные участники семьи, добавляем владельца к ним
        // Если нет - показываем только владельца
        const allMembers = members.length > 0 
          ? [accountOwner, ...members] 
          : [accountOwner];
        setFamilyMembers(allMembers);
      } catch (error) {
        console.error('Error loading family members for FixDrive:', error);
        setFamilyMembers([]);
      } finally {
        setLoading(false);
      }
    };

    loadFamilyMembers();
  }, [user?.id, profile]);

  // Функция для получения опций для dropdown
  const getFamilyMemberOptions = () => {
    return familyMembers.map(member => ({
      key: member.id,
      label: `${member.name} ${member.surname}`,
      value: member.id,
      member: member
    }));
  };

  // Функция для получения участника по ID
  const getFamilyMemberById = (id: string) => {
    return familyMembers.find(member => member.id === id);
  };

  // Функция для принудительного обновления данных из AsyncStorage
  const refreshFamilyMembers = async () => {
    try {
      const savedMembers = await AsyncStorage.getItem('family_members');
      
      if (savedMembers) {
        const parsedMembers = JSON.parse(savedMembers);
        
        // Создаем владельца аккаунта
        const accountOwner: FamilyMember = {
          id: 'account-owner',
          name: profile?.name || user?.name || 'Пользователь',
          surname: profile?.surname || user?.surname || '',
          type: 'account_owner',
          birthDate: profile?.birthDate || '1990-01-01',
          age: profile?.age || 30,
          phone: profile?.phone || user?.phone,
          phoneVerified: profile?.phoneVerified || false
        };
        
        const allMembers = parsedMembers.length > 0 
          ? [accountOwner, ...parsedMembers] 
          : [accountOwner];
        
        setFamilyMembers(allMembers);
      }
    } catch (error) {
      console.error('Error refreshing family members:', error);
    }
  };

  return {
    familyMembers,
    loading,
    getFamilyMemberOptions,
    getFamilyMemberById,
    refreshFamilyMembers
  };
};
