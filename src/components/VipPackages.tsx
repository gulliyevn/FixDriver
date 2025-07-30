import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../hooks/useI18n';
import { colors } from '../constants/colors';
import { VipPackagesStyles, getVipPackagesColors } from '../styles/components/VipPackages.styles';
import { getPremiumPackages } from '../mocks/premiumPackagesMock';

interface VipPackagesProps {
  onSelectPackage: (packageId: string, price: number) => void;
  selectedPackage?: string;
}

// Интерфейс для функций пакета
interface PackageFeature {
  name: string;
  free: string | boolean;
  plus: string | boolean;
  premium: string | boolean;
  premiumPlus: string | boolean;
}

const VipPackages: React.FC<VipPackagesProps> = ({ onSelectPackage }) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const currentColors = isDark ? colors.dark : colors.light;
  const dynamicStyles = getVipPackagesColors(isDark);
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'year'>('month');

  // Один Animated.Value для плавного перехода
  const periodAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(periodAnim, {
      toValue: selectedPeriod === 'year' ? 1 : 0,
      duration: 220,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [selectedPeriod]);

  const packages = getPremiumPackages(selectedPeriod, currentColors, t);

  // Функции для каждого пакета
  const packageFeatures: PackageFeature[] = [
    {
      name: t('premium.features.commission'),
      free: '5%',
      plus: '3%',
      premium: '1%',
      premiumPlus: '0%'
    },
    {
      name: t('premium.features.cashback'),
      free: false,
      plus: '2%',
      premium: '5%',
      premiumPlus: '10%'
    },
    {
      name: t('premium.features.priority'),
      free: false,
      plus: true,
      premium: t('premium.values.high'),
      premiumPlus: t('premium.values.maximum')
    },
    {
      name: t('premium.features.support'),
      free: t('premium.values.standard'),
      plus: t('premium.values.fast'),
      premium: t('premium.values.vip'),
      premiumPlus: t('premium.values.personal')
    },
    {
      name: t('premium.features.waitGuarantee'),
      free: false,
      plus: '5 мин',
      premium: '3 мин',
      premiumPlus: '2 мин'
    },
    {
      name: t('premium.features.freeCancellation'),
      free: false,
      plus: '1/мес',
      premium: '2/мес',
      premiumPlus: '5/мес'
    },
    {
      name: t('premium.features.multiRoute'),
      free: false,
      plus: true,
      premium: true,
      premiumPlus: true
    },
    {
      name: t('premium.features.calendarIntegration'),
      free: false,
      plus: false,
      premium: true,
      premiumPlus: true
    },
    {
      name: t('premium.features.earlyAccess'),
      free: false,
      plus: false,
      premium: true,
      premiumPlus: true
    }
  ];

  // Функция для отображения значения функции
  const renderFeatureValue = (value: string | boolean, isHighlighted: boolean = false) => {
    if (typeof value === 'boolean') {
      return value ? (
        <View style={VipPackagesStyles.iconContainer}>
          <Ionicons 
            name="checkmark-circle" 
            size={16} 
            color={isHighlighted ? currentColors.primary : '#10B981'} 
          />
        </View>
      ) : (
        <View style={[VipPackagesStyles.iconContainer, VipPackagesStyles.crossContainer]}>
          <View style={VipPackagesStyles.crossCircle}>
            <Ionicons 
              name="close" 
              size={12} 
              color="#EF4444" 
            />
          </View>
        </View>
      );
    }
    
    return (
      <Text style={[
        VipPackagesStyles.featureValue,
        { color: isHighlighted ? currentColors.primary : currentColors.textSecondary }
      ]}>
        {value}
      </Text>
    );
  };

  // Функция для получения иконки функции
  const getFeatureIcon = (featureName: string) => {
    // Определяем иконку по ключевым словам в названии
    if (featureName.toLowerCase().includes('комиссия') || featureName.toLowerCase().includes('commission')) {
      return { name: 'card-outline', color: '#F59E0B' };
    }
    if (featureName.toLowerCase().includes('кэшбэк') || featureName.toLowerCase().includes('cashback')) {
      return { name: 'cash-outline', color: '#10B981' };
    }
    if (featureName.toLowerCase().includes('приоритет') || featureName.toLowerCase().includes('priority')) {
      return { name: 'star-outline', color: '#3B82F6' };
    }
    if (featureName.toLowerCase().includes('поддержка') || featureName.toLowerCase().includes('support')) {
      return { name: 'headset-outline', color: '#8B5CF6' };
    }
    if (featureName.toLowerCase().includes('гарантия') || featureName.toLowerCase().includes('guarantee')) {
      return { name: 'time-outline', color: '#EF4444' };
    }
    if (featureName.toLowerCase().includes('отмена') || featureName.toLowerCase().includes('cancellation')) {
      return { name: 'refresh-outline', color: '#06B6D4' };
    }
    if (featureName.toLowerCase().includes('маршрут') || featureName.toLowerCase().includes('route')) {
      return { name: 'map-outline', color: '#84CC16' };
    }
    if (featureName.toLowerCase().includes('календар') || featureName.toLowerCase().includes('calendar')) {
      return { name: 'calendar-outline', color: '#F97316' };
    }
    if (featureName.toLowerCase().includes('акция') || featureName.toLowerCase().includes('access')) {
      return { name: 'gift-outline', color: '#EC4899' };
    }
    
    return { name: 'ellipse-outline', color: '#6B7280' };
  };

  // Функция для получения значения функции по ID пакета
  const getFeatureValue = (feature: PackageFeature, packageId: string) => {
    switch (packageId) {
      case 'free': return feature.free;
      case 'basic': return feature.plus;
      case 'premium': return feature.premium;
      case 'family': return feature.premiumPlus;
      default: return feature.free;
    }
  };

  return (
    <View style={VipPackagesStyles.container}>
      {/* Период подписки */}
      <View style={[VipPackagesStyles.periodSwitchContainer, dynamicStyles.periodSwitchContainer]}>
        <TouchableOpacity
          style={VipPackagesStyles.periodButtonWrapLeft}
          onPress={() => setSelectedPeriod('month')}
          activeOpacity={0.9}
        >
          <Animated.View
            style={[
              VipPackagesStyles.periodButton,
              selectedPeriod !== 'month' && VipPackagesStyles.periodButtonInactive,
              selectedPeriod === 'month' && {
                backgroundColor: currentColors.primary,
                shadowOpacity: 0.08,
                elevation: 2,
              },
            ]}
          >
            <Text style={[
              VipPackagesStyles.periodButtonText,
              { color: selectedPeriod === 'month' ? '#fff' : currentColors.text },
            ]}>
              {t('premium.periods.month')}
            </Text>
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity
          style={VipPackagesStyles.periodButtonWrapRight}
          onPress={() => setSelectedPeriod('year')}
          activeOpacity={0.9}
        >
          <Animated.View
            style={[
              VipPackagesStyles.periodButton,
              selectedPeriod !== 'year' && VipPackagesStyles.periodButtonInactive,
              selectedPeriod === 'year' && {
                backgroundColor: currentColors.primary,
                shadowOpacity: 0.08,
                elevation: 2,
              },
            ]}
          >
            <View style={VipPackagesStyles.yearButtonContent}>
              <Text style={[
                VipPackagesStyles.periodButtonText,
                { color: selectedPeriod === 'year' ? '#fff' : currentColors.text },
              ]}>
                {t('premium.periods.year')}
              </Text>
              {selectedPeriod === 'year' && (
                <LinearGradient
                  colors={['#00FFFF', '#FF00FF', '#FFFF00']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={VipPackagesStyles.yearDiscountBadge}
                >
                  <Text style={VipPackagesStyles.yearDiscountText}>
                    -25%
                  </Text>
                </LinearGradient>
              )}
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Пакеты */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={VipPackagesStyles.packagesScrollContent}
        snapToInterval={384}
        decelerationRate="normal"
        snapToAlignment="center"
        contentInsetAdjustmentBehavior="automatic"
        pagingEnabled={false}
        onMomentumScrollEnd={(event) => {
          const offsetX = event.nativeEvent.contentOffset.x;
          const cardWidth = 384; // ширина карточки + отступы
          const centerIndex = Math.round(offsetX / cardWidth);
          const targetOffset = centerIndex * cardWidth;
          
          // Плавно прокручиваем к центру
          event.target.scrollTo({ x: targetOffset, animated: true });
        }}
      >
        {/* Отступ слева для центрирования первого элемента */}
        <View style={{ width: 32 }} />
        
        {packages.map((pkg) => (
          <View
            key={pkg.id}
            style={[
              VipPackagesStyles.packageCard, 
              dynamicStyles.packageCard,
            ]}
          >
            <Text style={[VipPackagesStyles.packageTitle, dynamicStyles.packageTitle]}>
              {pkg.name}
            </Text>

            <Text style={[VipPackagesStyles.packageDescription, dynamicStyles.packageDescription]}>
              {pkg.description}
            </Text>

            {/* Таблица функций */}
            <View style={VipPackagesStyles.featuresContainer}>
              {packageFeatures.map((feature, featureIndex) => {
                const featureIcon = getFeatureIcon(feature.name);
                const isLastRow = featureIndex === packageFeatures.length - 1;
                return (
                  <View key={featureIndex} style={[
                    VipPackagesStyles.featureRow,
                    isLastRow && { borderBottomWidth: 0 }
                  ]}>
                    <View style={VipPackagesStyles.featureNameContainer}>
                      <View style={[VipPackagesStyles.iconWrapper, { backgroundColor: featureIcon.color + '15' }]}>
                        <Ionicons 
                          name={featureIcon.name as keyof typeof Ionicons.glyphMap} 
                          size={14} 
                          color={featureIcon.color} 
                        />
                      </View>
                      <Text style={[VipPackagesStyles.featureName, { color: currentColors.textSecondary }]}>
                        {feature.name}
                      </Text>
                    </View>
                    <View style={VipPackagesStyles.featureValueContainer}>
                      {renderFeatureValue(
                        getFeatureValue(feature, pkg.id), 
                        pkg.id !== 'free'
                      )}
                    </View>
                  </View>
                );
              })}
            </View>

            <TouchableOpacity
              style={[VipPackagesStyles.priceButton, dynamicStyles.priceButton]}
              onPress={() => onSelectPackage(pkg.id, pkg.price)}
              activeOpacity={0.7}
            >
              <View style={VipPackagesStyles.priceContainer}>
                <Text style={VipPackagesStyles.priceText}>
                  {pkg.price} AFC
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
        
        {/* Отступ справа для центрирования последнего элемента */}
        <View style={{ width: 32 }} />
      </ScrollView>
    </View>
  );
};

export default VipPackages; 