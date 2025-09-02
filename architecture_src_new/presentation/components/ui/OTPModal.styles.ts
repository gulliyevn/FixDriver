import { StyleSheet } from 'react-native';
import { SIZES, SHADOWS, getColors } from '../../../shared/constants/adaptiveConstants';

const colors = getColors(false);

export const OTPModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '88%',
    borderRadius: SIZES.radius.lg,
    backgroundColor: colors.surface,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    minHeight: 220,
    borderWidth: 1,
    borderColor: colors.border,
    ...SHADOWS.light.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: SIZES.fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: SIZES.xs,
  },
  subtitle: {
    fontSize: SIZES.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: SIZES.lg,
  },
  inputsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SIZES.lg,
  },
  inputBox: {
    width: 52,
    height: 56,
    borderRadius: SIZES.radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBackground,
    textAlign: 'center',
    fontSize: 22,
    color: colors.text,
    marginHorizontal: 4,
    ...SHADOWS.light.small,
  },
  inputBoxFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.surface,
    ...SHADOWS.light.medium,
  },
  inputBoxError: {
    borderColor: colors.error,
    borderWidth: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SIZES.xs,
  },
})


