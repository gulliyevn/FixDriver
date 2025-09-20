import { StyleSheet } from 'react-native';
import { SIZES, SHADOWS, colors } from '../../../../../shared/constants/adaptiveConstants';

export const createEarningsScreenStyles = (isDark: boolean) => {
  const currentColors = colors[isDark ? 'dark' : 'light'];

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentColors.background,
    },
    
    scrollView: {
      flex: 1,
      paddingHorizontal: SIZES.md,
    },
    
    // Filter Section
    filterContainer: {
      flexDirection: 'row',
      marginVertical: SIZES.md,
      backgroundColor: currentColors.surface,
      borderRadius: SIZES.radius.md,
      padding: SIZES.sm,
      ...SHADOWS[isDark ? 'dark' : 'light'].small,
    },
    
    filterButton: {
      flex: 1,
      paddingVertical: SIZES.sm,
      paddingHorizontal: SIZES.md,
      borderRadius: SIZES.radius.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    filterButtonActive: {
      backgroundColor: currentColors.primary,
    },
    
    filterButtonText: {
      fontSize: SIZES.fontSize.sm,
      color: currentColors.textSecondary,
      fontWeight: '500',
    },
    
    filterButtonTextActive: {
      color: currentColors.surface,
      fontWeight: '600',
    },
    
    // Loading
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: SIZES.xxxl,
    },
    
    loadingText: {
      fontSize: SIZES.fontSize.md,
      color: currentColors.textSecondary,
    },
    
    // Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: SIZES.xl,
    },
    
    modalContent: {
      backgroundColor: currentColors.surface,
      borderRadius: SIZES.radius.lg,
      padding: SIZES.xl,
      width: '100%',
      maxWidth: 400,
      ...SHADOWS[isDark ? 'dark' : 'light'].large,
    },
    
    modalTitle: {
      fontSize: SIZES.fontSize.xl,
      fontWeight: '600',
      color: currentColors.text,
      textAlign: 'center',
      marginBottom: SIZES.sm,
    },
    
    modalSubtitle: {
      fontSize: SIZES.fontSize.md,
      color: currentColors.textSecondary,
      textAlign: 'center',
      marginBottom: SIZES.xl,
      lineHeight: SIZES.lineHeight.md,
    },
    
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: SIZES.md,
    },
    
    modalButton: {
      flex: 1,
      paddingVertical: SIZES.md,
      borderRadius: SIZES.radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    modalButtonCancel: {
      backgroundColor: currentColors.border,
    },
    
    modalButtonConfirm: {
      backgroundColor: currentColors.primary,
    },
    
    modalButtonCancelText: {
      fontSize: SIZES.fontSize.md,
      color: currentColors.text,
      fontWeight: '500',
    },
    
    modalButtonConfirmText: {
      fontSize: SIZES.fontSize.md,
      color: currentColors.surface,
      fontWeight: '600',
    },
    
    // Status Indicator
    statusIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: SIZES.sm,
      paddingHorizontal: SIZES.md,
      backgroundColor: currentColors.surface,
      borderRadius: SIZES.radius.md,
      marginVertical: SIZES.sm,
      ...SHADOWS[isDark ? 'dark' : 'light'].small,
    },
    
    statusDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: SIZES.sm,
    },
    
    statusDotOnline: {
      backgroundColor: currentColors.success,
    },
    
    statusDotOffline: {
      backgroundColor: currentColors.error,
    },
    
    statusText: {
      fontSize: SIZES.fontSize.md,
      color: currentColors.text,
      fontWeight: '500',
    },
    
    // Earnings Summary
    earningsSummary: {
      backgroundColor: currentColors.surface,
      borderRadius: SIZES.radius.lg,
      padding: SIZES.xl,
      marginVertical: SIZES.md,
      ...SHADOWS[isDark ? 'dark' : 'light'].medium,
    },
    
    earningsTitle: {
      fontSize: SIZES.fontSize.lg,
      fontWeight: '600',
      color: currentColors.text,
      marginBottom: SIZES.md,
    },
    
    earningsAmount: {
      fontSize: SIZES.fontSize.title,
      fontWeight: '700',
      color: currentColors.primary,
      marginBottom: SIZES.sm,
    },
    
    earningsSubtitle: {
      fontSize: SIZES.fontSize.sm,
      color: currentColors.textSecondary,
    },
    
    // Progress Section
    progressSection: {
      backgroundColor: currentColors.surface,
      borderRadius: SIZES.radius.lg,
      padding: SIZES.xl,
      marginVertical: SIZES.md,
      ...SHADOWS[isDark ? 'dark' : 'light'].medium,
    },
    
    progressTitle: {
      fontSize: SIZES.fontSize.lg,
      fontWeight: '600',
      color: currentColors.text,
      marginBottom: SIZES.md,
    },
    
    progressBar: {
      height: 8,
      backgroundColor: currentColors.border,
      borderRadius: 4,
      marginBottom: SIZES.sm,
    },
    
    progressFill: {
      height: '100%',
      backgroundColor: currentColors.primary,
      borderRadius: 4,
    },
    
    progressText: {
      fontSize: SIZES.fontSize.sm,
      color: currentColors.textSecondary,
      textAlign: 'center',
    },
    
    // Stats Grid
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginVertical: SIZES.md,
    },
    
    statCard: {
      width: '48%',
      backgroundColor: currentColors.surface,
      borderRadius: SIZES.radius.md,
      padding: SIZES.md,
      marginBottom: SIZES.md,
      ...SHADOWS[isDark ? 'dark' : 'light'].small,
    },
    
    statIcon: {
      fontSize: SIZES.fontSize.xl,
      color: currentColors.primary,
      marginBottom: SIZES.sm,
    },
    
    statValue: {
      fontSize: SIZES.fontSize.lg,
      fontWeight: '600',
      color: currentColors.text,
      marginBottom: SIZES.xs,
    },
    
    statLabel: {
      fontSize: SIZES.fontSize.sm,
      color: currentColors.textSecondary,
    },
    
    // Empty State
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: SIZES.xxxl,
    },
    
    emptyStateIcon: {
      fontSize: 64,
      color: currentColors.textTertiary,
      marginBottom: SIZES.lg,
    },
    
    emptyStateTitle: {
      fontSize: SIZES.fontSize.lg,
      fontWeight: '600',
      color: currentColors.text,
      marginBottom: SIZES.sm,
      textAlign: 'center',
    },
    
    emptyStateSubtitle: {
      fontSize: SIZES.fontSize.md,
      color: currentColors.textSecondary,
      textAlign: 'center',
      lineHeight: SIZES.lineHeight.md,
    },
  });
};
