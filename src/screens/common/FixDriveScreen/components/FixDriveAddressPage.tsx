import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { getCurrentColors } from '../../../../constants/colors';
import FixDriveDropdown from '../../../../components/FixDriveDropdown';
import FixDriveMapInput from '../../../../components/FixDriveMapInput';
import { useFixDriveFamilyMembers } from '../../../../hooks/useFixDriveFamilyMembers';
import { fixdriveOrderService } from '../../../../services/fixdriveOrderService';
import { AddressData } from '../types/fix-drive.types';

interface FixDriveAddressPageProps {
  onNext: (data: AddressData) => void;
  initialData?: AddressData;
}

const FixDriveAddressPage: React.FC<FixDriveAddressPageProps> = ({ onNext, initialData }) => {
  const { isDark } = useTheme();
  const colors = getCurrentColors(isDark);
  const { t } = useLanguage();
  
  const { getFamilyMemberOptions, getFamilyMemberById, loading } = useFixDriveFamilyMembers();
  
  const [selectedFamilyMember, setSelectedFamilyMember] = useState<string>(initialData?.familyMemberId || '');
  const [selectedPackage, setSelectedPackage] = useState<string>(initialData?.packageType || '');
  const [addresses, setAddresses] = useState<any[]>(initialData?.addresses || []);
  const [isSaving, setIsSaving] = useState(false);

  // Загружаем данные из сессии при инициализации и при изменении initialData
  useEffect(() => {
    const loadSessionData = async () => {
      try {
        const sessionData = await fixdriveOrderService.loadSessionData();
        console.log('Session data loaded:', sessionData); // Добавляем лог для отладки
        if (sessionData?.addressData) {
          const { addressData } = sessionData;
          setSelectedFamilyMember(addressData.familyMemberId || '');
          setSelectedPackage(addressData.packageType || '');
          setAddresses(addressData.addresses || []);
          console.log('Addresses restored:', addressData.addresses); // Добавляем лог для отладки
        }
      } catch (error) {
      }
    };
    loadSessionData();
  }, [initialData]); // Добавляем зависимость от initialData

  const familyMemberOptions = getFamilyMemberOptions();
  const packageOptions = [
    { key: 'standard', label: t('premium.packages.standard'), value: 'standard' },
    { key: 'plus', label: t('premium.packages.plus'), value: 'plus' },
    { key: 'premium', label: t('premium.packages.premium'), value: 'premium' },
  ];

  const handleFamilyMemberSelect = (value: string) => {
    setSelectedFamilyMember(value);
    // Сохраняем в сессию при изменении участника семьи
    saveToSession(addresses);
  };

  const handlePackageSelect = (value: string) => {
    setSelectedPackage(value);
    // Сохраняем в сессию при изменении пакета
    saveToSession(addresses);
  };

  const handleAddressesChange = (newAddresses: any[]) => {
    console.log('Addresses changed:', newAddresses); // Добавляем лог для отладки
    setAddresses(newAddresses);
    // Сохраняем адреса в сессию при каждом изменении
    saveToSession(newAddresses);
  };

  const saveToSession = async (newAddresses: any[]) => {
    try {
      const selectedMember = getFamilyMemberById(selectedFamilyMember);
      const familyMemberName = selectedMember ? `${selectedMember.name} ${selectedMember.surname}` : '';

      // Сначала загружаем существующие данные сессии
      const existingSession = await fixdriveOrderService.loadSessionData();
      
      const sessionData = {
        ...existingSession, // Сохраняем существующие данные
        currentPage: 'addresses',
        addressData: {
          familyMemberId: selectedFamilyMember,
          familyMemberName,
          packageType: selectedPackage,
          addresses: newAddresses.map(addr => ({
            id: addr.id,
            type: addr.type,
            address: addr.address,
            coordinates: addr.coordinate,
          })),
        },
      };
      await fixdriveOrderService.saveSessionData(sessionData);
      console.log('Session saved:', sessionData); // Добавляем лог для отладки
    } catch (error) {
    }
  };

  const handleSaveAndNext = async () => {
    try {
      setIsSaving(true);

      const selectedMember = getFamilyMemberById(selectedFamilyMember);
      const familyMemberName = selectedMember ? `${selectedMember.name} ${selectedMember.surname}` : '';

      const addressData: AddressData = {
        familyMemberId: selectedFamilyMember,
        familyMemberName,
        packageType: selectedPackage,
        addresses: addresses.map(addr => ({
          id: addr.id,
          type: addr.type,
          address: addr.address,
          coordinates: addr.coordinate || addr.coordinates, // Используем оба формата
        })),
      };

      // Валидируем данные
      const validation = fixdriveOrderService.validateOrderData(addressData);
      if (!validation.isValid) {
        Alert.alert(
          'Ошибка валидации',
          validation.errors.join('\n'),
          [{ text: 'OK' }]
        );
        return;
      }

      // Сохраняем данные в заказ (финальное сохранение)
      await fixdriveOrderService.saveOrderData(addressData);

      // Переходим к следующей странице
      onNext(addressData);

    } catch (error) {
      Alert.alert(
        'Ошибка',
        'Не удалось сохранить данные заказа. Попробуйте еще раз.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={{ marginTop: 10 }}>
      {/* Выбор участника семьи */}
      {loading ? (
        <Text style={{ color: colors.primary, textAlign: 'center', marginBottom: 16 }}>
          Загрузка участников семьи...
        </Text>
      ) : (
        <FixDriveDropdown
          label={t('common.fixDrive.selectFamilyMember')}
          placeholder={t('common.fixDrive.familyMemberPlaceholder')}
          options={familyMemberOptions}
          selectedValue={selectedFamilyMember}
          onSelect={handleFamilyMemberSelect}
        />
      )}

      {/* Выбор пакета */}
      <FixDriveDropdown
        label={t('common.fixDrive.selectPackage')}
        placeholder={t('common.fixDrive.packagePlaceholder')}
        options={packageOptions}
        selectedValue={selectedPackage}
        onSelect={handlePackageSelect}
      />

      {/* Ввод адреса через карту */}
      <FixDriveMapInput 
        onAddressesChange={handleAddressesChange}
        initialAddresses={addresses}
      />
      
      {/* Кнопка Сохранить и Продолжить */}
      <TouchableOpacity 
        style={{ 
          backgroundColor: isSaving ? colors.textSecondary : colors.primary,
          paddingVertical: 12,
          marginHorizontal: 20,
          marginTop: 8,
          marginBottom: 20,
          borderRadius: 8,
          opacity: isSaving ? 0.7 : 1,
        }}
        onPress={handleSaveAndNext}
        disabled={isSaving}
      >
        <Text style={{ 
          color: '#FFFFFF', 
          fontSize: 16, 
          fontWeight: '600',
          textAlign: 'center'
        }}>
          {isSaving ? 'Сохранение...' : t('common.save')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FixDriveAddressPage;
