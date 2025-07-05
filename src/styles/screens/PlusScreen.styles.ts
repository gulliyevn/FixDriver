import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const PlusScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    padding: 16,
    backgroundColor: colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.light.textSecondary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.light.text,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: '48%',
    backgroundColor: colors.light.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gridItemIcon: {
    marginBottom: 12,
  },
  gridItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  gridItemSubtitle: {
    fontSize: 14,
    color: colors.light.textSecondary,
    textAlign: 'center',
  },
  quickActions: {
    gap: 12,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    marginRight: 16,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.text,
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 14,
    color: colors.light.textSecondary,
  },
  quickActionArrow: {
    marginLeft: 8,
  },
  premiumCard: {
    backgroundColor: colors.light.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  premiumSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 16,
  },
  premiumButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  premiumButtonText: {
    color: colors.light.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
}); 