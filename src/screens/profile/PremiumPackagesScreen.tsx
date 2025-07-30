import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../hooks/useI18n';
import { colors } from '../../constants/colors';
import VipPackages from '../../components/VipPackages';
import { usePackage } from '../../context/PackageContext';
import { useBalance } from '../../context/BalanceContext';

interface PremiumPackagesScreenProps {
  navigation: any;
}

const PremiumPackagesScreen: React.FC<PremiumPackagesScreenProps> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const currentColors = isDark ? colors.dark : colors.light;
  const { currentPackage, subscription, updatePackage, cancelSubscription, toggleAutoRenew, getPackagePrice } = usePackage();
  const { balance, deductBalance } = useBalance();
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [selectedPackageInfo, setSelectedPackageInfo] = useState<{name: string, id: string} | null>(null);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  
  // Анимация для свитчера
  const switchAnimation = useRef(new Animated.Value(0)).current;

  // Инициализация анимации при загрузке
  useEffect(() => {
    if (subscription?.autoRenew) {
      switchAnimation.setValue(1);
    }
  }, [subscription?.autoRenew]);

  // Функция анимации свитчера
  const animateSwitch = (toValue: number) => {
    Animated.timing(switchAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handlePackageSelect = (packageId: string, price: number) => {
    // Если выбран уже активный пакет, показываем диалог отмены
    if (currentPackage === packageId) {
      const packageName = packageId === 'free' ? t('premium.packages.free') :
                         packageId === 'basic' ? t('premium.packages.plus') : 
                         packageId === 'premium' ? t('premium.packages.premium') : 
                         t('premium.packages.premiumPlus');
      
      setSelectedPackageInfo({ name: packageName, id: packageId });
      setCancelModalVisible(true);
      return;
    }

    if (balance >= price) {
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
              
              // Списываем средства с баланса
              const packageName = packageId === 'free' ? t('premium.packages.free') :
                                packageId === 'basic' ? t('premium.packages.plus') : 
                                packageId === 'premium' ? t('premium.packages.premium') : 
                                t('premium.packages.premiumPlus');
              
              const success = await deductBalance(price, t('client.paymentHistory.transactions.packagePurchase', { packageName }), packageId);
              
              if (success) {
                await updatePackage(packageId as any);
                setSelectedPackageInfo({ name: packageName, id: packageId });
                setSuccessModalVisible(true);
              }
            }
          }
        ]
      );
    } else {
      const packageName = packageId === 'free' ? t('premium.packages.free') :
                         packageId === 'basic' ? t('premium.packages.plus') : 
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

        {/* Свитчер автообновления в хедере */}
        {subscription && subscription.isActive && subscription.packageType !== 'free' ? (
          <TouchableOpacity
            style={{
              width: 51,
              height: 31,
              borderRadius: 16,
              backgroundColor: currentColors.border,
              justifyContent: 'center',
              paddingHorizontal: 2,
            }}
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
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                borderRadius: 16,
                backgroundColor: '#10B981',
                opacity: switchAnimation,
              }}
            />
            
            {/* Анимированный индикатор */}
            <Animated.View
              style={{
                position: 'absolute',
                left: switchAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [4, 22],
                }),
                top: 2,
                width: 27,
                height: 27,
                borderRadius: 14,
                backgroundColor: '#FFFFFF',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              <Animated.View
                style={{
                  opacity: switchAnimation.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 0, 0],
                  }),
                }}
              >
                <Ionicons name="close" size={16} color="#EF4444" />
              </Animated.View>
              <Animated.View
                style={{
                  position: 'absolute',
                  opacity: switchAnimation.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 0, 1],
                  }),
                }}
              >
                <Ionicons name="refresh" size={16} color="#10B981" />
              </Animated.View>
            </Animated.View>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 51 }} />
        )}
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
            width: 320,
            minHeight: 280,
            alignItems: 'center',
            justifyContent: 'center',
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
              width: '100%',
            }}>
              {t('premium.success.title')}
            </Text>
            
            <Text style={{
              fontSize: 16,
              color: currentColors.textSecondary,
              textAlign: 'center',
              marginBottom: 24,
              lineHeight: 22,
              width: '100%',
              paddingHorizontal: 16,
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
                width: '100%',
                maxWidth: 200,
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

      {/* Модальное окно отмены подписки */}
      <Modal
        visible={cancelModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setCancelModalVisible(false)}
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
            width: 320,
            minHeight: 200,
            alignItems: 'center',
            justifyContent: 'center',
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
              backgroundColor: '#EF4444',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}>
              <Ionicons name="warning" size={32} color="#FFFFFF" />
            </View>
            
            <Text style={{
              fontSize: 20,
              fontWeight: '700',
              color: currentColors.text,
              textAlign: 'center',
              marginBottom: 8,
              width: '100%',
            }}>
              {t('premium.subscription.cancelTitle')}
            </Text>
            
            <Text style={{
              fontSize: 16,
              color: currentColors.textSecondary,
              textAlign: 'center',
              marginBottom: 24,
              lineHeight: 22,
              width: '100%',
              paddingHorizontal: 16,
            }}>
              {t('premium.subscription.cancelMessage', { packageName: selectedPackageInfo?.name || '' })}
            </Text>
            
            <View style={{
              flexDirection: 'row',
              gap: 12,
              width: '100%',
            }}>
              <TouchableOpacity
                style={{
                  backgroundColor: currentColors.border,
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  borderRadius: 12,
                  flex: 1,
                }}
                onPress={() => setCancelModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={{
                  color: currentColors.text,
                  fontSize: 16,
                  fontWeight: '600',
                  textAlign: 'center',
                }}>
                  {t('premium.subscription.keep')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{
                  backgroundColor: '#EF4444',
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  borderRadius: 12,
                  flex: 1,
                }}
                onPress={async () => {
                  await cancelSubscription();
                  setCancelModalVisible(false);
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