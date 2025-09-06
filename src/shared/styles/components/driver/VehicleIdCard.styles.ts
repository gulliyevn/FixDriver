import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';

export const VehicleIdCardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 12,
  },
  header: {
    backgroundColor: '#003366', // Используем тот же цвет что и кнопки
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  headerIcon: {
    marginRight: 6,
  },
  headerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  content: {
    flexDirection: 'row',
    padding: 16,
  },
  photoContainer: {
    width: '40%',
    marginRight: 12,
  },
  vehiclePhoto: {
    width: '90%',
    height: 90,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 8,
  },
  dataContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#083198', // Используем цвет активной иконки заработка
  },
  dataLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    fontFamily: 'monospace',
  },
  dataValue: {
    fontSize: 12,
    color: '#1f2937',
    fontWeight: '600',
    fontFamily: 'monospace',
    textAlign: 'right',
  },
});

export const getVehicleIdCardColors = (isDark: boolean) => {
  // Используем цвета иконки заработка из TabBar
  const themeColors = isDark ? {
    background: '#111827',
    surface: '#1F2937',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    primary: '#3B82F6', // Цвет активной иконки заработка в темной теме
    border: '#3B82F6', // Линия под текстом в темной теме
    card: '#1F2937',
    shadow: '#000',
  } : {
    background: '#ffffff',
    surface: '#f9f9f9',
    text: '#003366',
    textSecondary: '#666666',
    primary: '#083198', // Цвет активной иконки заработка в светлой теме
    border: '#083198', // Линия под текстом в светлой теме
    card: '#ffffff',
    shadow: '#000',
  };
  
  return {
    card: { 
      backgroundColor: themeColors.surface,
      shadowColor: themeColors.shadow 
    },
    header: { backgroundColor: themeColors.primary },
    dataLabel: { color: themeColors.textSecondary },
    dataValue: { color: themeColors.text },
    dataRow: { borderBottomColor: themeColors.border },
  };
};
