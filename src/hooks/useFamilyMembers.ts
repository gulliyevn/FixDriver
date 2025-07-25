import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { getDefaultDate, calculateAge } from '../utils/profileHelpers';
import { useLanguage } from '../context/LanguageContext';

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
  const { t } = useLanguage();
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
    // Также сбрасываем статус в данных члена семьи
    setFamilyMembers(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, phoneVerified: false }
        : member
    ));
  };

  const verifyFamilyPhone = useCallback((memberId: string) => {
    const member = familyMembers.find(m => m.id === memberId);
    if (!member || !member.phone) {
      Alert.alert('Ошибка', 'Номер телефона не указан');
      return;
    }

    const title = t('profile.verifyPhone.title');
    const message = t('profile.verifyPhone.message');
    const cancelText = t('common.cancel');
    const verifyText = t('common.verify');
    const successTitle = t('profile.verifyPhone.success.title');
    const successMessage = t('profile.verifyPhone.success.message');
    const errorTitle = t('profile.verifyPhone.error.title');
    const errorMessage = t('profile.verifyPhone.error.message');

    Alert.prompt(
      title,
      message,
      [
        { text: cancelText, style: 'cancel' },
        {
          text: verifyText,
          onPress: async (code) => {
            if (code === '1234') {
              setFamilyPhoneVerifying(prev => ({ ...prev, [memberId]: true }));
              setTimeout(() => {
                setFamilyPhoneVerification(prev => ({ ...prev, [memberId]: true }));
                setFamilyPhoneVerifying(prev => ({ ...prev, [memberId]: false }));
                // Обновляем статус в данных члена семьи
                setFamilyMembers(prev => prev.map(member => 
                  member.id === memberId 
                    ? { ...member, phoneVerified: true }
                    : member
                ));
                Alert.alert(successTitle, successMessage);
              }, 1000);
            } else {
              Alert.alert(errorTitle, errorMessage);
            }
          }
        }
      ],
      'plain-text'
    );
  }, [familyMembers, t]);

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