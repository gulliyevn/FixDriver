/**
 * useBalanceActions hook
 * Logic for balance operations (top-up, withdraw, cashback)
 */

import { Alert } from 'react-native';
import { useLanguage } from '../../../../../context/LanguageContext';

export const useBalanceActions = (isDriver: boolean) => {
  const { t } = useLanguage();
  
  const handleTopUp = async (amount: string) => {
    const amountNum = parseFloat(amount.replace(',', '.'));
    
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert(
        t('balance.error'), 
        t('balance.enterValidAmount')
      );
      return;
    }
    
    try {
      // TODO: Implement real top-up logic with API
      console.log(`Top-up amount: ${amountNum} AFc for ${isDriver ? 'driver' : 'client'}`);
      
      Alert.alert(
        t('balance.paymentSuccess'), 
        t('balance.balanceToppedUp', { amount: amountNum })
      );
    } catch (error) {
      console.error('Error topping up balance:', error);
      Alert.alert(
        t('balance.error'), 
        t('balance.topUpFailed')
      );
    }
  };
  
  const handleWithdraw = async (amount?: string) => {
    if (amount) {
      const amountNum = parseFloat(amount);
      if (!isNaN(amountNum) && amountNum > 0) {
        await handleWithdrawAmount(amountNum);
      }
    } else {
      // Show dialog for amount input
      Alert.prompt(
        t('balance.withdraw'),
        t('balance.enterWithdrawAmount'),
        [
          { text: t('balance.cancel'), style: 'cancel' },
          {
            text: t('balance.withdraw'),
            onPress: (inputAmount) => {
              if (inputAmount) {
                const amountNum = parseFloat(inputAmount);
                if (!isNaN(amountNum) && amountNum > 0) {
                  handleWithdrawAmount(amountNum);
                } else {
                  Alert.alert(
                    t('balance.error'), 
                    t('balance.enterValidAmount')
                  );
                }
              }
            }
          }
        ],
        'plain-text',
        ''
      );
    }
  };
  
  const handleWithdrawAmount = async (amount: number) => {
    // Check minimum withdrawal amount
    if (amount < 20) {
      Alert.alert(
        t('balance.error'), 
        t('balance.minimumWithdrawal')
      );
      return;
    }

    try {
      // TODO: Implement real withdrawal logic with API
      console.log(`Withdrawal amount: ${amount} AFc for driver`);
      
      Alert.alert(
        t('balance.success'), 
        t('balance.withdrawRequestSent', { amount })
      );
    } catch (error) {
      console.error('Error withdrawing balance:', error);
      Alert.alert(
        t('balance.error'), 
        t('balance.insufficientFunds')
      );
    }
  };
  
  const handleUseCashback = () => {
    // Mock cashback amount - TODO: Get from context
    const cashbackAmount = 50;
    
    if (cashbackAmount < 20) {
      Alert.alert(
        t('balance.insufficientFunds'),
        t('balance.minimumWithdrawal')
      );
      return;
    }
    
    Alert.alert(
      t('balance.useCashback'),
      t('balance.useCashbackConfirm'),
      [
        { text: t('balance.cancel'), style: 'cancel' },
        {
          text: t('balance.yes'),
          onPress: async () => {
            try {
              // TODO: Implement real cashback logic with API
              console.log(`Using cashback: ${cashbackAmount} AFc for client`);
              
              Alert.alert(
                t('balance.success'), 
                t('balance.cashbackAdded', { amount: cashbackAmount })
              );
            } catch (error) {
              console.error('Error using cashback:', error);
              Alert.alert(
                t('balance.error'), 
                t('balance.cashbackFailed')
              );
            }
          }
        }
      ]
    );
  };
  
  return {
    handleTopUp,
    handleWithdraw,
    handleUseCashback
  };
};
