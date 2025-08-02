import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../hooks/useI18n';
import { colors } from '../constants/colors';
import { VipPackagesStyles, getVipPackagesColors, getPackageCardColors } from '../styles/components/VipPackages.styles';
import { getPremiumPackages } from '../mocks/premiumPackagesMock';
import { 
  PACKAGE_FEATURE_ICONS, 
  CAROUSEL_CONFIG, 
  ANIMATION_CONFIG, 
  DISCOUNT_GRADIENT, 
  ICON_SIZES, 
  COLORS,
  PackageFeature,
  getPackageFeatures
} from '../constants/vipPackages';
import { formatPackagePrice } from '../utils/packageVisuals';

interface VipPackagesProps {
  onSelectPackage: (packageId: string, price: number, period: 'month' | 'year') => void;
  selectedPackage?: string;
  currentPackage?: string;
  currentPeriod?: 'month' | 'year';
  selectedPeriod?: 'month' | 'year';
  onPeriodChange?: (period: 'month' | 'year') => void;
  isSubscriptionActive?: boolean;
}

const VipPackages: React.FC<VipPackagesProps> = ({ 
  onSelectPackage, 
  currentPackage, 
  currentPeriod,
  selectedPeriod: externalSelectedPeriod, 
  onPeriodChange,
  isSubscriptionActive = true
}) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const currentColors = isDark ? colors.dark : colors.light;
  const dynamicStyles = getVipPackagesColors(isDark);
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'year'>(externalSelectedPeriod || 'month');
  // Удаляем неиспользуемую переменную currentIndex

  // Один Animated.Value для плавного перехода
  const periodAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(periodAnim, {
      toValue: selectedPeriod === 'year' ? 1 : 0,
      duration: ANIMATION_CONFIG.PERIOD_SWITCH_DURATION,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
    
    // Уведомляем родительский компонент об изменении периода
    if (onPeriodChange) {
      onPeriodChange(selectedPeriod);
    }
  }, [selectedPeriod, onPeriodChange, periodAnim]);

  const packages = getPremiumPackages(selectedPeriod, currentColors, t);

  // Функции для каждого пакета
  const packageFeatures = getPackageFeatures(t);

  // Функция для отображения значения функции
  const renderFeatureValue = (value: string | boolean, isHighlighted: boolean = false) => {
    if (typeof value === 'boolean') {
      return value ? (
        <View style={VipPackagesStyles.iconContainer}>
          <Ionicons 
            name="checkmark-circle" 
            size={ICON_SIZES.CHECKMARK} 
            color={isHighlighted ? (currentColors.primary || '#3B82F6') : (COLORS.SUCCESS || '#10B981')} 
          />
        </View>
      ) : (
        <View style={[VipPackagesStyles.iconContainer, VipPackagesStyles.crossContainer]}>
          <View style={VipPackagesStyles.crossCircle}>
            <Ionicons 
              name="close" 
              size={ICON_SIZES.CLOSE} 
              color={COLORS.ERROR || '#EF4444'} 
            />
          </View>
        </View>
      );
    }
    
    return (
      <Text style={[
        VipPackagesStyles.featureValue,
        { color: isHighlighted ? (currentColors.primary || '#3B82F6') : (currentColors.textSecondary || '#6B7280') }
      ]}>
        {value}
      </Text>
    );
  };

  // Функция для получения иконки функции по индексу
  const getFeatureIcon = (featureIndex: number) => {
    return PACKAGE_FEATURE_ICONS[featureIndex] || { name: 'ellipse-outline', color: '#6B7280' };
  };

  // Функция для получения значения функции по ID пакета
  const getFeatureValue = (feature: PackageFeature, packageId: string) => {
    // Убираем суффикс периода из ID
    const basePackageId = packageId.replace(/_month$|_year$/, '');
    
    switch (basePackageId) {
      case 'free': return feature.free;
      case 'plus': return feature.plus;
      case 'premium': return feature.premium;
      case 'premiumPlus': return feature.premiumPlus;
      default: return feature.free || false;
    }
  };

  // Функция для определения активного пакета с учетом периода
  const isPackageActive = (packageId: string) => {
    // Бесплатный пакет активен всегда (и в месячном, и в годовом периоде)
    if (packageId === 'free') {
      return currentPackage === 'free';
    }
    
    // Для платных пакетов проверяем точное совпадение ID (включая период)
    // Галочка и бордер только для конкретного периода и пакета
    return currentPackage === packageId && isSubscriptionActive;
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
                  colors={DISCOUNT_GRADIENT.COLORS}
                  start={DISCOUNT_GRADIENT.START}
                  end={DISCOUNT_GRADIENT.END}
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
      <View style={VipPackagesStyles.carouselContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={VipPackagesStyles.carouselContent}
          snapToInterval={CAROUSEL_CONFIG.CARD_WIDTH}
          decelerationRate="fast"
          snapToAlignment="center"
          pagingEnabled={false}
          onMomentumScrollEnd={() => {
            // Обработка окончания прокрутки карусели
            // Можно добавить логику для отслеживания текущего индекса
          }}
        >
          {/* Отступ слева для центрирования первого элемента */}
          <View style={{ width: CAROUSEL_CONFIG.LEFT_PADDING }} />
          
          {packages.map((pkg) => (
            <TouchableOpacity
              key={pkg.id}
              style={[
                VipPackagesStyles.packageCard, 
                getPackageCardColors(pkg.id, isDark),
                isPackageActive(pkg.id) && VipPackagesStyles.selectedPackageCard,
              ]}
              onPress={() => onSelectPackage(pkg.id, pkg.price, selectedPeriod)}
              activeOpacity={0.8}
            >
            <View style={VipPackagesStyles.packageHeader}>
              <Text style={[VipPackagesStyles.packageTitle, dynamicStyles.packageTitle]}>
                {pkg.name}
              </Text>
              {isPackageActive(pkg.id) && (
                <View style={VipPackagesStyles.selectedIndicator}>
                  <Ionicons name="checkmark-circle" size={ICON_SIZES.SELECTED_INDICATOR} color={COLORS.PRIMARY || '#3B82F6'} />
                </View>
              )}
            </View>

            <Text style={[VipPackagesStyles.packageDescription, dynamicStyles.packageDescription]}>
              {pkg.description}
            </Text>

            {/* Таблица функций */}
            <View style={VipPackagesStyles.featuresContainer}>
              {packageFeatures.map((feature, featureIndex) => {
                const featureIcon = getFeatureIcon(featureIndex);
                const isLastRow = featureIndex === packageFeatures.length - 1;
                return (
                  <View key={featureIndex} style={[
                    VipPackagesStyles.featureRow,
                    isLastRow && { borderBottomWidth: 0 }
                  ]}>
                    <View style={VipPackagesStyles.featureNameContainer}>
                      <View style={[VipPackagesStyles.iconWrapper, { backgroundColor: (featureIcon.color || '#6B7280') + '15' }]}>
                        <Ionicons 
                          name={(featureIcon.name as keyof typeof Ionicons.glyphMap) || 'ellipse-outline'} 
                          size={ICON_SIZES.FEATURE_ICON} 
                          color={featureIcon.color || '#6B7280'} 
                        />
                      </View>
                      <Text style={[VipPackagesStyles.featureName, { color: currentColors.textSecondary || '#6B7280' }]}>
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

            <View style={[VipPackagesStyles.priceButton, dynamicStyles.priceButton]}>
              <View style={VipPackagesStyles.priceContainer}>
                <Text style={VipPackagesStyles.priceText}>
                  {pkg.price === 0 ? t('premium.packages.free') : formatPackagePrice(pkg.price)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        
        {/* Отступ справа для центрирования последнего элемента */}
        <View style={{ width: CAROUSEL_CONFIG.RIGHT_PADDING }} />
        
        </ScrollView>
        

      </View>
    </View>
  );
};

export default VipPackages; 