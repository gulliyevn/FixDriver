import React from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../context/ThemeContext';
import { useI18n } from '../../../../shared/hooks/useI18n';
import { usePackage } from '../../../context/package';
import { usePremiumLogic } from './hooks/usePremiumLogic';
import { useAutoRenewSwitch } from './hooks/useAutoRenewSwitch';
import { PremiumHeader } from './components/PremiumHeader';
import { SuccessModal } from './components/SuccessModal';
import { CancelModal } from './components/CancelModal';
import { PremiumPackagesScreenStyles as styles } from './styles';

/**
 * Premium Packages Screen
 * 
 * Unified screen for premium packages with role-based logic
 * Supports both client and driver premium packages
 */

export const PremiumPackagesScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const { t } = useI18n();
  const { currentPackage, subscription } = usePackage();

  const {
    successModalVisible,
    selectedPackageInfo,
    cancelModalVisible,
    selectedPeriod,
    setSelectedPeriod,
    isDriver,
    getScreenTitle,
    handlePackageSelect,
    handleCancelSubscription,
    handleSuccessModalClose,
    setCancelModalVisible,
  } = usePremiumLogic(navigation);

  const {
    switchAnimation,
    isSwitchVisible,
    handleSwitchToggle,
  } = useAutoRenewSwitch();

  // Package data
  const packages = [
    {
      id: 'free',
      name: t('premium.packages.free'),
      description: t('premium.packages.freeDescription'),
      price: 0,
      features: [
        t('premium.features.basicRides'),
        t('premium.features.standardSupport'),
      ],
    },
    {
      id: 'plus',
      name: t('premium.packages.plus'),
      description: t('premium.packages.plusDescription'),
      price: isDriver ? 150 : 200,
      features: [
        t('premium.features.priorityRides'),
        t('premium.features.prioritySupport'),
        t('premium.features.analytics'),
      ],
    },
    {
      id: 'premium',
      name: t('premium.packages.premium'),
      description: t('premium.packages.premiumDescription'),
      price: isDriver ? 300 : 400,
      features: [
        t('premium.features.allPlusFeatures'),
        t('premium.features.premiumSupport'),
        t('premium.features.advancedAnalytics'),
      ],
    },
    {
      id: 'premiumPlus',
      name: t('premium.packages.premiumPlus'),
      description: t('premium.packages.premiumPlusDescription'),
      price: isDriver ? 500 : 600,
      features: [
        t('premium.features.allPremiumFeatures'),
        t('premium.features.vipSupport'),
        t('premium.features.exclusiveFeatures'),
      ],
    },
  ];

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <PremiumHeader
        title={getScreenTitle()}
        onBackPress={handleBackPress}
        switchAnimation={switchAnimation}
        isSwitchVisible={isSwitchVisible}
        onSwitchToggle={handleSwitchToggle}
        isDark={isDark}
      />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Period Selector */}
        <View style={[styles.periodSelector, isDark && styles.periodSelectorDark]}>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === 'month' && styles.periodButtonActive,
              isDark && styles.periodButtonDark
            ]}
            onPress={() => setSelectedPeriod('month')}
          >
            <Text style={[
              styles.periodButtonText,
              selectedPeriod === 'month' && styles.periodButtonTextActive,
              isDark && styles.periodButtonTextDark
            ]}>
              {t('premium.period.month')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === 'year' && styles.periodButtonActive,
              isDark && styles.periodButtonDark
            ]}
            onPress={() => setSelectedPeriod('year')}
          >
            <Text style={[
              styles.periodButtonText,
              selectedPeriod === 'year' && styles.periodButtonTextActive,
              isDark && styles.periodButtonTextDark
            ]}>
              {t('premium.period.year')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Packages List */}
        <View style={styles.packagesContainer}>
          {packages.map((pkg) => {
            const isActive = currentPackage === pkg.id;
            const packageId = selectedPeriod === 'year' ? `${pkg.id}_year` : `${pkg.id}_month`;
            const price = selectedPeriod === 'year' ? pkg.price * 10 : pkg.price; // Year discount

            return (
              <TouchableOpacity
                key={pkg.id}
                style={[
                  styles.packageCard,
                  isActive && styles.packageCardActive,
                  isDark && styles.packageCardDark
                ]}
                onPress={() => handlePackageSelect(packageId, price, selectedPeriod)}
                activeOpacity={0.8}
              >
                <View style={styles.packageHeader}>
                  <Text style={[
                    styles.packageName,
                    isActive && styles.packageNameActive,
                    isDark && styles.packageNameDark
                  ]}>
                    {pkg.name}
                  </Text>
                  {isActive && (
                    <View style={styles.activeBadge}>
                      <Text style={styles.activeBadgeText}>
                        {t('premium.active')}
                      </Text>
                    </View>
                  )}
                </View>
                
                <Text style={[
                  styles.packageDescription,
                  isDark && styles.packageDescriptionDark
                ]}>
                  {pkg.description}
                </Text>
                
                <View style={styles.packagePrice}>
                  <Text style={[
                    styles.priceText,
                    isDark && styles.priceTextDark
                  ]}>
                    {price > 0 ? `${price} ₽` : t('premium.free')}
                  </Text>
                  {selectedPeriod === 'year' && price > 0 && (
                    <Text style={[
                      styles.discountText,
                      isDark && styles.discountTextDark
                    ]}>
                      {t('premium.yearDiscount')}
                    </Text>
                  )}
                </View>
                
                <View style={styles.featuresList}>
                  {pkg.features.map((feature, index) => (
                    <Text key={index} style={[
                      styles.featureText,
                      isDark && styles.featureTextDark
                    ]}>
                      • {feature}
                    </Text>
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Success Modal */}
      <SuccessModal
        visible={successModalVisible}
        packageName={selectedPackageInfo?.name || ''}
        onClose={handleSuccessModalClose}
        isDark={isDark}
      />

      {/* Cancel Modal */}
      <CancelModal
        visible={cancelModalVisible}
        packageName={selectedPackageInfo?.name || ''}
        onClose={() => setCancelModalVisible(false)}
        onConfirm={handleCancelSubscription}
        isDark={isDark}
      />
    </View>
  );
};
