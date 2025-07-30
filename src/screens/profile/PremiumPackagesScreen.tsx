import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../hooks/useI18n';
import { colors } from '../../constants/colors';
import VipPackages from '../../components/VipPackages';
import { usePackage } from '../../context/PackageContext';

interface PremiumPackagesScreenProps {
  navigation: any;
}

const PremiumPackagesScreen: React.FC<PremiumPackagesScreenProps> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const currentColors = isDark ? colors.dark : colors.light;
  const { currentPackage, updatePackage } = usePackage();
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [selectedPackageInfo, setSelectedPackageInfo] = useState<{name: string, id: string} | null>(null);

  const handlePackageSelect = (packageId: string, price: number) => {
    const userBalance = 50; // Мок баланса пользователя

    if (userBalance >= price) {
      const packageName = packageId === 'free' ? t('premium.packages.free') :
                         packageId === 'basic' ? t('premium.packages.plus') : 
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
            onPress: async () => {
              console.log(`Покупка пакета ${packageId} за ${price} AFC`);
              await updatePackage(packageId as any);
              
              // Сохраняем информацию о выбранном пакете для модального окна
              const packageName = packageId === 'free' ? t('premium.packages.free') :
                                packageId === 'basic' ? t('premium.packages.plus') : 
                                packageId === 'premium' ? t('premium.packages.premium') : 
                                t('premium.packages.premiumPlus');
              
              setSelectedPackageInfo({ name: packageName, id: packageId });
              setSuccessModalVisible(true);
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
          currentPackage={currentPackage}
        />
      </View>

      {/* Модальное окно успешной покупки */}
      <Modal
        visible={successModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: currentColors.background,
            borderRadius: 20,
            padding: 24,
            marginHorizontal: 40,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 12,
            elevation: 8,
          }}>
            <View style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: '#10B981',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}>
              <Ionicons name="checkmark" size={32} color="#FFFFFF" />
            </View>
            
            <Text style={{
              fontSize: 20,
              fontWeight: '700',
              color: currentColors.text,
              textAlign: 'center',
              marginBottom: 8,
            }}>
              {t('premium.success.title')}
            </Text>
            
            <Text style={{
              fontSize: 16,
              color: currentColors.textSecondary,
              textAlign: 'center',
              marginBottom: 24,
              lineHeight: 22,
            }}>
              {t('premium.success.message', { packageName: selectedPackageInfo?.name || '' })}
            </Text>
            
            <TouchableOpacity
              style={{
                backgroundColor: currentColors.primary,
                paddingVertical: 12,
                paddingHorizontal: 32,
                borderRadius: 12,
                minWidth: 120,
              }}
              onPress={() => {
                setSuccessModalVisible(false);
                navigation.goBack();
              }}
              activeOpacity={0.8}
            >
              <Text style={{
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: '600',
                textAlign: 'center',
              }}>
                {t('common.ok')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PremiumPackagesScreen; 