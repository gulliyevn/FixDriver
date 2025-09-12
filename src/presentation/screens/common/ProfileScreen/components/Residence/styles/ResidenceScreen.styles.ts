import { StyleSheet } from 'react-native';
import { adaptiveColors, adaptiveSizes } from '../../../../../../../../shared/constants/adaptiveConstants';

/**
 * Residence Screen Styles
 * 
 * Centralized styles for residence screen components
 * Uses adaptive constants for consistent theming
 */

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: adaptiveSizes.spacing.md,
    paddingVertical: adaptiveSizes.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: adaptiveColors.border,
  },
  backButton: {
    padding: adaptiveSizes.spacing.xs,
  },
  title: {
    fontSize: adaptiveSizes.font.lg,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: adaptiveSizes.spacing.md,
    paddingBottom: adaptiveSizes.spacing.xl,
  },
  addressItem: {
    marginBottom: adaptiveSizes.spacing.md,
    borderRadius: adaptiveSizes.borderRadius.md,
    padding: adaptiveSizes.spacing.md,
    shadowColor: adaptiveColors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  addressInfo: {
    flex: 1,
    marginRight: adaptiveSizes.spacing.sm,
  },
  addressTitle: {
    fontSize: adaptiveSizes.font.md,
    fontWeight: '600',
    marginBottom: adaptiveSizes.spacing.xs,
  },
  addressText: {
    fontSize: adaptiveSizes.font.sm,
    lineHeight: 20,
    marginBottom: adaptiveSizes.spacing.xs,
  },
  addressDescription: {
    fontSize: adaptiveSizes.font.xs,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: adaptiveSizes.spacing.xs,
  },
  defaultButton: {
    padding: adaptiveSizes.spacing.xs,
    borderRadius: adaptiveSizes.borderRadius.sm,
  },
  editButton: {
    padding: adaptiveSizes.spacing.xs,
    borderRadius: adaptiveSizes.borderRadius.sm,
  },
  deleteButton: {
    padding: adaptiveSizes.spacing.xs,
    borderRadius: adaptiveSizes.borderRadius.sm,
  },
  defaultBadge: {
    backgroundColor: adaptiveColors.success,
    paddingHorizontal: adaptiveSizes.spacing.sm,
    paddingVertical: adaptiveSizes.spacing.xs,
    borderRadius: adaptiveSizes.borderRadius.sm,
    alignSelf: 'flex-start',
    marginTop: adaptiveSizes.spacing.sm,
  },
  defaultText: {
    color: '#fff',
    fontSize: adaptiveSizes.font.xs,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: adaptiveSizes.spacing.xl,
  },
  emptyStateText: {
    fontSize: adaptiveSizes.font.md,
    textAlign: 'center',
    marginTop: adaptiveSizes.spacing.md,
    paddingHorizontal: adaptiveSizes.spacing.lg,
  },
  retryButton: {
    backgroundColor: adaptiveColors.primary,
    paddingHorizontal: adaptiveSizes.spacing.lg,
    paddingVertical: adaptiveSizes.spacing.sm,
    borderRadius: adaptiveSizes.borderRadius.md,
    marginTop: adaptiveSizes.spacing.md,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: adaptiveSizes.font.sm,
    fontWeight: '600',
  },
  floatingAddButton: {
    position: 'absolute',
    bottom: adaptiveSizes.spacing.xl,
    right: adaptiveSizes.spacing.lg,
    backgroundColor: adaptiveColors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: adaptiveColors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: adaptiveSizes.spacing.md,
    paddingVertical: adaptiveSizes.spacing.sm,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: adaptiveSizes.font.lg,
    fontWeight: '600',
  },
  modalCancelButton: {
    fontSize: adaptiveSizes.font.md,
  },
  modalSaveButton: {
    fontSize: adaptiveSizes.font.md,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: adaptiveSizes.spacing.md,
  },
  inputGroup: {
    marginBottom: adaptiveSizes.spacing.lg,
  },
  inputLabel: {
    fontSize: adaptiveSizes.font.sm,
    fontWeight: '600',
    marginBottom: adaptiveSizes.spacing.xs,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: adaptiveSizes.borderRadius.md,
    paddingHorizontal: adaptiveSizes.spacing.md,
    paddingVertical: adaptiveSizes.spacing.sm,
    fontSize: adaptiveSizes.font.md,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
});
