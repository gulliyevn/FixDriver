import { StyleSheet } from "react-native";

export const RatingStarsStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
  },
  star: {
    marginRight: 2,
  },
  emptyStar: {
    opacity: 0.3,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: "600",
  },
});
