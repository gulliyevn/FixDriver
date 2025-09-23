import { StyleSheet } from 'react-native';
import { getCurrentColors } from '../../../../../shared/constants/colors';

export const createProfileScreenStyles = (isDark: boolean) => {
  const colors = getCurrentColors(isDark);

  return StyleSheet.create({
    // Main container
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  loginPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loginPromptText: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 24,
  },
    
    // Profile header section
    profileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 60,
      marginBottom: -2,
      paddingHorizontal: 20,
    },
    avatar: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarImage: {
      width: 72,
      height: 72,
      borderRadius: 36,
    },
    avatarIcon: {
      color: colors.card,
    },
    profileText: {
      marginLeft: 16,
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
    },
    profileName: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
    },
    profilePhone: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 2,
    },
    profileEmail: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 2,
    },

    // Premium button
    premiumButtonContainer: {
      marginTop: 20,
      paddingHorizontal: 20,
    },
    premiumButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 20,
      alignItems: 'center',
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    premiumButtonText: {
      color: colors.surface,
      fontSize: 16,
      fontWeight: '600',
    },

    // Notification bell
    bell: {
      position: 'absolute',
      top: 60,
      right: 20,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.cardShadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    bellBadge: {
      position: 'absolute',
      top: -2,
      right: -2,
      backgroundColor: colors.error,
      borderRadius: 8,
      minWidth: 16,
      height: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bellBadgeText: {
      color: colors.card,
      fontSize: 10,
      fontWeight: '600',
    },
    bellIcon: {
      color: colors.text,
    },

    // Stats section
    statsBox: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      marginHorizontal: 20,
      marginTop: 20,
      borderRadius: 12,
      padding: 16,
      shadowColor: colors.cardShadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    statsDivider: {
      width: 1,
      backgroundColor: colors.border,
      marginHorizontal: 16,
    },
    statCol: {
      flex: 1,
      alignItems: 'center',
    },
    statValue: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
    },
    statDivider: {
      width: 1,
      backgroundColor: colors.border,
      marginHorizontal: 16,
    },

    // Menu section
    menu: {
      marginTop: 20,
      paddingHorizontal: 20,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    menuItemFirst: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    menuIcon: {
      marginRight: 10,
      width: 28,
      alignItems: 'center',
      color: colors.textSecondary,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    balanceIcon: {
      marginRight: 10,
      width: 28,
      alignItems: 'center',
    },
    menuIconDefault: {
      marginRight: 10,
      width: 28,
      alignItems: 'center',
      color: colors.textSecondary,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    chevronIcon: {
      marginLeft: 'auto',
      color: colors.textSecondary,
    },
    menuLabel: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
    },
    menuValue: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    menuLabelAbout: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
    },
    menuVersion: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
    },

    // Logout button
    logout: {
      marginTop: 20,
      marginHorizontal: 20,
      backgroundColor: colors.accent,
      borderRadius: 20,
      paddingVertical: 20,
      paddingHorizontal: 28,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      shadowColor: colors.accent,
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 12,
      borderWidth: 2,
      borderColor: colors.secondary,
    },
    logoutText: {
      color: colors.card,
      fontSize: 18,
      fontWeight: '800',
      letterSpacing: 1,
      marginLeft: 8,
    },
    logoutIcon: {
      color: colors.card,
      fontSize: 20,
    },

    // VIP menu item
    vipMenuItem: {
      backgroundColor: colors.accent,
      borderRadius: 12,
      marginHorizontal: 20,
      marginTop: 20,
      padding: 16,
    },
    vipContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    vipLabel: {
      flex: 1,
      fontSize: 16,
      fontWeight: '600',
      color: colors.surface,
    },
    vipDescription: {
      fontSize: 12,
      color: colors.surface,
      opacity: 0.8,
      marginTop: 4,
    },

    // Content sections
    content: {
      flex: 1,
      padding: 20,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 20,
    },
    placeholder: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
    },

    // Back button
    backButton: {
      position: 'absolute',
      top: 50,
      left: 20,
      padding: 10,
      backgroundColor: colors.primary,
      borderRadius: 5,
      zIndex: 1000,
    },
    backButtonText: {
      color: colors.surface,
      fontSize: 16,
    },
  });
};
