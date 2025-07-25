import { StyleSheet } from 'react-native';

export const VipSectionStyles = StyleSheet.create({
  vipSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003366',
    marginBottom: 16,
  },
  vipCard: {
    backgroundColor: '#fff8e1',
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  vipTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF8F00',
    marginBottom: 8,
  },
  vipDescription: {
    fontSize: 14,
    color: '#FF8F00',
    marginBottom: 12,
  },
  vipButton: {
    backgroundColor: '#FF8F00',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  vipButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export const getVipSectionColors = (isDark: boolean) => {
  const colors = isDark ? {
    text: '#F9FAFB',
  } : {
    text: '#003366',
  };

  return {
    sectionTitle: { color: colors.text },
  };
}; 