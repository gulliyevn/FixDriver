import { StyleSheet } from 'react-native';
import { colors, SIZES, SHADOWS } from '../../constants/colors';

export const LoginScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
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
  logo: {
    width: 120,
    height: 120,
    marginBottom: SIZES.xl,
    borderRadius: SIZES.radius.lg,
    ...SHADOWS.light.medium,
  },
  title: {
    fontSize: SIZES.fontSize.title,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: SIZES.sm,
    textAlign: 'center',
    lineHeight: SIZES.lineHeight.title,
  },
  subtitle: {
    fontSize: SIZES.fontSize.lg,
    color: colors.light.textSecondary,
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
    color: colors.light.text,
    marginBottom: SIZES.sm,
    lineHeight: SIZES.lineHeight.lg,
  },
  input: {
    marginBottom: SIZES.lg,
    backgroundColor: colors.light.surface,
    borderRadius: SIZES.radius.md,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    fontSize: SIZES.fontSize.lg,
    color: colors.light.text,
    borderWidth: 1,
    borderColor: colors.light.border,
    minHeight: SIZES.inputHeight.md,
    ...SHADOWS.light.small,
  },
  inputFocused: {
    borderColor: colors.light.primary,
    borderWidth: 2,
    ...SHADOWS.light.medium,
  },
  inputError: {
    borderColor: colors.light.error,
    borderWidth: 2,
  },
  errorText: {
    color: colors.light.error,
    fontSize: SIZES.fontSize.md,
    marginTop: SIZES.xs,
    lineHeight: SIZES.lineHeight.md,
  },
  loginButton: {
    marginBottom: SIZES.lg,
    backgroundColor: colors.light.primary,
    borderRadius: SIZES.radius.md,
    paddingVertical: SIZES.lg,
    alignItems: 'center',
    minHeight: SIZES.buttonHeight.md,
    ...SHADOWS.light.medium,
  },
  loginButtonText: {
    color: colors.light.surface,
    fontSize: SIZES.fontSize.lg,
    fontWeight: '600',
    lineHeight: SIZES.lineHeight.lg,
  },
  loginButtonDisabled: {
    backgroundColor: colors.light.border,
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
    backgroundColor: colors.light.border,
  },
  dividerText: {
    marginHorizontal: SIZES.lg,
    fontSize: SIZES.fontSize.md,
    color: colors.light.textSecondary,
    lineHeight: SIZES.lineHeight.md,
  },
  socialButtons: {
    marginBottom: SIZES.xxxl,
  },
  registerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0, // убираю отступ сверху
    marginBottom: 0,
  },
  registerText: {
    color: colors.light.textSecondary,
    fontSize: SIZES.fontSize.md,
    lineHeight: SIZES.lineHeight.md,
    textAlign: 'center',
  },
  registerLink: {
    color: colors.light.primary,
    fontWeight: '600',
    marginLeft: SIZES.xs,
  },
  registerLinkUnderlineDark: {
    color: '#23408E',
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
    color: colors.light.primary,
    textDecorationLine: 'underline',
    lineHeight: SIZES.lineHeight.md,
  },
  footer: {
    alignItems: 'center',
    marginTop: SIZES.xl,
  },
  footerText: {
    fontSize: SIZES.fontSize.md,
    color: colors.light.textSecondary,
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
    color: colors.light.textSecondary,
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
    color: colors.light.textSecondary,
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
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  quickLoginCardClient: {
    marginRight: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  quickLoginCardDriver: {
    marginLeft: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  quickLoginCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  // Стили для кнопок автозаполнения (только для разработки)
  autoFillContainer: {
    marginTop: SIZES.lg,
    padding: SIZES.md,
    backgroundColor: colors.light.surface,
    borderRadius: SIZES.radius.md,
    borderWidth: 1,
    borderColor: colors.light.border,
    ...SHADOWS.light.small,
  },
  autoFillTitle: {
    fontSize: SIZES.fontSize.sm,
    color: colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: SIZES.sm,
    fontWeight: '500',
  },
  autoFillButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: SIZES.sm,
  },
  autoFillButton: {
    flex: 1,
    backgroundColor: colors.light.primary,
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.md,
    borderRadius: SIZES.radius.sm,
    alignItems: 'center',
    ...SHADOWS.light.small,
  },
  autoFillButtonText: {
    color: colors.light.surface,
    fontSize: SIZES.fontSize.sm,
    fontWeight: '600',
  },
  headerSpacer: {
    height: 32,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 10,
    zIndex: 2,
  },
}); 