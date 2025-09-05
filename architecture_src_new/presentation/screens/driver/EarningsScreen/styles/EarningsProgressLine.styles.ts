import { StyleSheet } from 'react-native';
import { SIZES } from '../../../../shared/constants/colors';

export const createEarningsProgressLineStyles = () => StyleSheet.create({
  container: {
    marginTop: SIZES.lg,
  },
  progressBar: {
    width: '100%',
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  progressText: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: '700',
    zIndex: 1,
  },
});
