import { StyleSheet } from "react-native";

export const TabBarStyles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingBottom: 8,
    paddingTop: 0, // Убираем отступ сверху полностью
    height: 88,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 0, // Убираем вертикальные отступы
    marginTop: -6, // Поднимаем иконки еще выше
    position: "relative",
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2, // Уменьшаем отступ между иконкой и текстом
  },
  tabBadge: {
    position: "absolute",
    top: 4,
    right: "50%",
    marginRight: -8,
    backgroundColor: "#EF4444",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 14, // Приближаем индикатор еще ближе к иконке
    width: 20,
    height: 3,
    borderRadius: 1.5,
  },
  specialTabContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  specialTabCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -20, // Поднимаем выше таббара
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: "#fff",
  },
  specialTabIcon: {
    fontSize: 30,
  },
});
