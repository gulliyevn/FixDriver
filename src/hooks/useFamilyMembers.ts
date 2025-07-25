import { useState } from 'react';
import { Alert } from 'react-native';
import { getDefaultDate, calculateAge } from '../utils/profileHelpers';

interface FamilyMember {
  id: string;
  name: string;
  surname: string;
  type: string;
  birthDate: string;
  age: number;
  phone?: string;
  phoneVerified?: boolean;
}

interface NewFamilyMember {
  name: string;
  surname: string;
  type: string;
  age: string;
  phone: string;
}

export const useFamilyMembers = () => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { 
      id: '1', 
      name: 'Анна', 
      surname: 'Петрова',
      type: 'child', 
      birthDate: '2015-03-15',
      age: 8,
      phone: '+7 999 123-45-67',
      phoneVerified: true
    },
    { 
      id: '2', 
      name: 'Михаил', 
      surname: 'Петров',
      type: 'spouse', 
      birthDate: '1988-07-22',
      age: 35,
      phone: '+7 999 987-65-43',
      phoneVerified: false
    },
  ]);

  const [expandedFamilyMember, setExpandedFamilyMember] = useState<string | null>(null);
  const [editingFamilyMember, setEditingFamilyMember] = useState<string | null>(null);
  const [showAddFamilyModal, setShowAddFamilyModal] = useState(false);
  const [familyPhoneVerification, setFamilyPhoneVerification] = useState<{[key: string]: boolean}>({});
  const [familyPhoneVerifying, setFamilyPhoneVerifying] = useState<{[key: string]: boolean}>({});
  
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
    // Проверяем, что обязательные поля заполнены
    if (!newFamilyMember.name.trim() || !newFamilyMember.surname.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните имя и фамилию');
      return;
    }

    // Создаем нового члена семьи
    const newMember: FamilyMember = {
      id: Date.now().toString(), // Простой способ генерации ID
      name: newFamilyMember.name,
      surname: newFamilyMember.surname,
      type: newFamilyMember.type,
      birthDate: newFamilyMember.age,
      age: calculateAge(newFamilyMember.age), // Точный расчет возраста
      phone: newFamilyMember.phone.trim() || undefined,
      phoneVerified: false,
    };

    // Добавляем в список
    setFamilyMembers(prev => [...prev, newMember]);
    
    // Закрываем модальное окно
    closeAddFamilyModal();
    
    Alert.alert(
      'Успешно',
      'Член семьи добавлен',
      [{ text: 'OK' }]
    );
  };

  const startEditingFamilyMember = (memberId: string) => {
    setEditingFamilyMember(memberId);
  };

  const cancelEditingFamilyMember = () => {
    setEditingFamilyMember(null);
  };

  const saveFamilyMember = (memberId: string, updatedData: Partial<FamilyMember>) => {
    setFamilyMembers(prev => prev.map(member => 
      member.id === memberId ? { ...member, ...updatedData } : member
    ));
    setEditingFamilyMember(null);
  };

  const deleteFamilyMember = (memberId: string) => {
    setFamilyMembers(prev => prev.filter(member => member.id !== memberId));
    setExpandedFamilyMember(null);
    setEditingFamilyMember(null);
  };

  const resetFamilyPhoneVerification = (memberId: string) => {
    setFamilyPhoneVerification(prev => ({ ...prev, [memberId]: false }));
  };

  const verifyFamilyPhone = (memberId: string) => {
    setFamilyPhoneVerifying(prev => ({ ...prev, [memberId]: true }));
    
    // Имитация API вызова
    setTimeout(() => {
      setFamilyPhoneVerification(prev => ({ ...prev, [memberId]: true }));
      setFamilyPhoneVerifying(prev => ({ ...prev, [memberId]: false }));
    }, 2000);
  };

  return {
    familyMembers,
    expandedFamilyMember,
    editingFamilyMember,
    showAddFamilyModal,
    newFamilyMember,
    setNewFamilyMember,
    familyPhoneVerification,
    familyPhoneVerifying,
    toggleFamilyMember,
    openAddFamilyModal,
    closeAddFamilyModal,
    addFamilyMember,
    startEditingFamilyMember,
    cancelEditingFamilyMember,
    saveFamilyMember,
    deleteFamilyMember,
    verifyFamilyPhone,
    resetFamilyPhoneVerification,
  };
}; 