import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDefaultDate, calculateAge } from '../utils/profileHelpers';
import { useI18n } from '../hooks/useI18n';

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
  const { t } = useI18n();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Загружаем семейных членов из AsyncStorage
  const loadFamilyMembers = useCallback(async () => {
    try {
      const savedMembers = await AsyncStorage.getItem('family_members');
      if (savedMembers) {
        setFamilyMembers(JSON.parse(savedMembers));
      } else {
        // Если сохраненных данных нет, устанавливаем начальные значения
        const initialMembers: FamilyMember[] = [
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
            phone: undefined,
            phoneVerified: false
          },
        ];
        setFamilyMembers(initialMembers);
        await AsyncStorage.setItem('family_members', JSON.stringify(initialMembers));
      }
    } catch (error) {
      console.log('Error loading family members:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Сохраняем семейных членов в AsyncStorage
  const saveFamilyMembers = useCallback(async (members: FamilyMember[]) => {
    try {
      await AsyncStorage.setItem('family_members', JSON.stringify(members));
    } catch (error) {
      console.log('Error saving family members:', error);
    }
  }, []);

  // Загружаем данные при монтировании
  useEffect(() => {
    loadFamilyMembers();
  }, [loadFamilyMembers]);

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

    // Добавляем в список и сохраняем
    const updatedMembers = [...familyMembers, newMember];
    setFamilyMembers(updatedMembers);
    saveFamilyMembers(updatedMembers);
    
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
    const updatedMembers = familyMembers.map(member => 
      member.id === memberId ? { 
        ...member, 
        ...updatedData,
        // Сбрасываем верификацию телефона, если номер изменился
        phoneVerified: updatedData.phone !== member.phone ? false : member.phoneVerified
      } : member
    );
    setFamilyMembers(updatedMembers);
    saveFamilyMembers(updatedMembers);
    setEditingFamilyMember(null);
  };

  const deleteFamilyMember = (memberId: string) => {
    const updatedMembers = familyMembers.filter(member => member.id !== memberId);
    setFamilyMembers(updatedMembers);
    saveFamilyMembers(updatedMembers);
    setExpandedFamilyMember(null);
    setEditingFamilyMember(null);
  };

  const resetFamilyPhoneVerification = (memberId: string) => {
    setFamilyPhoneVerification(prev => ({ ...prev, [memberId]: false }));
    // Также сбрасываем статус в данных члена семьи
    const updatedMembers = familyMembers.map(member => 
      member.id === memberId 
        ? { ...member, phoneVerified: false }
        : member
    );
    setFamilyMembers(updatedMembers);
    saveFamilyMembers(updatedMembers);
  };

  const verifyFamilyPhone = useCallback((memberId: string) => {
    const member = familyMembers.find(m => m.id === memberId);
    if (!member || !member.phone) {
      Alert.alert('Ошибка', 'Номер телефона не указан');
      return;
    }

    const codeSentTitle = t('profile.verifyPhone.success.title');
    const codeSentMessage = t('profile.verifyPhone.success.message');
    const cancelText = t('common.cancel');
    const verifyText = t('common.verify');
    const successTitle = 'Успешно';
    const successMessage = 'Телефон успешно верифицирован';
    const errorTitle = t('profile.verifyPhone.error.title');
    const errorMessage = t('profile.verifyPhone.error.message');

    // Сначала показываем "Код отправлен"
    Alert.alert(
      codeSentTitle,
      codeSentMessage,
      [
        { text: cancelText, style: 'cancel' },
        {
          text: verifyText,
          onPress: () => {
            // Затем показываем поле ввода кода
            Alert.prompt(
              'Введите код',
              'Введите код подтверждения из SMS',
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
                        const updatedMembers = familyMembers.map(member => 
                          member.id === memberId 
                            ? { ...member, phoneVerified: true }
                            : member
                        );
                        setFamilyMembers(updatedMembers);
                        saveFamilyMembers(updatedMembers);
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
          }
        }
      ]
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
    loading,
    loadFamilyMembers,
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