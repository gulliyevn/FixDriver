import { StyleSheet } from 'react-native';

export const VipSectionStyles = StyleSheet.create({
  container: {
    marginBottom: 24,
    backgroundColor: '#fff8e1',
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 12,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF8F00',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#FF8F00',
    opacity: 0.8,
  },
  description: {
    fontSize: 14,
    color: '#FF8F00',
    marginBottom: 16,
    lineHeight: 20,
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
    background: '#2a2a2a',
    border: '#FFD700',
  } : {
    text: '#003366',
    background: '#fff8e1',
    border: '#FFD700',
  };

  return {
    container: { 
      backgroundColor: colors.background,
      borderColor: colors.border 
    },
    title: { color: '#FF8F00' },
    subtitle: { color: '#FF8F00' },
    description: { color: '#FF8F00' },
  };
}; 