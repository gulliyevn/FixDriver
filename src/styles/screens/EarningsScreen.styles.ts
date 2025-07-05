import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const EarningsScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.light.text,
  },
  detailsButton: {
    padding: 8,
  },
  periodContainer: {
    backgroundColor: colors.light.background,
    paddingVertical: 16,
  },
  periodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    borderRadius: 20,
    backgroundColor: colors.light.surface,
  },
  periodButtonActive: {
    backgroundColor: colors.light.primary,
  },
  periodText: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginLeft: 6,
  },
  periodTextActive: {
    color: colors.light.background,
  },
  earningsCard: {
    backgroundColor: colors.light.background,
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: colors.light.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  earningsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  earningsLabel: {
    fontSize: 16,
    color: colors.light.textSecondary,
  },
  earningsAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 8,
  },
  earningsSubtext: {
    fontSize: 14,
    color: colors.light.success,
  },
  statsSection: {
    backgroundColor: colors.light.background,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.light.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.light.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.light.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.light.textSecondary,
    textAlign: 'center',
  },
  chartSection: {
    backgroundColor: colors.light.background,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  chartContainer: {
    backgroundColor: colors.light.surface,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  chartPlaceholder: {
    alignItems: 'center',
  },
  chartText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.light.textSecondary,
    marginTop: 12,
  },
  chartSubtext: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginTop: 4,
  },
  ridesSection: {
    backgroundColor: colors.light.background,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
    flex: 1,
  },
  ridesList: {
    flex: 1,
  },
  rideCard: {
    backgroundColor: colors.light.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rideInfo: {
    flex: 1,
  },
  rideClient: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.text,
    marginBottom: 4,
  },
  rideTime: {
    fontSize: 14,
    color: colors.light.textSecondary,
  },
  rideAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.light.primary,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: colors.light.textSecondary,
    marginLeft: 4,
  },
  withdrawSection: {
    backgroundColor: colors.light.background,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  withdrawButton: {
    backgroundColor: colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  withdrawButtonText: {
    color: colors.light.background,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 