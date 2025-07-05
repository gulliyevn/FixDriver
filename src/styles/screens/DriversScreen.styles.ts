import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const DriversScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    padding: 16,
    backgroundColor: colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.light.textSecondary,
    marginBottom: 16,
  },
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
  driversList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  driverCard: {
    backgroundColor: colors.light.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.light.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  driverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  driverInfo: {
    flex: 1,
    marginLeft: 12,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.light.text,
    marginBottom: 4,
  },
  driverDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  driverDetailText: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginLeft: 4,
  },
  driverStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusOnline: {
    backgroundColor: colors.light.success,
  },
  statusOffline: {
    backgroundColor: colors.light.textSecondary,
  },
  statusText: {
    fontSize: 12,
    color: colors.light.textSecondary,
  },
  driverActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  callButton: {
    backgroundColor: colors.light.success,
  },
  chatButton: {
    backgroundColor: colors.light.primary,
  },
  chatButtonDisabled: {
    backgroundColor: colors.light.border,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  chatButtonText: {
    color: '#FFFFFF',
  },
  chatButtonTextDisabled: {
    color: colors.light.textSecondary,
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  scheduleContainer: {
    marginBottom: 12,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.text,
    marginBottom: 8,
  },
  scheduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  scheduleItem: {
    backgroundColor: colors.light.surface,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  scheduleItemActive: {
    backgroundColor: colors.light.primary,
  },
  scheduleText: {
    fontSize: 12,
    color: colors.light.textSecondary,
  },
  scheduleTextActive: {
    color: '#FFFFFF',
  },
  tripDetails: {
    marginBottom: 12,
  },
  tripDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  tripDetailText: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginLeft: 8,
  },
  expandedActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  callButtonExpanded: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.light.success,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  callButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  chatButtonExpanded: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.light.text,
  },
  modalHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalSelectButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  modalSelectButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.light.primary,
  },
  closeButton: {
    padding: 8,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.light.text,
  },
  markAllButton: {
    padding: 16,
    backgroundColor: colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  markAllButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.light.primary,
    textAlign: 'center',
  },
  notificationsList: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.light.textSecondary,
    textAlign: 'center',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  unreadNotification: {
    backgroundColor: colors.light.primary + '10',
  },
  selectedNotification: {
    backgroundColor: colors.light.primary + '20',
  },
  notificationContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 12,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.text,
    marginBottom: 4,
  },
  unreadTitle: {
    fontWeight: '700',
  },
  notificationMessage: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: colors.light.textSecondary,
  },
  deleteButton: {
    padding: 8,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  bottomButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectAllButton: {
    backgroundColor: colors.light.surface,
  },
  bottomButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  deleteAllButton: {
    backgroundColor: colors.light.error,
  },
  modalHeaderEmpty: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  closeButtonCustom: {
    padding: 8,
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
  content: {
    flex: 1,
    padding: 20,
  },
  driverContent: {
    backgroundColor: colors.light.card,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: colors.light.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  driverCompactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  driverAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameRatingRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  driverRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    color: colors.light.textSecondary,
  },
  carInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  carInfoText: {
    fontSize: 14,
    color: colors.light.textSecondary,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  memberTagRowSpaced: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  memberTagCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
  },
  memberIcon: {
    marginRight: 4,
  },
  memberName: {
    fontSize: 13,
    color: colors.light.textSecondary,
  },
  expandArrow: {
    marginLeft: 8,
  },
  driverExpanded: {
    backgroundColor: colors.light.surface,
    borderRadius: 12,
    marginTop: 8,
    padding: 12,
  },
  routeSection: {
    marginBottom: 12,
  },
  routePointWithTime: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  routeLeftSide: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  routePinContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  routeText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  routeTime: {
    fontSize: 12,
    color: colors.light.textSecondary,
  },
}); 