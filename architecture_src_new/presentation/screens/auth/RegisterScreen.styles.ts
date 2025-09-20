import { StyleSheet } from 'react-native';
import { SIZES, SHADOWS, getColors } from '../../../shared/constants/adaptiveConstants';

const colors = getColors(false); // Light theme for now

export const RegisterScreenStyles = StyleSheet.create({
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
    paddingLeft: 16,
    paddingRight: 10,
    paddingTop: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.lg,
    paddingTop: SIZES.md,
  },
  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.md,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: SIZES.fontSize.title,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 0,
    lineHeight: SIZES.lineHeight.title,
  },
  subtitle: {
    fontSize: SIZES.fontSize.lg,
    color: colors.textSecondary,
    lineHeight: SIZES.lineHeight.lg,
  },
  form: {
    marginBottom: SIZES.xxl,
  },
  row: {
    flexDirection: 'row',
    gap: SIZES.md,
  },
  inputContainer: {
    marginBottom: SIZES.xl,
  },
  halfWidth: {
    flex: 1,
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
  agreementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.xl,
    paddingHorizontal: 0,
  },
  checkbox: {
    marginRight: SIZES.md,
    marginTop: 0,
    padding: SIZES.sm,
  },
  agreementTextContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  agreementText: {
    fontSize: SIZES.fontSize.md,
    color: colors.textSecondary,
    lineHeight: SIZES.lineHeight.md,
  },
  agreementLink: {
    fontSize: SIZES.fontSize.md,
    color: colors.primary,
    textDecorationLine: 'underline',
    lineHeight: SIZES.lineHeight.md,
  },
  registerButton: {
    marginBottom: SIZES.md,
  },
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  loginText: {
    fontSize: SIZES.fontSize.md,
    color: colors.textSecondary,
  },
  loginLink: {
    fontSize: SIZES.fontSize.md,
    color: colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  langWrap: {
    alignItems: 'center',
  },
});
