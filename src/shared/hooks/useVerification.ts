import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useLanguage } from '../../presentation/context/LanguageContext';
import { verificationOperations, VerificationStatus, IsVerifying } from '../../domain/usecases/verification/verificationOperations';

/**
 * Hook for managing verification status
 * Provides email and phone verification functionality
 */
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

  /**
   * Save verification status
   */
  const saveVerificationStatus = useCallback(async (type: 'email' | 'phone', status: boolean) => {
    try {
      await verificationOperations.saveVerificationStatus(type, status);
    } catch (error) {
      // Error saving verification status
    }
  }, []);

  /**
   * Load verification status
   */
  const loadVerificationStatus = useCallback(async () => {
    try {
      const status = await verificationOperations.loadVerificationStatus();
      setVerificationStatus(status);
    } catch (error) {
      // Error loading verification status
    }
  }, []);

  /**
   * Reset verification status
   */
  const resetVerificationStatus = useCallback(async (type: 'email' | 'phone') => {
    try {
      await verificationOperations.resetVerificationStatus(type);
      setVerificationStatus(prev => ({ ...prev, [type]: false }));
    } catch (error) {
      // Error resetting verification status
    }
  }, []);

  /**
   * Generic verification function
   */
  const performVerification = useCallback((type: 'email' | 'phone') => {
    const isEmail = type === 'email';
    const codeSentTitle = t(isEmail ? 'profile.verifyEmail.success.title' : 'profile.verifyPhone.success.title');
    const codeSentMessage = t(isEmail ? 'profile.verifyEmail.success.message' : 'profile.verifyPhone.success.message');
    const cancelText = t('common.cancel');
    const verifyText = t('common.verify');
    const successTitle = t('common.success');
    const successMessage = t(isEmail ? 'profile.verifyEmail.emailVerifiedSuccess' : 'profile.verifyPhone.phoneVerifiedSuccess');
    const errorTitle = t(isEmail ? 'profile.verifyEmail.error.title' : 'profile.verifyPhone.error.title');
    const errorMessage = t(isEmail ? 'profile.verifyEmail.error.message' : 'profile.verifyPhone.error.message');
    const enterCodeMessage = t(isEmail ? 'profile.verificationModal.enterEmailCode' : 'profile.verificationModal.enterSmsCode');

    // First show "Code sent"
    Alert.alert(
      codeSentTitle,
      codeSentMessage,
      [
        { text: cancelText, style: 'cancel' },
        {
          text: verifyText,
          onPress: () => {
            // Then show code input field
            Alert.prompt(
              t('profile.verificationModal.enterCode'),
              enterCodeMessage,
              [
                { text: cancelText, style: 'cancel' },
                {
                  text: verifyText,
                  onPress: async (code) => {
                    if (verificationOperations.validateCode(code)) {
                      setIsVerifying(prev => ({ ...prev, [type]: true }));
                      setTimeout(() => {
                        setVerificationStatus(prev => ({ ...prev, [type]: true }));
                        setIsVerifying(prev => ({ ...prev, [type]: false }));
                        saveVerificationStatus(type, true);
                        Alert.alert(successTitle, successMessage);
                      }, verificationOperations.getVerificationTimeout());
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

  /**
   * Verify email
   */
  const verifyEmail = useCallback(() => {
    performVerification('email');
  }, [performVerification]);

  /**
   * Verify phone
   */
  const verifyPhone = useCallback(() => {
    performVerification('phone');
  }, [performVerification]);

  return {
    verificationStatus,
    isVerifying,
    loadVerificationStatus,
    resetVerificationStatus,
    verifyEmail,
    verifyPhone,
  };
};