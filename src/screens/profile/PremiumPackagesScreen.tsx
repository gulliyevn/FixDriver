import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../hooks/useI18n';
import { useLanguage } from '../../context/LanguageContext';
import { colors } from '../../constants/colors';
import VipPackages from '../../components/VipPackages';
import { usePackage, PackageType } from '../../context/PackageContext';
import { useBalance } from '../../context/BalanceContext';
import { PremiumPackagesScreenStyles, getPremiumPackagesScreenColors } from '../../styles/screens/profile/PremiumPackagesScreen.styles';
import { formatBalance, formatDateWithLanguage } from '../../utils/formatters';

interface PremiumPackagesScreenProps {
  navigation: {
    goBack: () => void;
    navigate: (screen: string) => void;
  };
}

const PremiumPackagesScreen: React.FC<PremiumPackagesScreenProps> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const { language } = useLanguage();
  const currentColors = isDark ? colors.dark : colors.light;
  const { currentPackage, subscription, updatePackage, extendSubscription, cancelSubscription, toggleAutoRenew } = usePackage();
  const { balance, deductBalance } = useBalance();
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [selectedPackageInfo, setSelectedPackageInfo] = useState<{name: string, id: string} | null>(null);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'year'>('month');
  
  // Анимация для свитчера
  const switchAnimation = useRef(new Animated.Value(0)).current;

  // Инициализация анимации при загрузке
  useEffect(() => {
    if (subscription?.autoRenew) {
      switchAnimation.setValue(1);
    }
  }, [subscription?.autoRenew, switchAnimation]);

  // Функция анимации свитчера
  const animateSwitch = (toValue: number) => {
    Animated.timing(switchAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handlePackageSelect = (packageId: string, price: number, selectedPeriod: 'month' | 'year') => {
    // 1. СНАЧАЛА определяем сценарий действия
    const scenario = determineScenario(packageId, selectedPeriod);
    
    // 2. Проверяем баланс только для новых покупок
    if (scenario === 'PURCHASE_NEW_PACKAGE' && packageId !== 'free' && balance < price) {
      const packageName = getPackageName(packageId);
      Alert.alert(
        t('premium.insufficient.title'),
        t('premium.insufficient.message', { 
          packageName, 
          price: formatBalance(price), 
          balance: formatBalance(balance) 
        }),
        [
          {
            text: t('premium.purchase.cancel'),
            style: 'cancel'
          },
          {
            text: t('premium.insufficient.topUp'),
            onPress: () => {
              navigation.navigate('Balance');
            }
          }
        ]
      );
      return;
    }
    
    switch (scenario) {
      case 'FREE_ALREADY_ACTIVE':
        showFreeAlreadyActiveMessage();
        break;
        
      case 'CANCEL_TO_FREE':
        showCancelToFreeDialog();
        break;
        
      case 'PURCHASE_NEW_PACKAGE':
        showPurchaseDialog(packageId, selectedPeriod, price);
        break;
        
      case 'CANCEL_CURRENT':
        showCancelCurrentDialog(packageId);
        break;
    }
  };

  // Функция определения сценария
  const determineScenario = (packageId: string, selectedPeriod: 'month' | 'year') => {
    const currentPeriod = subscription?.period || 'month';
    
    // Бесплатный пакет
    if (packageId === 'free') {
      if (currentPackage === 'free') return 'FREE_ALREADY_ACTIVE';
      return 'CANCEL_TO_FREE';
    }
    
    // Тот же пакет, тот же период = отмена (только для активных подписок)
    if (currentPackage === packageId && subscription?.isActive) {
      return 'CANCEL_CURRENT';
    }
    
    // Тот же пакет, но подписка неактивна = покупка
    if (currentPackage === packageId && !subscription?.isActive) {
      return 'PURCHASE_NEW_PACKAGE';
    }
    
    // Другой пакет или другой период = покупка нового
    return 'PURCHASE_NEW_PACKAGE';
  };

  // Вспомогательная функция для получения названия пакета
  const getPackageName = (packageId: string) => {
    // Убираем суффикс периода из ID
    const basePackageId = packageId.replace(/_month$|_year$/, '');
    
    switch (basePackageId) {
      case 'free': return t('premium.packages.free');
      case 'plus': return t('premium.packages.plus');
      case 'premium': return t('premium.packages.premium');
      case 'premiumPlus': return t('premium.packages.premiumPlus');
      default: return t('premium.packages.free');
    }
  };

  // Сценарий: Бесплатный пакет уже активен
  const showFreeAlreadyActiveMessage = () => {
    Alert.alert(
      t('premium.free.alreadyActive.title'),
      t('premium.free.alreadyActive.message'),
      [{ text: t('common.ok') }]
    );
  };

  // Сценарий: Отмена подписки для перехода на бесплатный
  const showCancelToFreeDialog = () => {
    Alert.alert(
      t('premium.cancelToFree.title'),
      t('premium.cancelToFree.message'),
      [
        {
          text: t('premium.cancelToFree.keepButton'),
          style: 'cancel'
        },
        {
          text: t('premium.cancelToFree.confirmButton'),
          style: 'destructive',
          onPress: async () => {
            await cancelSubscription();
            setSelectedPackageInfo({ name: t('premium.packages.free'), id: 'free' });
            setSuccessModalVisible(true);
          }
        }
      ]
    );
  };



  // Сценарий: Покупка нового пакета
  const showPurchaseDialog = (packageId: string, selectedPeriod: 'month' | 'year', price: number) => {
    const packageName = getPackageName(packageId);
    
    Alert.alert(
      t('premium.purchase.confirmTitle'),
      t('premium.purchase.confirmMessage', { packageName, price: formatBalance(price) }),
      [
        {
          text: t('premium.purchase.cancelButton'),
          style: 'cancel'
        },
        {
          text: t('premium.purchase.confirmButton'),
          onPress: async () => {
            console.log('🔄 Starting package purchase process...');
            console.log('💰 Package ID:', packageId, 'Price:', price, 'Period:', selectedPeriod);
      
            const success = await deductBalance(price, t('client.paymentHistory.transactions.packagePurchase', { packageName }), packageId as string);
            console.log('💳 Balance deduction result:', success);
            
            if (success) {
              console.log('✅ Balance deducted successfully, updating package...');
              await updatePackage(packageId as PackageType, selectedPeriod);
              console.log('✅ Package updated successfully');
              setSelectedPackageInfo({ name: packageName, id: packageId });
              setSuccessModalVisible(true);
            } else {
              console.log('❌ Balance deduction failed');
            }
          }
        }
      ]
    );
  };

  // Сценарий: Отмена текущего пакета
  const showCancelCurrentDialog = (packageId: string) => {
    const packageName = getPackageName(packageId);
    
    setSelectedPackageInfo({ name: packageName, id: packageId });
    setCancelModalVisible(true);
  };

  const dynamicStyles = getPremiumPackagesScreenColors(isDark);

  return (
    <View style={[PremiumPackagesScreenStyles.container, dynamicStyles.container]}>
      {/* Header */}
      <View style={[PremiumPackagesScreenStyles.header, dynamicStyles.header]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={PremiumPackagesScreenStyles.backButton}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={currentColors.primary} 
          />
        </TouchableOpacity>
        
        <Text style={[PremiumPackagesScreenStyles.headerTitle, dynamicStyles.headerTitle]}>
          {t('premium.title')}
        </Text>

        {/* Свитчер автообновления в хедере */}
        {subscription && subscription.isActive && subscription.packageType !== 'free' ? (
          <TouchableOpacity
            style={[PremiumPackagesScreenStyles.autoRenewSwitch, dynamicStyles.autoRenewSwitch]}
            onPress={async () => {
              // Если включаем автообновление - сразу включаем с анимацией
              if (!subscription.autoRenew) {
                const newValue = 1;
                animateSwitch(newValue);
                await toggleAutoRenew();
              } else {
                // Если отключаем - сначала анимация, потом диалог
                const newValue = 0;
                animateSwitch(newValue);
                
                Alert.alert(
                  t('premium.subscription.disableAutoRenewTitle'),
                  t('premium.subscription.disableAutoRenewMessage'),
                  [
                    {
                      text: t('premium.subscription.cancel'),
                      style: 'cancel',
                      onPress: async () => {
                        // Если отменили - возвращаем анимацию обратно
                        const revertValue = 1;
                        animateSwitch(revertValue);
                      }
                    },
                    {
                      text: t('premium.subscription.disableButton'),
                      style: 'destructive',
                      onPress: async () => {
                        // Подтвердили отключение - сохраняем состояние
                        await toggleAutoRenew();
                      }
                    }
                  ]
                );
              }
            }}
            activeOpacity={0.8}
          >
            {/* Анимированный фон */}
            <Animated.View
              style={[
                PremiumPackagesScreenStyles.autoRenewBackground,
                { opacity: switchAnimation }
              ]}
            />
            
            {/* Анимированный индикатор */}
            <Animated.View
              style={[
                PremiumPackagesScreenStyles.autoRenewIndicator,
                {
                  left: switchAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [4, 22],
                  }),
                }
              ]}
            >
              <Animated.View
                style={[
                  PremiumPackagesScreenStyles.autoRenewIcon,
                  {
                    opacity: switchAnimation.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [1, 0, 0],
                    }),
                  }
                ]}
              >
                <Ionicons name="close" size={16} color="#EF4444" />
              </Animated.View>
              <Animated.View
                style={[
                  PremiumPackagesScreenStyles.autoRenewIcon,
                  {
                    opacity: switchAnimation.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, 0, 1],
                    }),
                  }
                ]}
              >
                <Ionicons name="refresh" size={16} color="#10B981" />
              </Animated.View>
            </Animated.View>
          </TouchableOpacity>
        ) : (
          <View style={PremiumPackagesScreenStyles.placeholder} />
        )}
      </View>

      {/* Content */}
      <View style={PremiumPackagesScreenStyles.content}>
        {console.log('🎯 VipPackages props:', { 
          currentPackage, 
          currentPeriod: subscription?.period, 
          selectedPeriod, 
          isSubscriptionActive: subscription?.isActive || false 
        })}
        <VipPackages
          onSelectPackage={handlePackageSelect}
          currentPackage={currentPackage}
          currentPeriod={subscription?.period}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          isSubscriptionActive={subscription?.isActive || false}
        />
      </View>

      {/* Модальное окно успешной покупки */}
      <Modal
        visible={successModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={PremiumPackagesScreenStyles.modalOverlay}>
          <View style={[PremiumPackagesScreenStyles.modalContainer, dynamicStyles.modalContainer]}>
            <View style={[PremiumPackagesScreenStyles.modalIconContainer, PremiumPackagesScreenStyles.successIconContainer]}>
              <Ionicons name="checkmark" size={32} color="#FFFFFF" />
            </View>
            
            <Text style={[PremiumPackagesScreenStyles.modalTitle, dynamicStyles.modalTitle]}>
              {t('premium.success.title')}
            </Text>
            
            <Text style={[PremiumPackagesScreenStyles.modalMessage, dynamicStyles.modalMessage]}>
              {t('premium.success.message', { packageName: selectedPackageInfo?.name || '' })}
            </Text>
            
            <TouchableOpacity
              style={[PremiumPackagesScreenStyles.modalButton, PremiumPackagesScreenStyles.primaryButton]}
              onPress={() => {
                setSuccessModalVisible(false);
                navigation.goBack();
              }}
              activeOpacity={0.8}
            >
              <Text style={[PremiumPackagesScreenStyles.modalButtonText, PremiumPackagesScreenStyles.whiteText]}>
                {t('common.ok')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Модальное окно отмены подписки */}
      <Modal
        visible={cancelModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setCancelModalVisible(false)}
      >
        <View style={PremiumPackagesScreenStyles.modalOverlay}>
          <View style={[PremiumPackagesScreenStyles.modalContainer, PremiumPackagesScreenStyles.cancelModalContainer, dynamicStyles.modalContainer]}>
            <View style={[PremiumPackagesScreenStyles.modalIconContainer, PremiumPackagesScreenStyles.errorIconContainer]}>
              <Ionicons name="warning" size={32} color="#FFFFFF" />
            </View>
            
            <Text style={[PremiumPackagesScreenStyles.modalTitle, dynamicStyles.modalTitle]}>
              {t('premium.subscription.cancelTitle')}
            </Text>
            
            <Text style={[PremiumPackagesScreenStyles.modalMessage, dynamicStyles.modalMessage]}>
              {t('premium.subscription.cancelMessage', { packageName: selectedPackageInfo?.name || '' })}
            </Text>
            
            <View style={PremiumPackagesScreenStyles.buttonRow}>
              <TouchableOpacity
                style={[PremiumPackagesScreenStyles.secondaryButton, dynamicStyles.secondaryButton]}
                onPress={() => setCancelModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={[PremiumPackagesScreenStyles.modalButtonText, dynamicStyles.secondaryButtonText]}>
                  {t('premium.subscription.keepButton')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[PremiumPackagesScreenStyles.dangerButton]}
                onPress={async () => {
                  await cancelSubscription();
                  setCancelModalVisible(false);
                  navigation.goBack();
                }}
                activeOpacity={0.8}
              >
                <Text style={[PremiumPackagesScreenStyles.modalButtonText, PremiumPackagesScreenStyles.whiteText]}>
                  {t('premium.subscription.cancelButton')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PremiumPackagesScreen; 