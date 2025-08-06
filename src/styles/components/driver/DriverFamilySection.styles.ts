import { StyleSheet } from 'react-native';

export const DriverFamilySectionStyles = StyleSheet.create({
  familySection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003366',
  },
  addIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginTop: -6,
  },
  familyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  familyInfo: {
    flex: 1,
  },
  familyName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#003366',
  },
  familyType: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  familyIcon: {
    transform: [{ rotate: '90deg' }],
  },
  familyIconExpanded: {
    transform: [{ rotate: '270deg' }],
  },
  familyExpandedContent: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  familyExpandedText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  editFamilyButton: {
    backgroundColor: '#003366',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  editFamilyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  addFamilyButton: {
    backgroundColor: '#f9f9f9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addFamilyText: {
    color: '#003366',
    fontSize: 16,
    fontWeight: '500',
  },
});

export const getDriverFamilySectionColors = (isDark: boolean) => {
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
    addIconButton: { 
      backgroundColor: colors.surface,
      borderColor: colors.border 
    },
    familyItem: { backgroundColor: colors.surface },
    familyName: { color: colors.text },
    familyType: { color: colors.textSecondary },
    familyExpandedContent: { backgroundColor: colors.border },
    familyExpandedText: { color: colors.textSecondary },
    editFamilyButton: { backgroundColor: colors.primary },
    editFamilyButtonText: { color: colors.text },
    addFamilyButton: { backgroundColor: colors.surface },
    addFamilyText: { color: colors.text },
  };
}; 