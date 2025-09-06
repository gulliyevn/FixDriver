import { StyleSheet } from 'react-native';
import { SIZES, SHADOWS, getColors } from '../../../shared/constants/adaptiveConstants';

const colors = getColors(false);

export const ResetPasswordScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    marginRight: SIZES.xs,
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
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    backgroundColor: colors.inputBackground,
    borderRadius: SIZES.radius.md,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    paddingRight: 60,
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
  submitButton: {
    marginTop: SIZES.lg,
  },
});


