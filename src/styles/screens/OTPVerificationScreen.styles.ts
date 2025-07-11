import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const OTPVerificationScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  containerDark: {
    backgroundColor: colors.dark.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
    zIndex: 1,
    padding: 8,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoText: {
    fontSize: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  titleDark: {
    color: colors.dark.text,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  subtitleDark: {
    color: colors.dark.textSecondary,
  },
  phoneNumber: {
    fontWeight: '600',
    fontSize: 17,
  },
  phoneNumberDark: {
    color: colors.dark.primary,
  },
  otpContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  otpInputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '600',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  otpInputDark: {
    borderColor: colors.dark.border,
    color: colors.dark.text,
    backgroundColor: colors.dark.surface,
  },
  otpInputFocused: {
    borderColor: colors.light.primary,
  },
  otpInputFocusedDark: {
    borderColor: colors.dark.primary,
  },
  otpInputError: {
    borderColor: colors.light.error,
  },
  otpInputErrorDark: {
    borderColor: colors.dark.error,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    marginLeft: 6,
    textAlign: 'center',
  },
  errorTextDark: {
    color: colors.dark.error,
  },
  actionsContainer: {
    paddingHorizontal: 20,
  },
  verifyButton: {
    marginBottom: 24,
  },
  verifyButtonDisabled: {
    backgroundColor: colors.light.border,
  },
  verifyButtonText: {
    color: colors.light.background,
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  resendTextDark: {
    color: colors.dark.textSecondary,
  },
  timerText: {
    fontSize: 14,
    textAlign: 'center',
  },
  timerTextDark: {
    color: colors.dark.primary,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resendButtonText: {
    fontSize: 14,
    color: colors.light.primary,
    fontWeight: '600',
  },
  resendButtonTextDark: {
    color: colors.dark.primary,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  changeNumberButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  changeNumberText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  devButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
  },
  devButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.light.textSecondary,
  },
  footerTextDark: {
    color: colors.dark.textSecondary,
  },
  helpLink: {
    color: colors.light.primary,
    fontWeight: '600',
  },
  helpLinkDark: {
    color: colors.dark.primary,
  },
  otpLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
}); 