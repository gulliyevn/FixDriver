import { StyleSheet } from 'react-native';
import { SIZES, SHADOWS } from '../../../../../shared/constants/colors';

export const createLevelModalStyles = (isDark: boolean) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
    borderRadius: SIZES.radius.lg,
    padding: SIZES.xl,
    ...SHADOWS[isDark ? 'dark' : 'light'].large,
  },
  modalTitle: {
    fontSize: SIZES.fontSize.xl,
    fontWeight: '700',
    color: isDark ? '#FFFFFF' : '#1F2937',
    marginBottom: SIZES.sm,
  },
  modalMessage: {
    fontSize: SIZES.fontSize.md,
    color: isDark ? '#D1D5DB' : '#6B7280',
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SIZES.lg,
  },
  modalButtonCancel: {
    backgroundColor: isDark ? '#374151' : '#F3F4F6',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.radius.md,
    minWidth: 80,
    alignItems: 'center',
  },
  modalButtonCancelText: {
    fontSize: SIZES.fontSize.md,
    fontWeight: '600',
    color: isDark ? '#D1D5DB' : '#374151',
  },
});
