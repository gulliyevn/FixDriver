import { StyleSheet } from 'react-native';

export const DriverPersonalInfoSectionStyles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003366',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  infoRowEditing: {
    borderWidth: 2,
    borderColor: '#003366',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#003366',
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
    flex: 1,
    textAlign: 'right',
  },
  infoInput: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    padding: 0,
    margin: 0,
    textAlign: 'right',
  },
  infoValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  verifyButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
    paddingVertical: 6,
    borderRadius: 0,
    borderWidth: 0,
    marginLeft: 4,
  },
});

export const getDriverPersonalInfoSectionColors = (isDark: boolean) => {
  const colors = isDark ? {
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    primary: '#3B82F6',
    surface: '#1F2937',
    border: '#374151',
  } : {
    text: '#003366',
    textSecondary: '#666666',
    primary: '#083198',
    surface: '#f9f9f9',
    border: '#f0f0f0',
  };

  return {
    sectionTitle: { color: colors.text },
    infoRow: { backgroundColor: colors.surface },
    infoLabel: { color: colors.text },
    infoValue: { color: colors.textSecondary },
    infoInput: { 
      backgroundColor: 'transparent',
      color: colors.text 
    },
    infoRowEditing: { 
      borderColor: colors.primary,
    },
  };
}; 