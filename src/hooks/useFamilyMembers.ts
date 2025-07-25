import { useState } from 'react';
import { Alert } from 'react-native';
import { getDefaultDate } from '../utils/profileHelpers';

interface FamilyMember {
  id: string;
  name: string;
  type: string;
  age: number;
}

interface NewFamilyMember {
  name: string;
  surname: string;
  type: string;
  age: string;
  phone: string;
}

export const useFamilyMembers = () => {
  const [familyMembers] = useState<FamilyMember[]>([
    { id: '1', name: 'Анна Петрова', type: 'child', age: 8 },
    { id: '2', name: 'Михаил Петров', type: 'spouse', age: 35 },
  ]);

  const [expandedFamilyMember, setExpandedFamilyMember] = useState<string | null>(null);
  const [showAddFamilyModal, setShowAddFamilyModal] = useState(false);
  
  const [newFamilyMember, setNewFamilyMember] = useState<NewFamilyMember>({
    name: '',
    surname: '',
    type: 'child',
    age: getDefaultDate(),
    phone: '',
  });

  const toggleFamilyMember = (memberId: string) => {
    setExpandedFamilyMember(expandedFamilyMember === memberId ? null : memberId);
  };

  const openAddFamilyModal = () => {
    setShowAddFamilyModal(true);
  };

  const closeAddFamilyModal = () => {
    setShowAddFamilyModal(false);
    setNewFamilyMember({
      name: '',
      surname: '',
      type: 'child',
      age: getDefaultDate(),
      phone: '',
    });
  };

  const addFamilyMember = () => {
    // Здесь должна быть логика добавления в API
    console.log('Adding family member:', newFamilyMember);
    
    // В реальном приложении здесь будет API вызов
    Alert.alert(
      'Успешно',
      'Член семьи добавлен',
      [{ text: 'OK', onPress: closeAddFamilyModal }]
    );
  };

  return {
    familyMembers,
    expandedFamilyMember,
    showAddFamilyModal,
    newFamilyMember,
    setNewFamilyMember,
    toggleFamilyMember,
    openAddFamilyModal,
    closeAddFamilyModal,
    addFamilyMember,
  };
}; 