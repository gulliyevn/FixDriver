import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../../../core/context/ThemeContext';
import { useI18n } from '../../../../../shared/i18n';
import { VipPackagesStyles, getVipPackagesColors, getPackageCardColors } from './styles/VipPackages.styles';
import { ChevronLeft } from '../../../../../shared/components/IconLibrary';

interface VipScreenProps {
  onBack: () => void;
}

const VipScreen: React.FC<VipScreenProps> = ({ onBack }) => {
  const { isDark, colors } = useTheme();
  const { t } = useI18n();
  const dynamicStyles = getVipPackagesColors(isDark);
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'year'>('month');
  const periodAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(periodAnim, {
      toValue: selectedPeriod === 'year' ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [selectedPeriod, periodAnim]);

  const packages = [
    { id: 'free', name: t('premium.packages.free'), price: 0, icon: 'star' },
    { id: 'plus', name: t('premium.packages.plus'), price: 999, icon: 'star' },
    { id: 'premium', name: t('premium.packages.premium'), price: 1999, icon: 'star' },
  ];

  return (
    <View style={VipPackagesStyles.container}>
      <View style={[VipPackagesStyles.periodSwitchContainer, dynamicStyles.periodSwitchContainer]}
      >
        <TouchableOpacity
          style={VipPackagesStyles.periodButtonWrapLeft}
          onPress={() => setSelectedPeriod('month')}
          activeOpacity={0.9}
        >
          <Animated.View style={[VipPackagesStyles.periodButton, selectedPeriod !== 'month' && VipPackagesStyles.periodButtonInactive, selectedPeriod === 'month' && { backgroundColor: colors.primary }]}>
            <Text style={[VipPackagesStyles.periodButtonText, { color: selectedPeriod === 'month' ? '#fff' : colors.text }]}>
              {t('premium.periods.month')}
            </Text>
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity
          style={VipPackagesStyles.periodButtonWrapRight}
          onPress={() => setSelectedPeriod('year')}
          activeOpacity={0.9}
        >
          <Animated.View style={[VipPackagesStyles.periodButton, selectedPeriod !== 'year' && VipPackagesStyles.periodButtonInactive, selectedPeriod === 'year' && { backgroundColor: colors.primary }]}>
            <View style={VipPackagesStyles.yearButtonContent}>
              <Text style={[VipPackagesStyles.periodButtonText, { color: selectedPeriod === 'year' ? '#fff' : colors.text }]}>
                {t('premium.periods.year')}
              </Text>
              {selectedPeriod === 'year' && (
                <LinearGradient colors={[colors.primary, colors.primary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={VipPackagesStyles.yearDiscountBadge}>
                  <Text style={VipPackagesStyles.yearDiscountText}>-25%</Text>
                </LinearGradient>
              )}
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>

      <View style={VipPackagesStyles.carouselContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={VipPackagesStyles.carouselContent} snapToInterval={390} decelerationRate={0} snapToAlignment="center">
          <View style={{ width: 10 }} />
          {packages.map((pkg, index) => (
            <React.Fragment key={pkg.id}>
              <View style={[VipPackagesStyles.packageCard, getPackageCardColors(pkg.id, isDark), dynamicStyles.packageCard]}>
                <View style={VipPackagesStyles.packageHeader}>
                  <Text style={[VipPackagesStyles.packageTitle, dynamicStyles.packageTitle]}>{pkg.name}</Text>
                </View>
                <View style={VipPackagesStyles.featuresContainer}>
                  <Text style={VipPackagesStyles.featureName}>{t('premium.features.placeholder')}</Text>
                </View>
                <View style={[VipPackagesStyles.priceButton, dynamicStyles.priceButton]}>
                  <View style={VipPackagesStyles.priceContainer}>
                    <Text style={VipPackagesStyles.priceText}>
                      {pkg.price === 0 ? t('premium.packages.free') : `${pkg.price} ₸`}
                    </Text>
                  </View>
                </View>
              </View>
              {index < packages.length - 1 && <View style={{ width: 22 }} />}
            </React.Fragment>
          ))}
          <View style={{ width: 10 }} />
        </ScrollView>
      </View>
    </View>
  );
};

export default VipScreen;


