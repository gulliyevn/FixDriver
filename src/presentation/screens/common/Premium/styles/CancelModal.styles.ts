import { StyleSheet } from 'react-native';

/**
 * Cancel Modal Styles
 * 
 * Styles for subscription cancellation modal
 */

export const CancelModalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 40,
    width: 320,
    minHeight: 280,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  cancelModalContainer: {
    minHeight: 320,
  },
  modalIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  errorIconContainer: {
    backgroundColor: '#EF4444',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    width: '100%',
    color: '#111827',
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    width: '100%',
    paddingHorizontal: 16,
    color: '#6B7280',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  dangerButton: {
    backgroundColor: '#EF4444',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  whiteText: {
    color: '#FFFFFF',
  },
});

// Dark theme styles
export const getCancelModalColors = (isDark: boolean) => ({
  modalContainer: {
    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
  },
  modalTitle: {
    color: isDark ? '#F9FAFB' : '#111827',
  },
  modalMessage: {
    color: isDark ? '#D1D5DB' : '#6B7280',
  },
  secondaryButton: {
    backgroundColor: isDark ? '#374151' : '#F3F4F6',
    borderColor: isDark ? '#4B5563' : '#D1D5DB',
  },
  secondaryButtonText: {
    color: isDark ? '#F9FAFB' : '#374151',
  },
});