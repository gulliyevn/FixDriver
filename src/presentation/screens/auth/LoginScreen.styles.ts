import { StyleSheet } from 'react-native';
import { SIZES, SHADOWS, getColors } from '../../../shared/constants/adaptiveConstants';

const colors = getColors(false); // Light theme for now

export const LoginScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  headerSpacer: {
    height: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.xxxl,
  },
  title: {
    fontSize: SIZES.fontSize.title,
    fontWeight: '700',
    color: colors.text,
    marginBottom: SIZES.sm,
    textAlign: 'center',
    lineHeight: SIZES.lineHeight.title,
  },
  subtitle: {
    fontSize: SIZES.fontSize.lg,
    color: colors.textSecondary,
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
    color: colors.text,
    marginBottom: SIZES.sm,
    lineHeight: SIZES.lineHeight.lg,
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: SIZES.radius.md,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    fontSize: SIZES.fontSize.lg,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: SIZES.inputHeight.md,
    ...SHADOWS.light.small,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    backgroundColor: colors.inputBackground,
    borderRadius: SIZES.radius.md,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    paddingRight: 60, // Space for eye button
    fontSize: SIZES.fontSize.lg,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: SIZES.inputHeight.md,
    ...SHADOWS.light.small,
  },
  eyeButton: {
    position: 'absolute',
    right: SIZES.md,
    top: '50%',
    transform: [{ translateY: -16 }],
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: SIZES.radius.sm,
    borderWidth: 0,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 2,
  },
  errorText: {
    color: colors.error,
    fontSize: SIZES.fontSize.md,
    marginTop: SIZES.xs,
    lineHeight: SIZES.lineHeight.md,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SIZES.xl,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: SIZES.fontSize.md,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  loginButton: {
    marginBottom: SIZES.xl,
  },
  quickLoginContainer: {
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  quickLoginText: {
    fontSize: SIZES.fontSize.md,
    color: colors.textSecondary,
    marginBottom: SIZES.sm,
  },
  quickLoginButtons: {
    flexDirection: 'row',
    gap: SIZES.md,
  },
  quickLoginButton: {
    backgroundColor: colors.surface,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...SHADOWS.light.small,
  },
  quickLoginButtonText: {
    color: colors.text,
    fontSize: SIZES.fontSize.md,
    fontWeight: '500',
  },

  registerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  registerText: {
    fontSize: SIZES.fontSize.md,
    color: colors.textSecondary,
  },
  registerLink: {
    fontSize: SIZES.fontSize.md,
    color: colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  langWrap: {
    alignItems: 'center',
  },
});
