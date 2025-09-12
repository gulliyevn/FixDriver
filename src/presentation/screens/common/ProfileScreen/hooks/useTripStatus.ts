/**
 * useTripStatus hook
 * Manages trip status colors, icons, and text
 */

import { useLanguage } from '../../../context/LanguageContext';
import { lightColors, darkColors } from '../../../../../shared/constants/colors';
import { useTheme } from '../../../context/ThemeContext';

export const useTripStatus = () => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const currentColors = isDark ? darkColors : lightColors;

  const getTripIcon = (type: string) => {
    switch (type) {
      case 'completed':
        return 'checkmark-circle';
      case 'cancelled':
        return 'close-circle';
      case 'scheduled':
        return 'time';
      default:
        return 'car';
    }
  };

  const getTripColor = (type: string) => {
    switch (type) {
      case 'completed':
        return currentColors.success || '#4caf50';
      case 'cancelled':
        return currentColors.error || '#e53935';
      case 'scheduled':
        return currentColors.warning || '#2196f3';
      default:
        return currentColors.primary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return currentColors.success || '#4caf50';
      case 'cancelled':
        return currentColors.error || '#e53935';
      case 'scheduled':
        return currentColors.warning || '#2196f3';
      default:
        return currentColors.textSecondary || '#888';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return t('trips.status.completed');
      case 'cancelled':
        return t('trips.status.cancelled');
      case 'scheduled':
        return t('trips.status.scheduled');
      default:
        return t('trips.status.unknown');
    }
  };

  return {
    getTripIcon,
    getTripColor,
    getStatusColor,
    getStatusText
  };
};
