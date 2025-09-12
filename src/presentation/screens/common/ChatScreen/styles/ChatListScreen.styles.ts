import { StyleSheet } from 'react-native';
import { adaptiveColors, adaptiveSizes } from '../../../../../../shared/constants/adaptiveConstants';

/**
 * Chat List Screen Styles
 * 
 * Centralized styles for chat list screen components
 * Uses adaptive constants for consistent theming
 */

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: adaptiveSizes.spacing.xl,
    paddingVertical: adaptiveSizes.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: adaptiveColors.border,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: adaptiveSizes.spacing.md,
  },
  headerTitle: {
    fontSize: adaptiveSizes.font.xl,
    fontWeight: '700',
    textAlign: 'left',
    marginLeft: adaptiveSizes.spacing.sm,
  },
  headerActionText: {
    fontSize: adaptiveSizes.font.md,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: adaptiveSizes.spacing.xl,
    marginVertical: adaptiveSizes.spacing.md,
    paddingHorizontal: adaptiveSizes.spacing.md,
    paddingVertical: adaptiveSizes.spacing.sm,
    borderRadius: adaptiveSizes.borderRadius.lg,
    borderWidth: 1,
    borderColor: adaptiveColors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: adaptiveSizes.spacing.sm,
    fontSize: adaptiveSizes.font.md,
  },
  chatList: {
    flex: 1,
    paddingVertical: adaptiveSizes.spacing.sm,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: adaptiveSizes.spacing.sm,
    marginHorizontal: adaptiveSizes.spacing.xl,
    padding: adaptiveSizes.spacing.md,
    borderRadius: adaptiveSizes.borderRadius.md,
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
  selectionCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: adaptiveColors.primary,
    marginRight: adaptiveSizes.spacing.md,
    backgroundColor: 'transparent',
  },
  selectionCheckboxActive: {
    backgroundColor: adaptiveColors.primary,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: adaptiveSizes.spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: adaptiveColors.primary,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: adaptiveColors.background,
  },
  offlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#9CA3AF',
    borderWidth: 2,
    borderColor: adaptiveColors.background,
  },
  chatContent: {
    flex: 1,
  },
  chatInfo: {
    flex: 1,
  },
  chatNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatName: {
    fontSize: adaptiveSizes.font.lg,
    fontWeight: '600',
    flexShrink: 1,
    marginRight: 0,
  },
  favoriteInlineIcon: {
    marginLeft: 4,
    opacity: 0.7,
  },
  carInfo: {
    fontSize: adaptiveSizes.font.sm,
    marginTop: 2,
    marginBottom: adaptiveSizes.spacing.xs,
  },
  lastMessage: {
    fontSize: adaptiveSizes.font.md,
    marginTop: adaptiveSizes.spacing.xs,
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 60,
  },
  chatTime: {
    fontSize: adaptiveSizes.font.xs,
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: adaptiveColors.primary,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: adaptiveSizes.spacing.xs,
  },
  unreadCount: {
    color: '#fff',
    fontSize: adaptiveSizes.font.xs,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: adaptiveSizes.spacing.xxl * 2,
  },
  emptyStateTitle: {
    fontSize: adaptiveSizes.font.xl,
    fontWeight: '600',
    marginTop: adaptiveSizes.spacing.lg,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: adaptiveSizes.font.md,
    marginTop: adaptiveSizes.spacing.sm,
    textAlign: 'center',
  },
  actionButtonsContainer: {
    paddingHorizontal: adaptiveSizes.spacing.xl,
    paddingVertical: adaptiveSizes.spacing.md,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: adaptiveSizes.spacing.md,
  },
  actionButton: {
    flex: 1,
    paddingVertical: adaptiveSizes.spacing.md,
    paddingHorizontal: adaptiveSizes.spacing.lg,
    borderRadius: adaptiveSizes.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  selectAllButton: {
    borderColor: adaptiveColors.primary,
  },
  selectAllButtonText: {
    fontSize: adaptiveSizes.font.md,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: adaptiveSizes.font.md,
    fontWeight: '600',
  },
  // Swipe actions
  swipeActionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: adaptiveSizes.spacing.xl,
  },
  swipeActionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: adaptiveSizes.spacing.xl,
  },
  swipeAction: {
    width: 100,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderRadius: adaptiveSizes.borderRadius.lg,
  },
  swipeActionInnerLeft: {
    marginRight: 4,
  },
  swipeActionInnerRight: {
    marginLeft: 4,
  },
  favoriteAction: {
    backgroundColor: '#F59E0B',
  },
  deleteAction: {
    backgroundColor: '#EF4444',
  },
});
