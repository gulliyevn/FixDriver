import { StyleSheet } from 'react-native';
import { SIZES, SHADOWS } from '../../constants/colors';

export const PlusScreenStyles = StyleSheet.create({
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
  backButton: {
    padding: SIZES.sm,
    marginRight: SIZES.sm,
  },
  title: {
    flex: 1,
    fontSize: SIZES.fontSize.lg,
    fontWeight: '600',
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: SIZES.md,
    gap: SIZES.sm,
  },
  step: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.lg,
  },
  stepTitle: {
    fontSize: SIZES.fontSize.xl,
    fontWeight: '600',
    marginBottom: SIZES.sm,
    marginTop: SIZES.lg,
  },
  stepDescription: {
    fontSize: SIZES.fontSize.md,
    marginBottom: SIZES.xl,
  },
  packageCard: {
    padding: SIZES.lg,
    borderRadius: SIZES.radius.lg,
    marginBottom: SIZES.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
    ...SHADOWS.light.medium,
  },
  popularBadge: {
    position: 'absolute',
    top: SIZES.md,
    right: SIZES.md,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radius.sm,
  },
  popularText: {
    fontSize: SIZES.fontSize.xs,
    fontWeight: '600',
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  packageName: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: '600',
  },
  packagePrice: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: '700',
  },
  packageDescription: {
    fontSize: SIZES.fontSize.md,
    marginBottom: SIZES.md,
  },
  packageDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  packageDetail: {
    fontSize: SIZES.fontSize.sm,
  },
  inputGroup: {
    marginBottom: SIZES.lg,
    padding: SIZES.md,
    borderRadius: SIZES.radius.md,
    ...SHADOWS.light.small,
  },
  inputLabel: {
    fontSize: SIZES.fontSize.md,
    fontWeight: '500',
    marginBottom: SIZES.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: SIZES.radius.sm,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    fontSize: SIZES.fontSize.md,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: SIZES.radius.sm,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    fontSize: SIZES.fontSize.md,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  routeCard: {
    padding: SIZES.lg,
    borderRadius: SIZES.radius.lg,
    marginBottom: SIZES.lg,
    ...SHADOWS.light.medium,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SIZES.md,
  },
  routeAddress: {
    flex: 1,
    fontSize: SIZES.fontSize.md,
  },
  routeLine: {
    width: 2,
    height: 20,
    marginLeft: 5,
    marginBottom: SIZES.md,
  },
  summaryCard: {
    padding: SIZES.lg,
    borderRadius: SIZES.radius.lg,
    ...SHADOWS.light.medium,
  },
  summaryTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: '600',
    marginBottom: SIZES.md,
  },
  summaryText: {
    fontSize: SIZES.fontSize.md,
    marginBottom: SIZES.xs,
  },
  buttonContainer: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
  },
  nextButton: {
    paddingVertical: SIZES.md,
    borderRadius: SIZES.radius.md,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: SIZES.fontSize.md,
    fontWeight: '600',
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