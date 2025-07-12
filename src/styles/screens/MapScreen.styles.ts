import { StyleSheet } from 'react-native';
import { SIZES, SHADOWS } from '../../constants/colors';

export const MapScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    ...SHADOWS.light.medium,
  },
  menuButton: {
    padding: SIZES.sm,
    marginRight: SIZES.sm,
  },
  title: {
    flex: 1,
    fontSize: SIZES.fontSize.lg,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatButton: {
    padding: SIZES.sm,
    marginRight: SIZES.sm,
  },
  plusButton: {
    padding: SIZES.sm,
  },
  mapContainer: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: SIZES.fontSize.md,
  },
}); 