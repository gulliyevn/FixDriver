import { StyleSheet } from 'react-native';

export const ProfileHeaderStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 45,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003366',
  },
});

export const getProfileHeaderColors = (isDark: boolean) => {
  const colors = isDark ? {
    background: '#111827',
    text: '#F9FAFB',
    primary: '#3B82F6',
    border: '#374151',
  } : {
    background: '#ffffff',
    text: '#003366',
    primary: '#083198',
    border: '#f0f0f0',
  };

  return {
    header: { 
      backgroundColor: colors.background,
      borderBottomColor: colors.border 
    },
    title: { color: colors.text },
    backButton: { color: colors.primary },
  };
}; 