import { useI18n } from '../../../../../shared/hooks/useI18n';

/**
 * Support Actions Hook
 * 
 * Manages support-related actions and navigation
 */

interface UseSupportActionsParams {
  handleClose: () => void;
  navigation: { goBack: () => void };
}

export const useSupportActions = ({
  handleClose,
  navigation
}: UseSupportActionsParams) => {

  const handleCloseChat = () => {
    handleClose();
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return {
    handleCloseChat,
    handleBack
  };
};
