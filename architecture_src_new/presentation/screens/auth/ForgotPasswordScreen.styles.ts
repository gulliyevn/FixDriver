import { StyleSheet } from 'react-native';
import { SIZES, SHADOWS, getColors } from '../../../shared/constants/adaptiveConstants';

const colors = getColors(false);

export const ForgotPasswordScreenStyles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SIZES.xl,
    paddingVertical: SIZES.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.xxxl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.xxxl,
  },
  headerBackButton: {
    paddingHorizontal: 0,
    paddingVertical: SIZES.xs,
    marginRight: 0,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
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
  submitButton: {
    marginBottom: SIZES.lg,
  },
  backButton: {
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: SIZES.fontSize.md,
    color: colors.primary,
    textDecorationLine: 'underline',
    lineHeight: SIZES.lineHeight.md,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: SIZES.xxl,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.lg,
  },
  successTitle: {
    fontSize: SIZES.fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: SIZES.sm,
    textAlign: 'center',
  },
  successText: {
    fontSize: SIZES.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: SIZES.lineHeight.md,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    borderRadius: SIZES.radius.md,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    marginTop: SIZES.lg + 100,
    width: '85%',
    alignSelf: 'center',
    ...SHADOWS.light.medium,
  },
  supportIcon: {
    marginRight: SIZES.sm,
  },
  supportText: {
    color: '#FFFFFF',
    fontSize: SIZES.fontSize.md,
    fontWeight: '600',
  },
});


