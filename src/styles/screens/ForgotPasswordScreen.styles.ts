import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const ForgotPasswordScreenStyles = StyleSheet.create({
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
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: -60,
    left: 0,
    padding: 5,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainerDark: {
    backgroundColor: colors.dark.surface,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  titleDark: {
    color: colors.dark.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  subtitleDark: {
    color: colors.dark.textSecondary,
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  inputContainerDark: {
    backgroundColor: colors.dark.surface,
    borderColor: colors.dark.border,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.light.text,
  },
  inputDark: {
    color: colors.dark.text,
  },
  sendButton: {
    backgroundColor: colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  sendButtonDisabled: {
    backgroundColor: colors.light.border,
  },
  sendButtonSuccess: {
    backgroundColor: colors.light.success,
  },
  sendButtonText: {
    color: colors.light.background,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  successMessage: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.light.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.light.success,
  },
  successMessageDark: {
    backgroundColor: colors.dark.surface,
    borderColor: colors.dark.success,
  },
  successText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.light.success,
    marginTop: 8,
    marginBottom: 4,
  },
  successTextDark: {
    color: colors.dark.success,
  },
  successSubtext: {
    fontSize: 14,
    color: colors.light.textSecondary,
    textAlign: 'center',
  },
  successSubtextDark: {
    color: colors.dark.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  footerText: {
    fontSize: 14,
    color: colors.light.textSecondary,
  },
  footerTextDark: {
    color: colors.dark.textSecondary,
  },
  linkText: {
    fontSize: 14,
    color: colors.light.primary,
    fontWeight: '600',
  },
  helpSection: {
    alignItems: 'center',
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.text,
    marginBottom: 12,
  },
  helpTitleDark: {
    color: colors.dark.text,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  helpButtonText: {
    fontSize: 14,
    color: colors.light.text,
    marginLeft: 8,
  },
  loginButton: {
    marginBottom: 24,
    backgroundColor: '#23408E',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 48,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 22,
  },
  loginLinkUnderline: {
    color: '#23408E',
    textDecorationLine: 'underline',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
    marginHorizontal: 80,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  supportIcon: {
    marginRight: 3,
  },
  supportButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
}); 