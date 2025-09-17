import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../context/LanguageContext';

interface VerificationStatus {
  email: boolean;
  phone: boolean;
}

interface IsVerifying {
  email: boolean;
  phone: boolean;
}

export const useVerification = () => {
  const { t } = useLanguage();
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({
    email: false,
    phone: false,
  });
  const [isVerifying, setIsVerifying] = useState<IsVerifying>({
    email: false,
    phone: false,
  });

  const saveVerificationStatus = useCallback(async (type: 'email' | 'phone', status: boolean) => {
    try {
      await AsyncStorage.setItem(`verification_${type}`, JSON.stringify(status));
    } catch (error) {
      // Error saving verification status
    }
  }, []);

  const loadVerificationStatus = useCallback(async () => {
    try {
      const emailVerified = await AsyncStorage.getItem('verification_email');
      const phoneVerified = await AsyncStorage.getItem('verification_phone');
      
      const status = {
        email: emailVerified ? JSON.parse(emailVerified) : false,
        phone: phoneVerified ? JSON.parse(phoneVerified) : false,
      };
      setVerificationStatus(status);
    } catch (error) {
      // Error loading verification status
    }
  }, []);

  const resetVerificationStatus = useCallback(async (type: 'email' | 'phone') => {
    try {
      await AsyncStorage.removeItem(`verification_${type}`);
      setVerificationStatus(prev => ({ ...prev, [type]: false }));
    } catch (error) {
      // Error resetting verification status
    }
  }, []);

  const verifyEmail = useCallback(() => {
    const codeSentTitle = t('profile.verifyEmail.success.title');
    const codeSentMessage = t('profile.verifyEmail.success.message');
    const cancelText = t('common.cancel');
    const verifyText = t('common.verify');
    const successTitle = t('common.success');
    const successMessage = t('profile.verifyEmail.emailVerifiedSuccess');
    const errorTitle = t('profile.verifyEmail.error.title');
    const errorMessage = t('profile.verifyEmail.error.message');

    // Сначала показываем "Код отправлен"
    Alert.alert(
      codeSentTitle,
      codeSentMessage,
      [
        { text: cancelText, style: 'cancel' },
        {
          text: verifyText,
          onPress: () => {
            // Затем показываем поле ввода кода
            Alert.prompt(
              t('profile.verificationModal.enterCode'),
              t('profile.verificationModal.enterEmailCode'),
              [
                { text: cancelText, style: 'cancel' },
                {
                  text: verifyText,
                  onPress: async (code) => {
                    if (code === '1234') {
                      setIsVerifying(prev => ({ ...prev, email: true }));
                      setTimeout(() => {
                        setVerificationStatus(prev => ({ ...prev, email: true }));
                        setIsVerifying(prev => ({ ...prev, email: false }));
                        saveVerificationStatus('email', true);
                        Alert.alert(successTitle, successMessage);
                      }, 1000);
                    } else {
                      Alert.alert(errorTitle, errorMessage);
                    }
                  }
                }
              ],
              'plain-text'
            );
          }
        }
      ]
    );
  }, [t, saveVerificationStatus]);

  const verifyPhone = useCallback(() => {
    const codeSentTitle = t('profile.verifyPhone.success.title');
    const codeSentMessage = t('profile.verifyPhone.success.message');
    const cancelText = t('common.cancel');
    const verifyText = t('common.verify');
    const successTitle = t('common.success');
    const successMessage = t('profile.verifyPhone.phoneVerifiedSuccess');
    const errorTitle = t('profile.verifyPhone.error.title');
    const errorMessage = t('profile.verifyPhone.error.message');

    // Сначала показываем "Код отправлен"
    Alert.alert(
      codeSentTitle,
      codeSentMessage,
      [
        { text: cancelText, style: 'cancel' },
        {
          text: verifyText,
          onPress: () => {
            // Затем показываем поле ввода кода
            Alert.prompt(
              t('profile.verificationModal.enterCode'),
              t('profile.verificationModal.enterSmsCode'),
              [
                { text: cancelText, style: 'cancel' },
                {
                  text: verifyText,
                  onPress: async (code) => {
                    if (code === '1234') {
                      setIsVerifying(prev => ({ ...prev, phone: true }));
                      setTimeout(() => {
                        setVerificationStatus(prev => ({ ...prev, phone: true }));
                        setIsVerifying(prev => ({ ...prev, phone: false }));
                        saveVerificationStatus('phone', true);
                        Alert.alert(successTitle, successMessage);
                      }, 1000);
                    } else {
                      Alert.alert(errorTitle, errorMessage);
                    }
                  }
                }
              ],
              'plain-text'
            );
          }
        }
      ]
    );
  }, [t, saveVerificationStatus]);

  return {
    verificationStatus,
    isVerifying,
    loadVerificationStatus,
    resetVerificationStatus,
    verifyEmail,
    verifyPhone,
  };
}; 