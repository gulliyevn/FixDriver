import { StyleSheet } from 'react-native';
import { adaptiveColors, adaptiveSizes } from '../../../../../../shared/constants/adaptiveConstants';

/**
 * Notifications Screen Styles
 * 
 * Centralized styles for notifications screen components
 * Uses adaptive constants for consistent theming
 */

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerDark: {
    backgroundColor: '#1F2937',
  },
  header: {
    paddingHorizontal: adaptiveSizes.spacing.lg,
    paddingVertical: adaptiveSizes.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: adaptiveColors.border,
  },
  headerDark: {
    backgroundColor: '#1F2937',
    borderBottomColor: '#374151',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: adaptiveSizes.font.xl,
    fontWeight: '700',
    marginLeft: adaptiveSizes.spacing.md,
  },
  headerTitleDark: {
    color: '#F9FAFB',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: adaptiveSizes.spacing.md,
  },
  markAllButton: {
    paddingHorizontal: adaptiveSizes.spacing.md,
    paddingVertical: adaptiveSizes.spacing.sm,
    backgroundColor: adaptiveColors.primary,
    borderRadius: adaptiveSizes.borderRadius.md,
  },
  markAllButtonText: {
    color: '#FFFFFF',
    fontSize: adaptiveSizes.font.sm,
    fontWeight: '600',
  },
  selectButton: {
    padding: adaptiveSizes.spacing.sm,
  },
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cancelButton: {
    fontSize: adaptiveSizes.font.md,
    color: adaptiveColors.primary,
    fontWeight: '600',
  },
  selectionTitle: {
    fontSize: adaptiveSizes.font.lg,
    fontWeight: '600',
    color: adaptiveColors.text,
  },
  selectAllButton: {
    fontSize: adaptiveSizes.font.md,
    color: adaptiveColors.primary,
    fontWeight: '600',
  },
  selectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: adaptiveSizes.spacing.lg,
    paddingVertical: adaptiveSizes.spacing.md,
    backgroundColor: adaptiveColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: adaptiveColors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: adaptiveSizes.spacing.lg,
    paddingVertical: adaptiveSizes.spacing.md,
    backgroundColor: adaptiveColors.background,
    borderRadius: adaptiveSizes.borderRadius.lg,
    borderWidth: 1,
    borderColor: adaptiveColors.border,
    gap: adaptiveSizes.spacing.sm,
  },
  deleteActionButton: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  actionButtonText: {
    fontSize: adaptiveSizes.font.md,
    fontWeight: '600',
    color: adaptiveColors.text,
  },
  deleteButtonText: {
    color: '#EF4444',
  },
  scrollView: {
    flex: 1,
  },
  notificationItem: {
    marginHorizontal: adaptiveSizes.spacing.lg,
    marginVertical: adaptiveSizes.spacing.sm,
    padding: adaptiveSizes.spacing.lg,
    backgroundColor: adaptiveColors.background,
    borderRadius: adaptiveSizes.borderRadius.lg,
    borderWidth: 1,
    borderColor: adaptiveColors.border,
    shadowColor: adaptiveColors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationItemDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: adaptiveColors.primary,
  },
  selectedNotification: {
    backgroundColor: adaptiveColors.primary + '10',
    borderColor: adaptiveColors.primary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: adaptiveColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: adaptiveSizes.spacing.md,
  },
  checkboxSelected: {
    backgroundColor: adaptiveColors.primary,
    borderColor: adaptiveColors.primary,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: adaptiveSizes.spacing.md,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationHeader: {
    marginBottom: adaptiveSizes.spacing.xs,
  },
  notificationTitle: {
    fontSize: adaptiveSizes.font.lg,
    fontWeight: '600',
    color: adaptiveColors.text,
  },
  notificationTitleDark: {
    color: '#F9FAFB',
  },
  unreadTitle: {
    fontWeight: '700',
  },
  notificationMessage: {
    fontSize: adaptiveSizes.font.md,
    color: adaptiveColors.textSecondary,
    lineHeight: 20,
    marginBottom: adaptiveSizes.spacing.xs,
  },
  notificationTime: {
    fontSize: adaptiveSizes.font.sm,
    color: adaptiveColors.textSecondary,
  },
  deleteButton: {
    padding: adaptiveSizes.spacing.sm,
    marginLeft: adaptiveSizes.spacing.sm,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: adaptiveSizes.spacing.xxl * 2,
  },
  emptyStateText: {
    fontSize: adaptiveSizes.font.xl,
    fontWeight: '600',
    color: adaptiveColors.text,
    marginTop: adaptiveSizes.spacing.lg,
    textAlign: 'center',
  },
  emptyStateTextDark: {
    color: '#F9FAFB',
  },
  emptyStateSubtext: {
    fontSize: adaptiveSizes.font.md,
    color: adaptiveColors.textSecondary,
    marginTop: adaptiveSizes.spacing.sm,
    textAlign: 'center',
  },
  emptyStateSubtextDark: {
    color: '#9CA3AF',
  },
});
