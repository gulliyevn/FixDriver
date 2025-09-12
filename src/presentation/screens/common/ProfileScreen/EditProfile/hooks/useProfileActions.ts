import { useCallback } from 'react';
import { Alert, Animated } from 'react-native';
import { useAuth } from '../../../../../../context/AuthContext';
import { useI18n } from '../../../../../../shared/hooks/useI18n';
import { handleCirclePress, handleDriverCirclePress } from '../../../../../../shared/utils/profileHelpers';

/**
 * Profile Actions Hook
 * 
 * Handles profile-related actions and navigation
 */

interface UseProfileActionsParams {
  navigation: any;
  isEditingPersonalInfo: boolean;
  checkHasChanges: () => boolean;
  validatePersonalInfo: () => { isValid: boolean; errors: string[] };
  formData: any;
  originalDataRef: React.MutableRefObject<any>;
  setIsEditingPersonalInfo: (editing: boolean) => void;
  updateProfile: (data: any) => Promise<boolean>;
  rotateAnim: Animated.Value;
}

export const useProfileActions = ({
  navigation,
  isEditingPersonalInfo,
  checkHasChanges,
  validatePersonalInfo,
  formData,
  originalDataRef,
  setIsEditingPersonalInfo,
  updateProfile,
  rotateAnim
}: UseProfileActionsParams) => {
  const { t } = useI18n();
  const { login, changeRole } = useAuth();

  const handleSaveProfile = async (): Promise<boolean> => {
    try {
      const hasFormChanges = checkHasChanges();

      if (hasFormChanges) {
        const validation = validatePersonalInfo();
        if (!validation.isValid) {
          Alert.alert(
            t('profile.validation.title'),
            validation.errors.join('\n'),
            [{ text: t('common.ok'), style: 'default' }]
          );
          return false;
        }

        const updateData: any = {};
        
        if (hasFormChanges) {
          updateData.name = formData.firstName.trim();
          updateData.surname = formData.lastName.trim();
          updateData.phone = formData.phone.trim();
          updateData.email = formData.email.trim();
        }

        const success = await updateProfile(updateData);

        if (success) {
          Alert.alert(
            t('profile.profileUpdateSuccess.title'),
            t('profile.profileUpdateSuccess.message')
          );
          setIsEditingPersonalInfo(false);
          originalDataRef.current = { ...formData };
          return true;
        } else {
          Alert.alert(
            t('profile.profileUpdateError.title'),
            t('profile.profileUpdateError.message')
          );
          return false;
        }
      } else {
        setIsEditingPersonalInfo(false);
        return true;
      }
    } catch (error) {
      Alert.alert(
        t('profile.profileUpdateGeneralError.title'),
        t('profile.profileUpdateGeneralError.message')
      );
      return false;
    }
  };

  const handleBackPress = useCallback(() => {
    const hasPersonalChanges = isEditingPersonalInfo && checkHasChanges();
    
    if (hasPersonalChanges) {
      Alert.alert(
        t('profile.saveChangesConfirm.title'),
        t('profile.saveChangesConfirm.message'),
        [
          { 
            text: t('profile.saveChangesConfirm.cancel'), 
            style: 'cancel',
            onPress: () => navigation.goBack()
          },
          { 
            text: t('profile.saveChangesConfirm.save'), 
            onPress: async () => {
              const success = await handleSaveProfile();
              if (success) {
                navigation.goBack();
              }
            }
          }
        ]
      );
    } else {
      navigation.goBack();
    }
  }, [isEditingPersonalInfo, checkHasChanges, handleSaveProfile, navigation, t]);

  const handleCirclePressAction = () => {
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      rotateAnim.setValue(0);
      
      // Use appropriate handler based on user role
      const user = { role: 'client' }; // This should come from auth context
      if (user.role === 'driver') {
        handleDriverCirclePress(navigation, login, t, changeRole);
      } else {
        handleCirclePress(navigation, login, t, changeRole);
      }
    });
  };

  return {
    handleBackPress,
    handleSaveProfile,
    handleCirclePressAction,
  };
};
