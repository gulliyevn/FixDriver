import { StyleSheet } from "react-native";
import { colors } from "../../../constants/colors";

export const DriverProfileScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  fixedSection: {
    // Фиксированная секция с аватаром и статистикой
  },
  scrollSection: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    marginBottom: -2,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#003366",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  avatarIcon: {
    color: "#fff",
  },
  profileText: {
    marginLeft: 16,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#003366",
  },
  profilePhone: {
    fontSize: 18,
    color: "#888",
    marginTop: 4,
  },
  profileEmail: {
    fontSize: 13,
    color: "#aaa",
    marginTop: 1,
  },
  premiumButtonContainer: {
    marginLeft: 8,
    borderRadius: 20,
    shadowColor: "#0066CC",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 15,
  },
  premiumButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#0066CC",
    shadowColor: "#0066CC",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
  premiumButtonText: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 4,
  },
  bell: {
    marginLeft: 12,
    padding: 6,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  bellBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "#e53935",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  bellBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  bellIcon: {
    color: "#003366",
  },
  statsBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
    marginHorizontal: 10,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 16,
  },
  statsDivider: {
    height: 1,
    backgroundColor: "#e5e5e5",
    marginHorizontal: 10,
  },
  statCol: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#003366",
  },
  statLabel: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: "#e5e5e5",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: "#f9f9f9",
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
  balanceIcon: {
    color: "#001a44",
  },
  menuIconDefault: {
    color: "#003366",
  },
  chevronIcon: {
    color: "#bbb",
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: "#003366",
  },
  menuValue: {
    fontSize: 16,
    color: "#003366",
    fontWeight: "700",
    marginRight: 8,
  },
  menuLabelAbout: {
    flex: 1,
    fontSize: 16,
    color: "#003366",
    marginRight: 24,
  },
  menuVersion: {
    fontSize: 15,
    color: "#888",
    marginRight: 8,
    marginLeft: 0,
  },
  logout: {
    paddingVertical: 18,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    marginHorizontal: 10,
    marginTop: 16,
    borderRadius: 12,
  },
  logoutText: {
    color: "#e53935",
    fontSize: 16,
    fontWeight: "600",
  },
  // VIP стили
  vipMenuItem: {
    backgroundColor: "#fff8e1",
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  vipContent: {
    flex: 1,
    marginRight: 8,
  },
  vipLabel: {
    color: "#FF8F00",
    fontWeight: "700",
  },
  vipDescription: {
    fontSize: 13,
    color: "#FF8F00",
    marginTop: 2,
  },
});

// Функция для получения динамических стилей в зависимости от темы
export const getDriverProfileStyles = (isDark: boolean) => {
  const currentColors = isDark ? colors.dark : colors.light;

  return {
    container: {
      backgroundColor: currentColors.background,
    },
    fixedSection: {
      backgroundColor: currentColors.background,
    },
    scrollSection: {
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
    premiumButton: {
      borderColor: "#0066CC",
    },
    bell: {
      backgroundColor: currentColors.surface,
    },
    bellIcon: {
      color: currentColors.primary,
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
    statsDivider: {
      backgroundColor: currentColors.border,
    },
    menuItem: {
      backgroundColor: currentColors.surface,
    },
    menuItemFirst: {
      // marginTop уже установлен в базовых стилях
    },
    balanceIcon: {
      color: currentColors.primary,
    },
    menuIconDefault: {
      color: currentColors.primary,
    },
    chevronIcon: {
      color: currentColors.textSecondary,
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
    vipMenuItem: {
      backgroundColor: isDark ? "#2a2a2a" : "#fff8e1",
      borderColor: "#FFD700",
    },
    vipLabel: {
      color: "#FF8F00",
    },
    vipDescription: {
      color: "#FF8F00",
    },
  };
};
