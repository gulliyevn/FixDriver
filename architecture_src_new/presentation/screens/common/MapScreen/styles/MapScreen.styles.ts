import { StyleSheet } from 'react-native';

export const createMapScreenStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDark ? '#F9FAFB' : '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: isDark ? '#9CA3AF' : '#6B7280',
  },
  mapContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: isDark ? '#374151' : '#F3F4F6',
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mapPlaceholderText: {
    fontSize: 48,
    marginBottom: 16,
  },
  mapPlaceholderSubtext: {
    fontSize: 16,
    color: isDark ? '#9CA3AF' : '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  statusInfo: {
    backgroundColor: isDark ? '#4B5563' : '#E5E7EB',
    padding: 16,
    borderRadius: 12,
    width: '100%',
  },
  statusText: {
    fontSize: 14,
    color: isDark ? '#D1D5DB' : '#374151',
    marginBottom: 4,
  },
  mapControls: {
    position: 'absolute',
    right: 16,
    top: 16,
    gap: 12,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: isDark ? '#4B5563' : '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  controlButtonText: {
    fontSize: 20,
  },
  infoPanel: {
    margin: 20,
    padding: 16,
    backgroundColor: isDark ? '#374151' : '#F3F4F6',
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#F9FAFB' : '#111827',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: isDark ? '#D1D5DB' : '#374151',
    marginBottom: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    margin: 20,
    marginBottom: 40,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    backgroundColor: isDark ? '#DC2626' : '#EF4444',
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
