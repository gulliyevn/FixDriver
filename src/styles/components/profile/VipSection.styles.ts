import { StyleSheet } from 'react-native';

export const VipSectionStyles = StyleSheet.create({
  container: {
    marginBottom: 24,
    backgroundColor: '#f8f9ff',
    borderWidth: 1,
    borderColor: '#6366f1',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
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
    fontSize: 20,
    fontWeight: '700',
    color: '#4f46e5',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#6366f1',
    opacity: 0.9,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  vipButtonContainer: {
    borderRadius: 12,
    shadowColor: '#4f46e5',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  vipButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  vipButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
});

export const getVipSectionColors = (isDark: boolean) => {
  const colors = isDark ? {
    text: '#F9FAFB',
    background: '#1e1b4b',
    border: '#6366f1',
    title: '#a5b4fc',
    subtitle: '#818cf8',
    description: '#cbd5e1',
  } : {
    text: '#003366',
    background: '#f8f9ff',
    border: '#6366f1',
    title: '#4f46e5',
    subtitle: '#6366f1',
    description: '#6b7280',
  };

  return {
    container: { 
      backgroundColor: colors.background,
      borderColor: colors.border 
    },
    title: { color: colors.title },
    subtitle: { color: colors.subtitle },
    description: { color: colors.description },
  };
}; 