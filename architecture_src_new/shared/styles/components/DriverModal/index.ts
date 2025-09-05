import { StyleSheet } from 'react-native';
import { getCurrentColors, SHADOWS, SIZES } from '../../../constants/colors';

// Импорты стилей
import { createModalStyles } from './modal/Modal.styles';
import { createCallSheetStyles } from './modal/CallSheet.styles';
import { createHeaderStyles } from './header/Header.styles';
import { createAvatarStyles } from './header/Avatar.styles';
import { createSliderStyles } from './header/Slider.styles';
import { createInfoBarStyles } from './content/InfoBar.styles';
import { createTripsStyles } from './content/Trips.styles';
import { createButtonsStyles } from './content/Buttons.styles';
import { createDialogsStyles } from './dialogs/Dialogs.styles';
import { createRatingStyles } from './dialogs/Rating.styles';

export const createDriverModalStyles = (isDark: boolean, role: 'client' | 'driver' = 'client') => {
  // Создаем все стили
  const modalStyles = createModalStyles(isDark);
  const callSheetStyles = createCallSheetStyles(isDark);
  const headerStyles = createHeaderStyles(isDark, role);
  const avatarStyles = createAvatarStyles(isDark, role);
  const sliderStyles = createSliderStyles(isDark);
  const infoBarStyles = createInfoBarStyles(isDark);
  const tripsStyles = createTripsStyles(isDark);
  const buttonsStyles = createButtonsStyles(isDark);
  const dialogsStyles = createDialogsStyles(isDark);
  const ratingStyles = createRatingStyles(isDark);

  // Объединяем все стили
  return StyleSheet.create({
    // Modal styles
    ...modalStyles,
    
    // Call sheet styles
    ...callSheetStyles,
    
    // Header styles
    ...headerStyles,
    
    // Avatar styles
    ...avatarStyles,
    
    // Slider styles
    ...sliderStyles,
    
    // Info bar styles
    ...infoBarStyles,
    
    // Trips styles
    ...tripsStyles,
    
    // Buttons styles
    ...buttonsStyles,
    
    // Dialogs styles
    ...dialogsStyles,
    
    // Rating styles
    ...ratingStyles,
  });
};

// Экспортируем отдельные функции для использования в других компонентах
export { createModalStyles } from './modal/Modal.styles';
export { createCallSheetStyles } from './modal/CallSheet.styles';
export { createHeaderStyles } from './header/Header.styles';
export { createAvatarStyles } from './header/Avatar.styles';
export { createSliderStyles } from './header/Slider.styles';
export { createInfoBarStyles } from './content/InfoBar.styles';
export { createTripsStyles } from './content/Trips.styles';
export { createButtonsStyles } from './content/Buttons.styles';
export { createDialogsStyles } from './dialogs/Dialogs.styles';
export { createRatingStyles } from './dialogs/Rating.styles';
