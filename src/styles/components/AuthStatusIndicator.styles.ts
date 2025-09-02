import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const AuthStatusIndicatorStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  containerAuthenticated: {
    backgroundColor: colors.light.success + '20',
    borderWidth: 1,
    borderColor: colors.light.success,
  },
  containerUnauthenticated: {
    backgroundColor: colors.light.warning + '20',
    borderWidth: 1,
    borderColor: colors.light.warning,
  },
  containerLoading: {
    backgroundColor: colors.light.info + '20',
    borderWidth: 1,
    borderColor: colors.light.info,
  },
  containerError: {
    backgroundColor: colors.light.error + '20',
    borderWidth: 1,
    borderColor: colors.light.error,
  },
  icon: {
    marginRight: 8,
  },
  iconAuthenticated: {
    color: colors.light.success,
  },
  iconUnauthenticated: {
    color: colors.light.warning,
  },
  iconLoading: {
    color: colors.light.info,
  },
  iconError: {
    color: colors.light.error,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
  textAuthenticated: {
    color: colors.light.success,
  },
  textUnauthenticated: {
    color: colors.light.warning,
  },
  textLoading: {
    color: colors.light.info,
  },
  textError: {
    color: colors.light.error,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    padding: 4,
  },
  refreshText: {
    fontSize: 12,
    color: colors.light.primary,
    marginLeft: 4,
  },
  detailsContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  detailText: {
    fontSize: 12,
    color: colors.light.textSecondary,
    marginBottom: 2,
  },
}); 