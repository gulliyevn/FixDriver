import { StyleSheet } from 'react-native';
import { lightColors } from '../../constants/colors';

export const DriversScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.background,
  },
  header: {
    backgroundColor: lightColors.surface,
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: lightColors.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: lightColors.text,
  },
  searchContainer: {
    marginTop: 16,
  },
  searchInput: {
    backgroundColor: lightColors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: lightColors.text,
    borderWidth: 1,
    borderColor: lightColors.border,
  },
  filtersContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  filterButton: {
    backgroundColor: lightColors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: lightColors.border,
  },
  filterButtonActive: {
    backgroundColor: lightColors.primary,
    borderColor: lightColors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: lightColors.textSecondary,
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  driversList: {
    flex: 1,
  },
  driverCard: {
    backgroundColor: lightColors.surface,
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: lightColors.border,
  },
  driverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  driverAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: lightColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  driverAvatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: lightColors.text,
    marginBottom: 2,
  },
  driverRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: lightColors.textSecondary,
    marginLeft: 4,
  },
  driverStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: lightColors.success,
  },
  driverStatusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  driverDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: lightColors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: lightColors.text,
  },
  driverActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: lightColors.primary,
  },
  secondaryButton: {
    backgroundColor: lightColors.background,
    borderWidth: 1,
    borderColor: lightColors.border,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: lightColors.text,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    color: lightColors.textSecondary,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: lightColors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    color: lightColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: lightColors.textSecondary,
    marginTop: 16,
  },
  // Filter modal styles
  filterModal: {
    backgroundColor: lightColors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: lightColors.text,
  },
  filterCloseButton: {
    padding: 4,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: lightColors.text,
    marginBottom: 12,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: lightColors.border,
  },
  filterOptionText: {
    flex: 1,
    fontSize: 16,
    color: lightColors.text,
  },
  filterCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: lightColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterCheckboxChecked: {
    backgroundColor: lightColors.primary,
    borderColor: lightColors.primary,
  },
  filterApplyButton: {
    backgroundColor: lightColors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  filterApplyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Notification modal styles
  notificationModal: {
    backgroundColor: lightColors.surface,
    borderRadius: 12,
    margin: 20,
    padding: 20,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: lightColors.text,
  },
  notificationCloseButton: {
    padding: 4,
  },
  notificationContent: {
    marginBottom: 20,
  },
  notificationText: {
    fontSize: 16,
    color: lightColors.text,
    lineHeight: 24,
  },
  notificationActions: {
    flexDirection: 'row',
    gap: 12,
  },
  notificationButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  notificationPrimaryButton: {
    backgroundColor: lightColors.primary,
  },
  notificationSecondaryButton: {
    backgroundColor: lightColors.background,
    borderWidth: 1,
    borderColor: lightColors.border,
  },
  notificationButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  notificationPrimaryButtonText: {
    color: '#FFFFFF',
  },
  notificationSecondaryButtonText: {
    color: lightColors.text,
  },
}); 