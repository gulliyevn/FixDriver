import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';

export const SearchAndFiltersStyles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.light.text,
    marginLeft: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    backgroundColor: colors.light.surface,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 14,
    color: colors.light.textSecondary,
  },
  filterButtonActive: {
    backgroundColor: colors.light.primary,
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  filterModalContent: {
    flex: 1,
    padding: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterGridItem: {
    backgroundColor: colors.light.surface,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  filterGridItemActive: {
    backgroundColor: colors.light.primary,
  },
  filterGridText: {
    fontSize: 14,
    color: colors.light.textSecondary,
  },
  filterGridTextActive: {
    color: '#FFFFFF',
  },
  filterModalActions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  filterResetButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  filterResetButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.light.textSecondary,
  },
  filterApplyButton: {
    flex: 1,
    backgroundColor: colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterApplyButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
}); 