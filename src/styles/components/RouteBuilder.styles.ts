import { StyleSheet } from 'react-native';

export const RouteBuilderStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  pointsList: {
    flex: 1,
    maxHeight: 400,
  },
  pointContainer: {
    marginBottom: 16,
  },
  pointHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pointIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  pointDescription: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  pointControls: {
    flexDirection: 'row',
    gap: 4,
  },
  controlButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
  },
  deleteText: {
    color: '#DC2626',
    fontSize: 14,
  },
  addressInput: {
    marginBottom: 8,
  },
  connectionLine: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  arrowDown: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 16,
  },
  addButton: {
    flex: 1,
  },
  calculateButton: {
    flex: 2,
  },
  routeInfo: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  routeInfoText: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 4,
  },
}); 