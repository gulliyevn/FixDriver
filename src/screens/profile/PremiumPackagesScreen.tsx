import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { colors } from '../../constants/colors';
import VipPackages from '../../components/VipPackages';

interface PremiumPackagesScreenProps {
  navigation: any;
}

const PremiumPackagesScreen: React.FC<PremiumPackagesScreenProps> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const currentColors = isDark ? colors.dark : colors.light;

  const handlePackageSelect = (packageId: string, price: number) => {
    const userBalance = 50; // Мок баланса пользователя

    if (userBalance >= price) {
      Alert.alert(
        'Подтверждение покупки',
        `Вы уверены, что хотите приобрести план "${packageId === 'basic' ? 'Плюс' : packageId === 'premium' ? 'Премиум' : 'Премиум+'}" за ${price} AFC?\n\nС вашего баланса будет списано ${price} AFC.`,
        [
          {
            text: 'Отмена',
            style: 'cancel'
          },
          {
            text: 'Подтвердить',
            onPress: () => {
              console.log(`Покупка пакета ${packageId} за ${price} AFC`);
              navigation.goBack();
            }
          }
        ]
      );
    } else {
      Alert.alert(
        'Недостаточно средств',
        `У вас недостаточно средств для покупки этого плана.\n\nНеобходимо: ${price} AFC\nВаш баланс: ${userBalance} AFC`,
        [
          {
            text: 'Отмена',
            style: 'cancel'
          },
          {
            text: 'Пополнить баланс',
            onPress: () => {
              console.log('Переход на страницу баланса');
              navigation.goBack();
            }
          }
        ]
      );
    }
  };

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: currentColors.background 
    }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 45,
        paddingBottom: 6,
        borderBottomWidth: 1,
        borderBottomColor: currentColors.border,
        backgroundColor: currentColors.background,
      }}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={{
            padding: 8,
          }}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={currentColors.primary} 
          />
        </TouchableOpacity>
        
        <Text style={{
          fontSize: 18,
          fontWeight: '600',
          color: currentColors.text,
        }}>
          Премиум статус
        </Text>

        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        <VipPackages
          onSelectPackage={handlePackageSelect}
        />
      </View>
    </View>
  );
};

export default PremiumPackagesScreen; 