import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../hooks/useI18n';
import { colors } from '../../constants/colors';
import VipPackages from '../../components/VipPackages';
import { usePackage, PackageType } from '../../context/PackageContext';
import { useBalance } from '../../context/BalanceContext';
import { PremiumPackagesScreenStyles, getPremiumPackagesScreenColors } from '../../styles/screens/profile/PremiumPackagesScreen.styles';

interface PremiumPackagesScreenProps {
  navigation: {
    goBack: () => void;
    navigate: (screen: string) => void;
  };
}

const PremiumPackagesScreen: React.FC<PremiumPackagesScreenProps> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
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
    // Если выбран уже активный пакет, проверяем период
    if (currentPackage === packageId) {
      const currentPeriod = subscription?.period || 'month';
      
      // Если период отличается - это продление
      if (currentPeriod !== selectedPeriod) {
        const packageName = packageId === 'free' ? t('premium.packages.free') :
                           packageId === 'plus' ? t('premium.packages.plus') : 
                           packageId === 'premium' ? t('premium.packages.premium') : 
                           t('premium.packages.premiumPlus');
        
        // Рассчитываем дату активации
        const currentEndDate = new Date(subscription?.nextBillingDate || new Date());
        const activationDate = new Date(currentEndDate.getTime() + 24 * 60 * 60 * 1000);
        const formattedDate = activationDate.toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
        
        Alert.alert(
          t('premium.extension.title'),
          t('premium.extension.message', { 
            packageName, 
            activationDate: formattedDate,
            price: price.toString() 
          }),
          [
            {
              text: t('premium.extension.cancel'),
              style: 'cancel'
            },
            {
              text: t('premium.extension.confirm'),
              onPress: async () => {
                console.log(`Package extension ${packageId} for ${selectedPeriod} at ${price} AFC`);
                
                const success = await deductBalance(price, t('client.paymentHistory.transactions.packageExtension', { packageName }), packageId as string);
                
                if (success) {
                  await extendSubscription(packageId as PackageType, selectedPeriod, price);
                  setSelectedPackageInfo({ name: packageName, id: packageId });
                  setSuccessModalVisible(true);
                }
              }
            }
          ]
        );
        return;
      } else {
        // Если тот же пакет и тот же период
        if (packageId === 'free') {
          // Для бесплатного пакета просто показываем уведомление о том, что уже активен
          Alert.alert(
            t('premium.free.alreadyActive.title'),
            t('premium.free.alreadyActive.message'),
            [{ text: t('common.ok') }]
          );
          return;
        } else {
          // Для платных пакетов показываем диалог отмены
          const packageName = packageId === 'plus' ? t('premium.packages.plus') : 
                             packageId === 'premium' ? t('premium.packages.premium') : 
                             t('premium.packages.premiumPlus');
          
          setSelectedPackageInfo({ name: packageName, id: packageId });
          setCancelModalVisible(true);
          return;
        }
      }
    }

    // Проверка: если у пользователя есть активная подписка и он выбирает другой пакет или период
    if (subscription?.isActive && (subscription.packageType !== packageId || subscription.period !== selectedPeriod)) {
      // Если это тот же пакет, но другой период - это продление (уже обработано выше)
      if (subscription.packageType === packageId && subscription.period !== selectedPeriod) {
        return; // Уже обработано в блоке выше
      }
      
      // Если это другой пакет или тот же пакет с тем же периодом - показываем диалог отмены
      const packageName = packageId === 'free' ? t('premium.packages.free') :
                         packageId === 'plus' ? t('premium.packages.plus') : 
                         packageId === 'premium' ? t('premium.packages.premium') : 
                         t('premium.packages.premiumPlus');
      
      setSelectedPackageInfo({ name: packageName, id: packageId });
      setCancelModalVisible(true);
      return;
    }

    if (balance >= price) {
      const packageName = packageId === 'free' ? t('premium.packages.free') :
                         packageId === 'plus' ? t('premium.packages.plus') : 
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
              console.log(`Package purchase ${packageId} for ${price} AFC`);
              
              // Списываем средства с баланса
              const packageName = packageId === 'free' ? t('premium.packages.plus') :
                                packageId === 'plus' ? t('premium.packages.plus') : 
                                packageId === 'premium' ? t('premium.packages.premium') : 
                                t('premium.packages.premiumPlus');
              
              const success = await deductBalance(price, t('client.paymentHistory.transactions.packagePurchase', { packageName }), packageId as string);
              
              if (success) {
                await updatePackage(packageId as PackageType, selectedPeriod);
                setSelectedPackageInfo({ name: packageName, id: packageId });
                setSuccessModalVisible(true);
              }
            }
          }
        ]
      );
    } else {
      const packageName = packageId === 'free' ? t('premium.packages.free') :
                         packageId === 'plus' ? t('premium.packages.plus') : 
                         packageId === 'premium' ? t('premium.packages.premium') : 
                         t('premium.packages.premiumPlus');
      
      Alert.alert(
        t('premium.insufficient.title'),
        t('premium.insufficient.message', { 
          packageName, 
          price: price.toString(), 
          balance: balance.toString() 
        }),
        [
          {
            text: t('premium.purchase.cancel'),
            style: 'cancel'
          },
          {
            text: t('premium.insufficient.topUp'),
            onPress: () => {
              console.log('Navigate to balance page');
              navigation.navigate('Balance');
            }
          }
        ]
      );
    }
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
                      text: t('premium.subscription.disable'),
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
        <VipPackages
          onSelectPackage={handlePackageSelect}
          currentPackage={currentPackage}
          currentPeriod={subscription?.period}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
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
                  {t('premium.subscription.keep')}
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
                  {t('premium.subscription.cancel')}
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