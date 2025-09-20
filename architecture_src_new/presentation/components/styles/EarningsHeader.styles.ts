import { StyleSheet } from 'react-native';

export const createEarningsHeaderStyles = (colors: any) => StyleSheet.create({
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
  },
  headerTop: {
    // Container for header content
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterIconContainer: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.border,
  },
  statusButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.border,
  },
  filtersWrapper: {
    marginTop: 8,
  },
  filtersContainer: {
    // ScrollView styles
  },
  filtersContent: {
    paddingHorizontal: 4,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.border,
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.surface,
  },
});
