import { StyleSheet } from 'react-native';
import { SIZES, SHADOWS, getColors } from '../../../shared/constants/adaptiveConstants';

const colors = getColors(false); // Light theme for now

export const ModalScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingTop: 44 + SIZES.sm, // SafeArea + small padding
    paddingBottom: SIZES.md,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    ...SHADOWS.light.medium,
  },
  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.md,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: SIZES.lineHeight.md,
    letterSpacing: -0.3,
    flexShrink: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.xl,
  },
  content: {
    padding: SIZES.xl,
    marginBottom: SIZES.lg,
  },
  sectionTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: SIZES.md,
    marginTop: SIZES.lg,
    lineHeight: SIZES.lineHeight.lg,
    letterSpacing: -0.3,
  },
  text: {
    fontSize: SIZES.fontSize.md,
    color: '#64748B',
    lineHeight: SIZES.lineHeight.lg,
    marginBottom: SIZES.lg,
    letterSpacing: 0.2,
  },
});
