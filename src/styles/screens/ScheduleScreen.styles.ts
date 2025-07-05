import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const ScheduleScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    padding: 16,
    backgroundColor: colors.light.surface,
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
  },
  content: {
    flex: 1,
    padding: 16,
  },
  bookingCard: {
    marginBottom: 16,
    backgroundColor: colors.light.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scheduleCard: {
    flex: 1,
    backgroundColor: colors.light.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.light.text,
    marginBottom: 16,
  },
  bookingForm: {
    gap: 12,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formField: {
    flex: 1,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.light.surface,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  scheduleItemActive: {
    borderColor: colors.light.primary,
    backgroundColor: colors.light.primary + '10',
  },
  scheduleItemCompleted: {
    borderColor: colors.light.success,
    backgroundColor: colors.light.success + '10',
  },
  scheduleItemCancelled: {
    borderColor: colors.light.error,
    backgroundColor: colors.light.error + '10',
  },
  scheduleIcon: {
    marginRight: 12,
  },
  scheduleContent: {
    flex: 1,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.text,
  },
  scheduleStatus: {
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  scheduleStatusUpcoming: {
    backgroundColor: colors.light.primary + '20',
    color: colors.light.primary,
  },
  scheduleStatusCompleted: {
    backgroundColor: colors.light.success + '20',
    color: colors.light.success,
  },
  scheduleStatusCancelled: {
    backgroundColor: colors.light.error + '20',
    color: colors.light.error,
  },
  scheduleDetails: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginBottom: 4,
  },
  scheduleTime: {
    fontSize: 12,
    color: colors.light.textSecondary,
  },
  scheduleActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
  },
  cancelButton: {
    backgroundColor: colors.light.error + '20',
  },
  cancelButtonText: {
    color: colors.light.error,
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: colors.light.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
}); 