import { StyleSheet } from 'react-native';

/**
 * Premium Header Styles
 * 
 * Styles for premium header with animated auto-renew switch
 */

export const PremiumHeaderStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 45,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  autoRenewSwitch: {
    width: 51,
    height: 31,
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: 2,
    backgroundColor: '#E5E7EB',
  },
  autoRenewBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    backgroundColor: '#10B981',
  },
  autoRenewIndicator: {
    position: 'absolute',
    top: 2,
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  autoRenewIcon: {
    position: 'absolute',
  },
  placeholder: {
    width: 51,
  },
});

// Dark theme styles
export const getPremiumHeaderColors = (isDark: boolean) => ({
  header: {
    borderBottomColor: isDark ? '#374151' : '#E5E7EB',
    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
  },
  headerTitle: {
    color: isDark ? '#F9FAFB' : '#111827',
  },
  autoRenewSwitch: {
    backgroundColor: isDark ? '#374151' : '#E5E7EB',
  },
});
