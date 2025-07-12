import { StyleSheet } from 'react-native';
import { SIZES, SHADOWS } from '../../constants/colors';

export const OrdersScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    ...SHADOWS.light.medium,
  },
  headerTitle: {
    fontSize: SIZES.fontSize.xl,
    fontWeight: '600',
  },
  refreshButton: {
    padding: SIZES.sm,
  },
  searchContainer: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SIZES.radius.lg,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
  },
  searchIcon: {
    marginRight: SIZES.sm,
  },
  input: {
    flex: 1,
    fontSize: SIZES.fontSize.md,
  },
  filtersContainer: {
    paddingHorizontal: SIZES.lg,
    paddingBottom: SIZES.md,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radius.md,
    marginRight: SIZES.sm,
  },
  filterText: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: '500',
    marginLeft: SIZES.xs,
  },
  ordersList: {
    flex: 1,
    paddingHorizontal: SIZES.lg,
  },
  orderCard: {
    padding: SIZES.lg,
    borderRadius: SIZES.radius.lg,
    marginBottom: SIZES.md,
    ...SHADOWS.light.medium,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: '600',
    marginBottom: SIZES.xs,
  },
  orderTime: {
    fontSize: SIZES.fontSize.sm,
  },
  statusBadge: {
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radius.sm,
  },
  statusText: {
    fontSize: SIZES.fontSize.xs,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  orderDetails: {
    marginBottom: SIZES.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  detailText: {
    flex: 1,
    fontSize: SIZES.fontSize.md,
    marginLeft: SIZES.sm,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radius.md,
    marginLeft: SIZES.sm,
  },
  actionButtonText: {
    fontSize: SIZES.fontSize.md,
    fontWeight: '600',
  },
}); 