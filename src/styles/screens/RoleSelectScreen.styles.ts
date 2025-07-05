import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const RoleSelectScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.light.textSecondary,
    textAlign: 'center',
  },
  roleContainer: {
    marginBottom: 24,
  },
  roleCard: {
    backgroundColor: colors.light.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: colors.light.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roleIcon: {
    marginBottom: 16,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.light.text,
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.light.textSecondary,
  },
  loginLink: {
    color: colors.light.primary,
    fontWeight: '600',
  },
}); 