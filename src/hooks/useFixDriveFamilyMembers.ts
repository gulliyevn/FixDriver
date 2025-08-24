import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFamilyMembersByClientId } from '../mocks/familyMembers';
import { FamilyMember } from '../types/family';
import { useAuth } from '../context/AuthContext';
import { useProfile } from './useProfile';
import { useFocusEffect } from '@react-navigation/native';

export const useFixDriveFamilyMembers = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFamilyMembers = async () => {
      try {
        setLoading(true);
        
        // Загружаем данные напрямую из AsyncStorage
        const savedMembers = await AsyncStorage.getItem('family_members');
        console.log('FixDrive - loading from AsyncStorage:', savedMembers);
        
        let members: FamilyMember[] = [];
        
        if (savedMembers) {
          members = JSON.parse(savedMembers);
          console.log('FixDrive - parsed members from AsyncStorage:', members);
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
        
        console.log('FixDrive - account owner:', accountOwner);
        console.log('FixDrive - members from AsyncStorage:', members);
        console.log('FixDrive - members length:', members.length);
        
        // Если есть добавленные участники семьи, добавляем владельца к ним
        // Если нет - показываем только владельца
        const allMembers = members.length > 0 
          ? [accountOwner, ...members] 
          : [accountOwner];
        
        console.log('FixDrive - all members (including owner):', allMembers);
        console.log('FixDrive - final familyMembers state:', allMembers);
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

  // Автоматически обновляем данные при фокусе на экране
  useFocusEffect(
    React.useCallback(() => {
      const loadFamilyMembers = async () => {
        try {
          setLoading(true);
          
          // Загружаем данные напрямую из AsyncStorage
          const savedMembers = await AsyncStorage.getItem('family_members');
          console.log('FixDrive - focus effect loading from AsyncStorage:', savedMembers);
          
          let members: FamilyMember[] = [];
          
          if (savedMembers) {
            members = JSON.parse(savedMembers);
            console.log('FixDrive - focus effect parsed members:', members);
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
          
          console.log('FixDrive - focus effect all members:', allMembers);
          setFamilyMembers(allMembers);
        } catch (error) {
          console.error('Error loading family members on focus:', error);
        } finally {
          setLoading(false);
        }
      };

      loadFamilyMembers();
    }, [user?.id, profile])
  );

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
      console.log('FixDrive - refreshing from AsyncStorage:', savedMembers);
      
      if (savedMembers) {
        const parsedMembers = JSON.parse(savedMembers);
        console.log('FixDrive - parsed members from AsyncStorage:', parsedMembers);
        
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
        
        console.log('FixDrive - refreshed all members:', allMembers);
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
