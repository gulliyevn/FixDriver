import { StyleSheet } from 'react-native';

/**
 * Premium Packages Screen Styles
 * 
 * Main styles for premium packages screen
 */

export const PremiumPackagesScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  periodSelector: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#3B82F6',
  },
  periodButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  packagesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  packageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  packageCardActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#F8FAFF',
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  packageName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  packageNameActive: {
    color: '#3B82F6',
  },
  activeBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  packageDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  packagePrice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  priceText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  discountText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginLeft: 8,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  featuresList: {
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});

// Dark theme styles
export const getPremiumPackagesScreenColors = (isDark: boolean) => ({
  container: {
    backgroundColor: isDark ? '#111827' : '#FFFFFF',
  },
  periodSelector: {
    backgroundColor: isDark ? '#374151' : '#F3F4F6',
  },
  periodButton: {
    backgroundColor: isDark ? '#4B5563' : 'transparent',
  },
  periodButtonText: {
    color: isDark ? '#D1D5DB' : '#6B7280',
  },
  packageCard: {
    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
    borderColor: isDark ? '#374151' : '#E5E7EB',
  },
  packageCardActive: {
    backgroundColor: isDark ? '#1E3A8A' : '#F8FAFF',
    borderColor: '#3B82F6',
  },
  packageName: {
    color: isDark ? '#F9FAFB' : '#111827',
  },
  packageDescription: {
    color: isDark ? '#D1D5DB' : '#6B7280',
  },
  priceText: {
    color: isDark ? '#F9FAFB' : '#111827',
  },
  discountText: {
    color: isDark ? '#34D399' : '#10B981',
    backgroundColor: isDark ? '#064E3B' : '#ECFDF5',
  },
  featureText: {
    color: isDark ? '#E5E7EB' : '#374151',
  },
});
