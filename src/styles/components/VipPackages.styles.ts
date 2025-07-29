import { StyleSheet } from 'react-native';

export const VipPackagesStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  discountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
  },
  discountText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  periodSwitchContainer: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginTop: 28,
    marginBottom: 16,
    borderRadius: 24,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  periodButtonWrapLeft: {
    flex: 0.9,
    marginRight: 4,
  },
  periodButtonWrapRight: {
    flex: 0.9,
    marginLeft: 4,
  },
  periodButton: {
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 20,
    alignItems: 'center',
  },
  periodButtonInactive: {
    borderWidth: 0,
  },
  periodButtonText: {
    fontSize: 15,
    fontWeight: '600',
    opacity: 1,
    letterSpacing: 0.2,
  },
  packagesScrollContent: {
    paddingHorizontal: 0,
    paddingVertical: 20,
    alignItems: 'center',
  },
  packageCard: {
    borderRadius: 16,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginHorizontal: 12, // Увеличил отступы между боксами
    borderWidth: 2,
    width: 360,
    height: 560,
    justifyContent: 'space-between',
  },
  packageTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  packageDescription: {
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
    textAlign: 'center',
    opacity: 0.8,
  },
  // Стили для таблицы функций
  featuresContainer: {
    flex: 1,
    marginBottom: 20,
    justifyContent: 'center',
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  featureNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  iconWrapper: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  featureName: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
    lineHeight: 16,
  },
  featureValueContainer: {
    alignItems: 'flex-end',
    minWidth: 60,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  crossContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  crossCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  featureValue: {
    fontSize: 11,
    fontWeight: '600',
  },
  priceButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 0,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  priceContainer: {
    alignItems: 'center',
  },
  priceText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
  },
  savingsContainer: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  savingsText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
});

export const getVipPackagesColors = (isDark: boolean) => {
  const colors = isDark ? {
    surface: '#1F2937',
    card: '#1F2937',
    border: '#374151',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    primary: '#3B82F6',
    priceButton: '#3B82F6',
  } : {
    surface: '#f9f9f9',
    card: '#ffffff',
    border: '#f0f0f0',
    text: '#003366',
    textSecondary: '#666666',
    primary: '#083198',
    priceButton: '#083198',
  };

  return {
    periodSwitchContainer: { backgroundColor: colors.surface },
    packageCard: {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },
    packageTitle: { color: colors.text },
    packageDescription: { color: colors.textSecondary },
    priceButton: {
      backgroundColor: colors.priceButton,
      borderColor: colors.priceButton,
    },
  };
}; 