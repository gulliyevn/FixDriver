import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useI18n } from '../../../../../shared/hooks/useI18n';
import { usePackage, PackageType } from '../../../../context/PackageContext';
import { useBalance } from '../../../../../shared/hooks/useBalance';
import { useAuth } from '../../../../context/AuthContext';
import { formatBalance } from '../../../../../shared/utils/formatters';

/**
 * Hook for Premium Packages Screen logic
 * 
 * Manages package selection, purchase scenarios, and business logic
 */

export const usePremiumLogic = (navigation: any) => {
  const { t } = useI18n();
  const { user } = useAuth();
  const { currentPackage, subscription, updatePackage, cancelSubscription } = usePackage();
  const { balance, withdrawBalance } = useBalance();

  const isDriver = user?.role === 'driver';

  // State
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [selectedPackageInfo, setSelectedPackageInfo] = useState<{name: string, id: string} | null>(null);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'year'>('month');

  // Get screen title based on role
  const getScreenTitle = useCallback(() => {
    return isDriver ? 'Премиум статус' : t('premium.title');
  }, [isDriver, t]);

  // Get package name by ID
  const getPackageName = useCallback((packageId: string) => {
    const basePackageId = packageId.replace(/_month$|_year$/, '');
    
    switch (basePackageId) {
      case 'free': return t('premium.packages.free');
      case 'plus': return t('premium.packages.plus');
      case 'premium': return t('premium.packages.premium');
      case 'premiumPlus': return t('premium.packages.premiumPlus');
      default: return t('premium.packages.free');
    }
  }, [t]);

  // Determine action scenario
  const determineScenario = useCallback((packageId: string, selectedPeriod: 'month' | 'year') => {
    const currentPeriod = subscription?.period || 'month';
    
    // Free package
    if (packageId === 'free') {
      if (currentPackage === 'free') return 'FREE_ALREADY_ACTIVE';
      return 'CANCEL_TO_FREE';
    }
    
    // Same package, same period = cancel (only for active subscriptions)
    if (currentPackage === packageId && subscription?.isActive) {
      return 'CANCEL_CURRENT';
    }
    
    // Same package, but subscription inactive = purchase
    if (currentPackage === packageId && !subscription?.isActive) {
      return 'PURCHASE_NEW_PACKAGE';
    }
    
    // Different package or period = purchase new
    return 'PURCHASE_NEW_PACKAGE';
  }, [currentPackage, subscription]);

  // Show insufficient balance alert
  const showInsufficientBalanceAlert = useCallback((packageId: string, price: number) => {
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
  }, [getPackageName, t, balance, navigation]);

  // Show free already active message
  const showFreeAlreadyActiveMessage = useCallback(() => {
    Alert.alert(
      t('premium.free.alreadyActive.title'),
      t('premium.free.alreadyActive.message'),
      [{ text: t('common.ok') }]
    );
  }, [t]);

  // Show cancel to free dialog
  const showCancelToFreeDialog = useCallback(() => {
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
  }, [t, cancelSubscription]);

  // Show purchase dialog
  const showPurchaseDialog = useCallback((packageId: string, selectedPeriod: 'month' | 'year', price: number) => {
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
            const result = await withdrawBalance(price);
            const success = result.success;
            
            if (success) {
              await updatePackage(packageId as PackageType, selectedPeriod);
              setSelectedPackageInfo({ name: packageName, id: packageId });
              setSuccessModalVisible(true);
            }
          }
        }
      ]
    );
  }, [getPackageName, t, withdrawBalance, updatePackage]);

  // Show cancel current dialog
  const showCancelCurrentDialog = useCallback((packageId: string) => {
    const packageName = getPackageName(packageId);
    setSelectedPackageInfo({ name: packageName, id: packageId });
    setCancelModalVisible(true);
  }, [getPackageName]);

  // Main package selection handler
  const handlePackageSelect = useCallback((packageId: string, price: number, selectedPeriod: 'month' | 'year') => {
    const scenario = determineScenario(packageId, selectedPeriod);
    
    // Check balance for new purchases
    if (scenario === 'PURCHASE_NEW_PACKAGE' && packageId !== 'free' && balance < price) {
      showInsufficientBalanceAlert(packageId, price);
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
  }, [determineScenario, balance, showInsufficientBalanceAlert, showFreeAlreadyActiveMessage, showCancelToFreeDialog, showPurchaseDialog, showCancelCurrentDialog]);

  // Handle cancel subscription
  const handleCancelSubscription = useCallback(async () => {
    await cancelSubscription();
    setCancelModalVisible(false);
    navigation.goBack();
  }, [cancelSubscription, navigation]);

  // Handle success modal close
  const handleSuccessModalClose = useCallback(() => {
    setSuccessModalVisible(false);
    navigation.goBack();
  }, [navigation]);

  return {
    // State
    successModalVisible,
    selectedPackageInfo,
    cancelModalVisible,
    selectedPeriod,
    setSelectedPeriod,
    
    // Computed
    isDriver,
    getScreenTitle,
    
    // Handlers
    handlePackageSelect,
    handleCancelSubscription,
    handleSuccessModalClose,
    setCancelModalVisible,
  };
};
