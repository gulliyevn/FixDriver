import { StyleSheet } from "react-native";
import { colors, SIZES, SHADOWS } from "../../constants/colors";

export const AppCardStyles = StyleSheet.create({
  // ===== ОСНОВНОЙ КОНТЕЙНЕР =====
  container: {
    backgroundColor: colors.light.card,
    borderRadius: SIZES.radius.md,
    padding: SIZES.lg,
    marginBottom: SIZES.md,
    ...SHADOWS.light.medium,
  },

  // ===== ВАРИАНТЫ КАРТОЧЕК =====
  cardPrimary: {
    backgroundColor: colors.light.primary,
  },
  cardSecondary: {
    backgroundColor: colors.light.secondary,
  },
  cardSuccess: {
    backgroundColor: colors.light.success,
  },
  cardWarning: {
    backgroundColor: colors.light.warning,
  },
  cardError: {
    backgroundColor: colors.light.error,
  },
  cardOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.light.border,
  },

  // ===== РАЗМЕРЫ КАРТОЧЕК =====
  cardSmall: {
    padding: SIZES.md,
    marginBottom: SIZES.sm,
  },
  cardLarge: {
    padding: SIZES.xl,
    marginBottom: SIZES.lg,
  },

  // ===== СОСТОЯНИЯ КАРТОЧЕК =====
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  cardDisabled: {
    opacity: 0.5,
  },
  cardLoading: {
    opacity: 0.7,
  },

  // ===== СТИЛИ СОДЕРЖИМОГО =====
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SIZES.md,
  },
  title: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: "600",
    color: colors.light.text,
    lineHeight: SIZES.lineHeight.lg,
  },
  titlePrimary: {
    color: colors.light.surface,
  },
  subtitle: {
    fontSize: SIZES.fontSize.md,
    color: colors.light.textSecondary,
    marginTop: SIZES.xs,
    lineHeight: SIZES.lineHeight.md,
  },
  subtitlePrimary: {
    color: colors.light.surface,
    opacity: 0.8,
  },

  // ===== СТИЛИ ИКОНОК =====
  icon: {
    width: SIZES.icon.lg,
    height: SIZES.icon.lg,
    marginRight: SIZES.sm,
  },
  iconRight: {
    marginRight: 0,
    marginLeft: SIZES.sm,
  },
  iconSmall: {
    width: SIZES.icon.md,
    height: SIZES.icon.md,
  },
  iconLarge: {
    width: SIZES.icon.xl,
    height: SIZES.icon.xl,
  },

  // ===== СТИЛИ ДЕЙСТВИЙ =====
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: SIZES.md,
    gap: SIZES.sm,
  },
  actionButton: {
    padding: SIZES.sm,
    borderRadius: SIZES.radius.sm,
    backgroundColor: colors.light.surface,
  },
  actionButtonPrimary: {
    backgroundColor: colors.light.surface,
  },

  // ===== ДОПОЛНИТЕЛЬНЫЕ СТИЛИ =====
  cardRounded: {
    borderRadius: SIZES.radius.round,
  },
  cardWithBorder: {
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  cardWithShadow: {
    ...SHADOWS.light.large,
  },
  cardInteractive: {
    ...SHADOWS.light.medium,
  },
  cardInteractivePressed: {
    ...SHADOWS.light.small,
  },
  containerPrimary: {
    backgroundColor: colors.light.primary,
  },
  containerSecondary: {
    backgroundColor: colors.light.secondary,
  },
  containerDisabled: {
    opacity: 0.5,
  },
  iconPrimary: {
    color: colors.light.surface,
  },
  textContainer: {
    flex: 1,
  },
});
