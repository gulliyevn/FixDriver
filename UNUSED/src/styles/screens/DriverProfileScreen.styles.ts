import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const DriverProfileScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.light.surface,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarIcon: {
    color: '#fff',
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.light.text,
    marginBottom: 4,
  },
  profilePhone: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginBottom: 2,
  },
  profileCar: {
    fontSize: 14,
    color: colors.light.primary,
    fontWeight: '500',
  },
  bell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bellBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#e53935',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.light.surface,
    marginHorizontal: 10,
    marginTop: 8,
    borderRadius: 12,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.light.text,
  },
  statsBox: {
    flexDirection: 'row',
    backgroundColor: colors.light.surface,
    marginHorizontal: 10,
    marginTop: 16,
    borderRadius: 12,
    paddingVertical: 20,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.light.textSecondary,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#e5e5e5',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
    marginHorizontal: 10,
    marginBottom: 8,
    borderRadius: 12,
  },
  menuItemFirst: {
    marginTop: 16,
  },
  menuIcon: {
    width: 32,
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: '#003366',
  },
  menuValue: {
    fontSize: 16,
    color: '#003366',
    fontWeight: '700',
    marginRight: 8,
  },
  menuLabelAbout: {
    flex: 1,
    fontSize: 16,
    color: '#003366',
    marginRight: 24,
  },
  menuVersion: {
    fontSize: 15,
    color: '#888',
    marginRight: 8,
    marginLeft: 0,
  },
  logout: {
    paddingVertical: 18,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    marginHorizontal: 10,
    marginTop: 16,
    borderRadius: 12,
  },
  logoutText: {
    color: '#e53935',
    fontSize: 16,
    fontWeight: '600',
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
    marginBottom: 20,
  },
});

// Функция для получения динамических стилей в зависимости от темы
export const getDriverProfileStyles = (isDark: boolean) => {
  const currentColors = isDark ? colors.dark : colors.light;
  
  return {
    container: {
      backgroundColor: currentColors.background,
    },
    profileName: {
      color: currentColors.text,
    },
    profilePhone: {
      color: currentColors.textSecondary,
    },
    profileEmail: {
      color: currentColors.textSecondary,
    },
    profileCar: {
      color: currentColors.primary,
    },
    bell: {
      backgroundColor: currentColors.surface,
    },
    bellIcon: {
      color: currentColors.primary,
    },
    statusBox: {
      backgroundColor: currentColors.surface,
    },
    statusText: {
      color: currentColors.text,
    },
    statsBox: {
      backgroundColor: currentColors.surface,
    },
    statValue: {
      color: currentColors.text,
    },
    statLabel: {
      color: currentColors.textSecondary,
    },
    statDivider: {
      backgroundColor: currentColors.border,
    },
    menuItem: {
      backgroundColor: currentColors.surface,
    },
    menuItemFirst: {
      // marginTop уже установлен в базовых стилях
    },
    menuLabel: {
      color: currentColors.text,
    },
    menuValue: {
      color: currentColors.text,
    },
    menuLabelAbout: {
      color: currentColors.text,
    },
    menuVersion: {
      color: currentColors.textSecondary,
    },
    logout: {
      backgroundColor: currentColors.surface,
    },
    title: {
      color: currentColors.text,
    },
    subtitle: {
      color: currentColors.textSecondary,
    },
  };
}; 