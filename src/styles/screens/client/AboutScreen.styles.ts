import { StyleSheet } from "react-native";

export const AboutScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#007AFF",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  appInfo: {
    alignItems: "center",
    marginBottom: 30,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  appLogo: {
    width: 60,
    height: 60,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  placeholder: {
    fontSize: 16,
    color: "#999999",
  },
  headerPlaceholder: {
    width: 40,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666666",
  },
  infoValue: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "500",
  },
  linksSection: {
    marginBottom: 20,
  },
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    marginBottom: 8,
  },
  linkText: {
    fontSize: 16,
    color: "#007AFF",
    marginLeft: 12,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalCloseButton: {
    padding: 8,
  },
  modalScrollView: {
    flex: 1,
    padding: 20,
  },
  appTextContainer: {
    alignItems: "center",
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 4,
  },
  appBuild: {
    fontSize: 14,
    color: "#999999",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 16,
  },
  sectionContent: {
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    padding: 16,
  },
  description: {
    fontSize: 16,
    color: "#333333",
    lineHeight: 24,
    marginBottom: 16,
  },
  featureList: {
    marginTop: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#007AFF",
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: "#333333",
    flex: 1,
  },
  contactInfo: {
    marginTop: 16,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  contactLabel: {
    fontSize: 14,
    color: "#666666",
    width: 80,
  },
  contactValue: {
    fontSize: 14,
    color: "#000000",
    flex: 1,
  },
  legalInfo: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  legalText: {
    fontSize: 12,
    color: "#999999",
    textAlign: "center",
    lineHeight: 18,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    margin: 20,
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 12,
    textAlign: "center",
  },
  modalText: {
    fontSize: 14,
    color: "#333333",
    textAlign: "center",
    lineHeight: 20,
  },
});

export const getAboutScreenColors = (isDark: boolean) => ({
  container: {
    backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
  },
  headerTitle: {
    color: isDark ? "#ffffff" : "#000000",
  },
  closeButtonText: {
    color: isDark ? "#007AFF" : "#007AFF",
  },
  header: {
    borderBottomColor: isDark ? "#333333" : "#E0E0E0",
  },
  appIcon: {
    backgroundColor: isDark ? "#2a2a2a" : "#F0F0F0",
  },
  appName: {
    color: isDark ? "#ffffff" : "#000000",
  },
  appVersion: {
    color: isDark ? "#cccccc" : "#666666",
  },
  appBuild: {
    color: isDark ? "#999999" : "#999999",
  },
  sectionTitle: {
    color: isDark ? "#ffffff" : "#000000",
  },
  sectionContent: {
    backgroundColor: isDark ? "#2a2a2a" : "#F8F8F8",
  },
  description: {
    color: isDark ? "#cccccc" : "#333333",
  },
  featureText: {
    color: isDark ? "#cccccc" : "#333333",
  },
  contactLabel: {
    color: isDark ? "#cccccc" : "#666666",
  },
  contactValue: {
    color: isDark ? "#ffffff" : "#000000",
  },
  legalInfo: {
    borderTopColor: isDark ? "#333333" : "#E0E0E0",
  },
  legalText: {
    color: isDark ? "#999999" : "#999999",
  },
  modalContent: {
    backgroundColor: isDark ? "#2a2a2a" : "#FFFFFF",
  },
  modalTitle: {
    color: isDark ? "#ffffff" : "#000000",
  },
  modalText: {
    color: isDark ? "#cccccc" : "#333333",
  },
  backButton: {
    color: isDark ? "#ffffff" : "#000000",
  },
  title: {
    color: isDark ? "#ffffff" : "#000000",
  },
  placeholder: {
    color: isDark ? "#999999" : "#999999",
  },
  contentContainer: {
    backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
  },
  infoSection: {
    backgroundColor: isDark ? "#2a2a2a" : "#F8F8F8",
  },
  infoItem: {
    borderBottomColor: isDark ? "#333333" : "#E0E0E0",
  },
  infoLabel: {
    color: isDark ? "#cccccc" : "#666666",
  },
  infoValue: {
    color: isDark ? "#ffffff" : "#000000",
  },
  linksSection: {
    backgroundColor: isDark ? "#2a2a2a" : "#F8F8F8",
  },
  linkItem: {
    backgroundColor: isDark ? "#2a2a2a" : "#F8F8F8",
  },
  linkText: {
    color: isDark ? "#007AFF" : "#007AFF",
  },
  modalHeader: {
    borderBottomColor: isDark ? "#333333" : "#E0E0E0",
  },
  modalCloseButton: {
    color: isDark ? "#ffffff" : "#000000",
  },
  modalScrollView: {
    backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
  },
});
