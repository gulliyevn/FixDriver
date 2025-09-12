import { StyleSheet } from 'react-native';

/**
 * Success Modal Styles
 * 
 * Styles for successful package purchase modal
 */

export const SuccessModalStyles = StyleSheet.create({
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
  modalIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successIconContainer: {
    backgroundColor: '#10B981',
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
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 120,
    width: '100%',
    maxWidth: 200,
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
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
export const getSuccessModalColors = (isDark: boolean) => ({
  modalContainer: {
    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
  },
  modalTitle: {
    color: isDark ? '#F9FAFB' : '#111827',
  },
  modalMessage: {
    color: isDark ? '#D1D5DB' : '#6B7280',
  },
});
