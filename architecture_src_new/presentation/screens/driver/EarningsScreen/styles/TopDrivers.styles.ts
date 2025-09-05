import { StyleSheet } from 'react-native';
import { SIZES } from '../../../../shared/constants/colors';

export const createTopDriversStyles = () => StyleSheet.create({
  container: {
    padding: SIZES.xl,
    borderRadius: SIZES.radius.lg,
    marginHorizontal: SIZES.xl,
    marginBottom: SIZES.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
    marginLeft: SIZES.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    maxHeight: 200,
  },
  driverItem: {
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.md,
    borderBottomWidth: 1,
  },
  driverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  positionContainer: {
    width: 30,
    alignItems: 'center',
  },
  position: {
    fontSize: 16,
    fontWeight: '600',
  },
  driverContent: {
    flex: 1,
    marginLeft: SIZES.md,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: SIZES.xs,
  },
  driverLevel: {
    fontSize: 12,
  },
  statsContainer: {
    alignItems: 'flex-end',
  },
  rides: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: SIZES.xs,
  },
  earnings: {
    fontSize: 16,
    fontWeight: '600',
  },
});
