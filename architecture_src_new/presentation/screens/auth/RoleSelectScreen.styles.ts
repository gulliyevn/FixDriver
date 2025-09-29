import { StyleSheet } from 'react-native';
import { SIZES, SHADOWS, getColors } from '../../../shared/constants/adaptiveConstants';

const colors = getColors(false); // Light theme for now

// Additional colors for role selection
const roleColors = {
  client: ['#10B981', '#059669'],
  driver: ['#3B82F6', '#2563EB'],
};

export const RoleSelectScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: SIZES.lg,
  },
  contentContainer: {
    flexGrow: 1,
    paddingTop: 40,
    paddingBottom: 40,
  },
  spacerTop: {
    height: 20,
  },
  headerLogo: {
    alignItems: 'center',
    marginTop: SIZES.lg,
    paddingHorizontal: SIZES.lg,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 60,
    height: 60,
    marginRight: SIZES.xl,
    marginLeft: -SIZES.sm,
  },
  logoTextContainer: {
    alignItems: 'flex-start',
  },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 2,
  },
  logoSubtext: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    marginTop: SIZES.xs,
    letterSpacing: 0.5,
  },
  spacerLogoBottom: {
    height: 20,
  },
  title: {
    fontSize: SIZES.fontSize.title,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: SIZES.xxxl,
    lineHeight: SIZES.lineHeight.title,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: SIZES.radius.lg,
    padding: SIZES.xl,
    marginBottom: SIZES.xl,
    marginHorizontal: SIZES.lg,
    ...SHADOWS.light.medium,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 280,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  cardIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.md,
    ...SHADOWS.light.small,
  },
  cardTitle: {
    fontSize: SIZES.fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: SIZES.xs,
  },
  cardSubtitle: {
    fontSize: SIZES.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: SIZES.lineHeight.md,
    paddingHorizontal: 10,
  },
  cardContent: {
    marginBottom: SIZES.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.md,
    paddingHorizontal: 8,
  },
  featureText: {
    fontSize: SIZES.fontSize.md,
    color: colors.text,
    marginLeft: SIZES.sm,
    flex: 1,
    lineHeight: SIZES.lineHeight.md,
    fontWeight: '500',
  },
  chooseBtn: {
    borderRadius: SIZES.radius.md,
    paddingVertical: SIZES.lg,
    alignItems: 'center',
    minHeight: SIZES.buttonHeight.md,
    ...SHADOWS.light.small,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  chooseBtnClient: {
    backgroundColor: colors.success,
  },
  chooseBtnDriver: {
    backgroundColor: colors.warning,
  },
  chooseBtnText: {
    color: '#FFFFFF',
    fontSize: SIZES.fontSize.lg,
    fontWeight: '600',
    lineHeight: SIZES.lineHeight.lg,
    marginRight: 8,
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  loginText: {
    fontSize: SIZES.fontSize.md,
    color: colors.textSecondary,
    lineHeight: SIZES.lineHeight.md,
  },
  loginLink: {
    fontSize: SIZES.fontSize.md,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: SIZES.xs,
    lineHeight: SIZES.lineHeight.md,
    textDecorationLine: 'underline',
  },
  spacerLoginLang: {
    height: 24,
  },
  langWrap: {
    alignItems: 'center',
  },
  spacerBottom: {
    height: 20,
  },
  // Новые стили для улучшенного UX
  cardActive: {
    transform: [{ scale: 1.02 }],
    ...SHADOWS.light.large,
  },
  cardInactive: {
    opacity: 0.8,
  },
  featureIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    borderTopLeftRadius: SIZES.radius.lg,
    borderTopRightRadius: SIZES.radius.lg,
  },
  // Стили для переключателя ролей
  roleToggle: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: SIZES.radius.md,
    padding: 4,
    marginBottom: SIZES.xl,
  },
  roleToggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.sm,
    borderRadius: SIZES.radius.sm,
    gap: 8,
  },
  roleToggleButtonActive: {
    backgroundColor: '#1E293B',
    ...SHADOWS.light.small,
  },
  roleToggleText: {
    fontSize: SIZES.fontSize.md,
    fontWeight: '500',
    color: '#64748B',
  },
  roleToggleTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // Стили для role-specific кнопок
  roleToggleButtonClient: {
    backgroundColor: '#10B981',
  },
  roleToggleButtonDriver: {
    backgroundColor: '#3B82F6',
  },
});
