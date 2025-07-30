import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../hooks/useI18n';
import { colors } from '../../constants/colors';
import VipPackages from '../../components/VipPackages';

interface PremiumPackagesScreenProps {
  navigation: any;
}

const PremiumPackagesScreen: React.FC<PremiumPackagesScreenProps> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const currentColors = isDark ? colors.dark : colors.light;

  const handlePackageSelect = (packageId: string, price: number) => {
    const userBalance = 50; // Мок баланса пользователя

    if (userBalance >= price) {
      const packageName = packageId === 'basic' ? t('premium.packages.plus') : 
                         packageId === 'premium' ? t('premium.packages.premium') : 
                         t('premium.packages.premiumPlus');
      
      Alert.alert(
        t('premium.purchase.confirmTitle'),
        t('premium.purchase.confirmMessage', { packageName, price: price.toString() }),
        [
          {
            text: t('premium.purchase.cancel'),
            style: 'cancel'
          },
          {
            text: t('premium.purchase.confirm'),
            onPress: () => {
              console.log(`Покупка пакета ${packageId} за ${price} AFC`);
              navigation.goBack();
            }
          }
        ]
      );
    } else {
      Alert.alert(
        t('premium.purchase.insufficientFunds'),
        t('premium.purchase.insufficientMessage', { price: price.toString(), balance: userBalance.toString() }),
        [
          {
            text: t('premium.purchase.cancel'),
            style: 'cancel'
          },
          {
            text: t('premium.purchase.topUpBalance'),
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
          {t('premium.title')}
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