import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const DriverProfileScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.light.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.light.text,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.light.textSecondary,
  },
}); 