import { StyleSheet } from 'react-native';
import { colors, SIZES, SHADOWS } from '../../constants/colors';

export const AppAvatarStyles = StyleSheet.create({
  // ===== ОСНОВНОЙ КОНТЕЙНЕР =====
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.light.surface,
    borderWidth: 2,
    borderColor: colors.light.border,
    ...SHADOWS.light.small,
  },
  
  // ===== РАЗМЕРЫ АВАТАРОВ =====
  sizeSmall: {
    width: SIZES.icon.lg,
    height: SIZES.icon.lg,
    borderRadius: SIZES.icon.lg / 2,
  },
  sizeMedium: {
    width: SIZES.icon.xl,
    height: SIZES.icon.xl,
    borderRadius: SIZES.icon.xl / 2,
  },
  sizeLarge: {
    width: SIZES.icon.xxl,
    height: SIZES.icon.xxl,
    borderRadius: SIZES.icon.xxl / 2,
  },
  sizeXLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  
  // ===== ВАРИАНТЫ АВАТАРОВ =====
  avatarPrimary: {
    backgroundColor: colors.light.primary,
    borderColor: colors.light.primary,
  },
  avatarSecondary: {
    backgroundColor: colors.light.secondary,
    borderColor: colors.light.secondary,
  },
  avatarSuccess: {
    backgroundColor: colors.light.success,
    borderColor: colors.light.success,
  },
  avatarWarning: {
    backgroundColor: colors.light.warning,
    borderColor: colors.light.warning,
  },
  avatarError: {
    backgroundColor: colors.light.error,
    borderColor: colors.light.error,
  },
  avatarOutline: {
    backgroundColor: 'transparent',
    borderColor: colors.light.primary,
  },
  
  // ===== СТИЛИ ИЗОБРАЖЕНИЯ =====
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  imageSmall: {
    borderRadius: SIZES.icon.lg / 2,
  },
  imageMedium: {
    borderRadius: SIZES.icon.xl / 2,
  },
  imageLarge: {
    borderRadius: SIZES.icon.xxl / 2,
  },
  imageXLarge: {
    borderRadius: 40,
  },
  
  // ===== СТИЛИ ТЕКСТА =====
  text: {
    color: colors.light.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  textSmall: {
    fontSize: SIZES.fontSize.sm,
    lineHeight: SIZES.lineHeight.sm,
  },
  textMedium: {
    fontSize: SIZES.fontSize.md,
    lineHeight: SIZES.lineHeight.md,
  },
  textLarge: {
    fontSize: SIZES.fontSize.lg,
    lineHeight: SIZES.lineHeight.lg,
  },
  textXLarge: {
    fontSize: SIZES.fontSize.xl,
    lineHeight: SIZES.lineHeight.xl,
  },
  textPrimary: {
    color: colors.light.surface,
  },
  
  // ===== СТИЛИ СТАТУСА =====
  statusContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: colors.light.surface,
    borderRadius: 50,
  },
  statusOnline: {
    backgroundColor: colors.light.success,
  },
  statusOffline: {
    backgroundColor: colors.light.textSecondary,
  },
  statusBusy: {
    backgroundColor: colors.light.warning,
  },
  statusAway: {
    backgroundColor: colors.light.error,
  },
  statusSmall: {
    width: 8,
    height: 8,
  },
  statusMedium: {
    width: 10,
    height: 10,
  },
  statusLarge: {
    width: 12,
    height: 12,
  },
  statusXLarge: {
    width: 16,
    height: 16,
  },
  
  // ===== СОСТОЯНИЯ АВАТАРА =====
  avatarPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  avatarDisabled: {
    opacity: 0.5,
  },
  avatarLoading: {
    opacity: 0.7,
  },
  
  // ===== ДОПОЛНИТЕЛЬНЫЕ СТИЛИ =====
  avatarRounded: {
    borderRadius: SIZES.radius.round,
  },
  avatarWithShadow: {
    ...SHADOWS.light.medium,
  },
  avatarWithBorder: {
    borderWidth: 3,
  },
  avatarInteractive: {
    ...SHADOWS.light.small,
  },
  avatarInteractivePressed: {
    ...SHADOWS.light.medium,
  },
  
  // ===== СТИЛИ ГРУППЫ АВАТАРОВ =====
  groupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupAvatar: {
    marginLeft: -SIZES.sm,
  },
  groupAvatarFirst: {
    marginLeft: 0,
  },
  groupOverlay: {
    backgroundColor: colors.light.surface,
    borderWidth: 2,
    borderColor: colors.light.border,
  },
}); 