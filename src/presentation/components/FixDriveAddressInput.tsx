import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { getCurrentColors } from '../constants/colors';
import { createFixDriveAddressInputStyles } from '../styles/components/FixDriveAddressInput.styles';

interface AddressPoint {
  id: string;
  type: 'from' | 'to' | 'stop';
  address: string;
  placeholder: string;
}

interface FixDriveAddressInputProps {
  onAddressesChange: (addresses: AddressPoint[]) => void;
}

const FixDriveAddressInput: React.FC<FixDriveAddressInputProps> = ({
  onAddressesChange,
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const colors = getCurrentColors(isDark);
  const styles = createFixDriveAddressInputStyles(isDark);

  const [addresses, setAddresses] = useState<AddressPoint[]>([
    {
      id: 'from',
      type: 'from',
      address: '',
      placeholder: t('common.fixDrive.address.fromPlaceholder')
    },
    {
      id: 'to',
      type: 'to',
      address: '',
      placeholder: t('common.fixDrive.address.toPlaceholder')
    }
  ]);

  const handleAddressChange = (id: string, text: string) => {
    const updatedAddresses = addresses.map(addr => 
      addr.id === id ? { ...addr, address: text } : addr
    );
    setAddresses(updatedAddresses);
    onAddressesChange(updatedAddresses);
  };

  const addStop = () => {
    const currentStops = addresses.filter(addr => addr.type === 'stop');
    if (currentStops.length >= 2) {
      return; // Максимум 2 остановки
    }
    
    const stopId = `stop-${Date.now()}`;
    const newStop: AddressPoint = {
      id: stopId,
      type: 'stop',
      address: '',
      placeholder: t('common.fixDrive.address.stopPlaceholder')
    };
    // Вставляем остановку между "Откуда" и "Куда"
    const fromAddress = addresses.find(addr => addr.type === 'from');
    const toAddress = addresses.find(addr => addr.type === 'to');
    
    if (fromAddress && toAddress) {
      const updatedAddresses = [
        fromAddress,
        newStop,
        ...addresses.filter(addr => addr.type === 'stop'),
        toAddress
      ];
      setAddresses(updatedAddresses);
      onAddressesChange(updatedAddresses);
    }
  };

  const removeStop = (id: string) => {
    const updatedAddresses = addresses.filter(addr => addr.id !== id);
    setAddresses(updatedAddresses);
    onAddressesChange(updatedAddresses);
  };



  const selectFromMap = (id: string) => {
    // Здесь будет логика выбора адреса из карты
    console.log('Select from map for:', id);
  };

  const getAddressIcon = (type: 'from' | 'to' | 'stop') => {
    switch (type) {
      case 'from':
        return { name: 'ellipse' as const, color: '#4CAF50' };
      case 'to':
        return { name: 'ellipse' as const, color: '#9CA3AF' };
      case 'stop':
        return { name: 'ellipse' as const, color: '#3B82F6' };
    }
  };

  const getAddressLabel = (type: 'from' | 'to' | 'stop') => {
    switch (type) {
      case 'from':
        return t('common.fixDrive.address.from');
      case 'to':
        return t('common.fixDrive.address.to');
      case 'stop':
        return 'Остановка';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Адрес
      </Text>

      <View>
        {addresses.map((address, index) => (
          <View key={address.id} style={styles.addressContainer}>
            {/* Контейнер с полем ввода */}
            <View style={styles.addressInputContainer}>
              {/* Иконка внутри контейнера */}
              <View style={styles.iconContainer}>
                <Ionicons 
                  name={getAddressIcon(address.type).name} 
                  size={16} 
                  color={getAddressIcon(address.type).color} 
                />
              </View>

              <TextInput
                style={styles.textInput}
                placeholder={address.placeholder}
                placeholderTextColor={colors.textSecondary}
                value={address.address}
                onChangeText={(text) => handleAddressChange(address.id, text)}
              />
              


              {/* Кнопки действий внутри контейнера */}
              <View style={styles.actionsContainer}>
              </View>
            </View>

            {/* Иконка карты за пределами контейнера */}
            <TouchableOpacity 
              style={styles.mapButton}
              onPress={() => {
                if (address.type === 'to') {
                  addStop();
                } else if (address.type === 'stop') {
                  removeStop(address.id);
                } else {
                  selectFromMap(address.id);
                }
              }}
            >
              <Ionicons 
                name={address.type === 'from' ? "chevron-down" : address.type === 'to' ? "add" : "close"} 
                size={16} 
                color={
                  address.type === 'to' && addresses.filter(addr => addr.type === 'stop').length >= 2 
                    ? colors.textSecondary 
                    : colors.primary
                } 
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Дополнительный контейнер */}
      <View style={styles.additionalContainer}>
        <Text style={styles.additionalText}>
          Дополнительный контейнер
        </Text>
      </View>

    </View>
  );
};

export default FixDriveAddressInput;
