import { StyleSheet } from "react-native";

export const RulesSlidesStyles = StyleSheet.create({
  // Стили для слайдов
  slideItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    marginBottom: 8,
  },
  slideIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  slideInfo: {
    flex: 1,
  },
  slideTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#003366",
    marginBottom: 4,
  },
  slideDescription: {
    fontSize: 14,
    color: "#888",
  },
  slideOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    zIndex: 1000,
    elevation: 5,
  },
  slideContent: {
    flex: 1,
  },
  slideHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 8,
  },
  slideHeaderTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#003366",
  },
  slideScroll: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  slideText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
});
