import { StyleSheet } from "react-native";

export const PremiumPackagesScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 45,
    paddingBottom: 6,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  autoRenewSwitch: {
    width: 51,
    height: 31,
    borderRadius: 16,
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  autoRenewBackground: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    backgroundColor: "#10B981",
  },
  autoRenewIndicator: {
    position: "absolute",
    top: 2,
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  autoRenewIcon: {
    position: "absolute",
  },
  placeholder: {
    width: 51,
  },
  content: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 40,
    width: 320,
    minHeight: 280,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  modalIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  successIconContainer: {
    backgroundColor: "#10B981",
  },
  errorIconContainer: {
    backgroundColor: "#EF4444",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    width: "100%",
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
    width: "100%",
    paddingHorizontal: 16,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 120,
    width: "100%",
    maxWidth: 200,
  },
  primaryButton: {
    backgroundColor: "#3B82F6",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  whiteText: {
    color: "#FFFFFF",
  },
  cancelModalContainer: {
    minHeight: 200,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  secondaryButton: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
  },
  dangerButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
  },
});

export const getPremiumPackagesScreenColors = (isDark: boolean) => ({
  container: {
    backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
  },
  header: {
    borderBottomColor: isDark ? "#374151" : "#E5E7EB",
    backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
  },
  headerTitle: {
    color: isDark ? "#F9FAFB" : "#111827",
  },
  autoRenewSwitch: {
    backgroundColor: isDark ? "#374151" : "#E5E7EB",
  },
  modalContainer: {
    backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
  },
  modalTitle: {
    color: isDark ? "#F9FAFB" : "#111827",
  },
  modalMessage: {
    color: isDark ? "#D1D5DB" : "#6B7280",
  },
  secondaryButton: {
    backgroundColor: isDark ? "#374151" : "#E5E7EB",
  },
  secondaryButtonText: {
    color: isDark ? "#F9FAFB" : "#111827",
  },
});
