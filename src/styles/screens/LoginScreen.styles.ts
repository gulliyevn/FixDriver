import { StyleSheet } from 'react-native';
import { SIZES, SHADOWS, getCurrentColors } from '../../constants/colors';

// Создаем функцию для получения стилей с учетом темы
export const createLoginScreenStyles = (isDark: boolean) => {
  const currentColors = getCurrentColors(isDark);
  
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentColors.background,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 20,
    },
    content: {
      flex: 1,
      padding: SIZES.xl,
      justifyContent: 'center',
    },
    header: {
      alignItems: 'center',
      marginBottom: SIZES.xxxl,
    },
    headerSpacer: {
      height: 40,
    },
    logo: {
      width: 120,
      height: 120,
      marginBottom: SIZES.xl,
      borderRadius: SIZES.radius.lg,
      ...(isDark ? SHADOWS.dark.medium : SHADOWS.light.medium),
    },
    title: {
      fontSize: SIZES.fontSize.title,
      fontWeight: '700',
      color: currentColors.text,
      marginBottom: SIZES.sm,
      textAlign: 'center',
      lineHeight: SIZES.lineHeight.title,
    },
    subtitle: {
      fontSize: SIZES.fontSize.lg,
      color: currentColors.textSecondary,
      textAlign: 'center',
      lineHeight: SIZES.lineHeight.lg,
    },
    form: {
      marginBottom: SIZES.xxl,
    },
    inputContainer: {
      marginBottom: SIZES.xl,
    },
    label: {
      fontSize: SIZES.fontSize.lg,
      fontWeight: '600',
      color: currentColors.text,
      marginBottom: SIZES.sm,
      lineHeight: SIZES.lineHeight.lg,
    },
    input: {
      marginBottom: SIZES.lg,
      backgroundColor: currentColors.surface,
      borderRadius: SIZES.radius.md,
      paddingHorizontal: SIZES.lg,
      paddingVertical: SIZES.md,
      fontSize: SIZES.fontSize.lg,
      color: currentColors.text,
      borderWidth: 1,
      borderColor: currentColors.border,
      minHeight: SIZES.inputHeight.md,
      ...(isDark ? SHADOWS.dark.small : SHADOWS.light.small),
    },
    inputFocused: {
      borderColor: currentColors.primary,
      borderWidth: 2,
      ...(isDark ? SHADOWS.dark.medium : SHADOWS.light.medium),
    },
    inputError: {
      borderColor: currentColors.error,
      borderWidth: 2,
    },
    errorText: {
      color: currentColors.error,
      fontSize: SIZES.fontSize.md,
      marginTop: SIZES.xs,
      lineHeight: SIZES.lineHeight.md,
    },
    loginButton: {
      marginBottom: SIZES.lg,
      backgroundColor: currentColors.primary,
      borderRadius: SIZES.radius.md,
      paddingVertical: SIZES.lg,
      alignItems: 'center',
      minHeight: SIZES.buttonHeight.md,
      ...(isDark ? SHADOWS.dark.medium : SHADOWS.light.medium),
    },
    loginButtonText: {
      color: currentColors.surface,
      fontSize: SIZES.fontSize.lg,
      fontWeight: '600',
      lineHeight: SIZES.lineHeight.lg,
    },
    loginButtonDisabled: {
      backgroundColor: currentColors.border,
      opacity: 0.6,
    },
    loginButtonPressed: {
      opacity: 0.8,
      transform: [{ scale: 0.98 }],
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: SIZES.xxl,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: currentColors.border,
    },
    dividerText: {
      marginHorizontal: SIZES.lg,
      fontSize: SIZES.fontSize.md,
      color: currentColors.textSecondary,
      lineHeight: SIZES.lineHeight.md,
    },
    socialButtons: {
      marginBottom: SIZES.xxxl,
    },
    registerSection: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 0,
      marginBottom: 0,
    },
    registerText: {
      color: currentColors.textSecondary,
      fontSize: SIZES.fontSize.md,
      lineHeight: SIZES.lineHeight.md,
      textAlign: 'center',
    },
    registerLink: {
      color: currentColors.primary,
      fontWeight: '600',
      marginLeft: SIZES.xs,
    },
    registerLinkUnderlineDark: {
      color: isDark ? '#60A5FA' : '#23408E',
      textDecorationLine: 'underline',
      fontWeight: '600',
      fontSize: SIZES.fontSize.md,
      textAlign: 'center',
      marginLeft: 0,
    },
    forgotPassword: {
      alignItems: 'center',
      marginBottom: SIZES.xxl,
    },
    forgotPasswordText: {
      fontSize: SIZES.fontSize.md,
      color: currentColors.primary,
      textDecorationLine: 'underline',
      lineHeight: SIZES.lineHeight.md,
    },
    footer: {
      alignItems: 'center',
      marginTop: SIZES.xl,
    },
    footerText: {
      fontSize: SIZES.fontSize.md,
      color: currentColors.textSecondary,
      textAlign: 'center',
      lineHeight: SIZES.lineHeight.md,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      marginLeft: SIZES.sm,
      fontSize: SIZES.fontSize.md,
      color: currentColors.textSecondary,
    },
    containerCompact: {
      padding: SIZES.lg,
    },
    headerCompact: {
      marginBottom: SIZES.xl,
    },
    logoCompact: {
      width: 80,
      height: 80,
      marginBottom: SIZES.lg,
    },
    titleCompact: {
      fontSize: SIZES.fontSize.xxxl,
      marginBottom: SIZES.xs,
    },
    socialAuth: {
      marginBottom: SIZES.xxxl,
    },
    registerLinkText: {
      color: currentColors.textSecondary,
      fontSize: SIZES.fontSize.md,
      lineHeight: SIZES.lineHeight.md,
    },
    quickLoginRow: {
      marginTop: 8,
      marginBottom: 16,
    },
    quickLoginButtonText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#fff',
    },
    quickLoginCardsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
      marginBottom: 16,
      gap: 12,
    },
    quickLoginCard: {
      flex: 1,
      backgroundColor: currentColors.surface,
      borderRadius: 20,
      paddingVertical: 24,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: currentColors.cardShadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 12,
      elevation: 4,
      borderWidth: 1,
      borderColor: isDark ? currentColors.border : 'rgba(0,0,0,0.04)',
    },
    quickLoginCardClient: {
      marginRight: 6,
      borderLeftWidth: 4,
      borderLeftColor: currentColors.success,
    },
    quickLoginCardDriver: {
      marginLeft: 6,
      borderLeftWidth: 4,
      borderLeftColor: currentColors.warning,
    },
    quickLoginCardText: {
      fontSize: SIZES.fontSize.md,
      fontWeight: '600',
      color: currentColors.text,
      marginTop: SIZES.sm,
    },
    backButton: {
      position: 'absolute',
      top: 50,
      left: 20,
      zIndex: 1000,
      backgroundColor: currentColors.surface,
      borderRadius: SIZES.radius.round,
      padding: SIZES.sm,
      ...(isDark ? SHADOWS.dark.small : SHADOWS.light.small),
    },
  });
};

// Для обратной совместимости
export const LoginScreenStyles = createLoginScreenStyles(false); 