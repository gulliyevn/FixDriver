import React from "react";
import { View, Text, Image } from "react-native";
import { AppAvatarStyles } from "../styles/components/AppAvatar.styles";

interface AppAvatarProps {
  size?: "small" | "medium" | "large" | number;
  source?: { uri: string };
  defaultSource?: { uri: string };
  name?: string;
  onPress?: () => void;
}

export default function AppAvatar({
  size = "medium",
  source,
  defaultSource,
  name,
}: AppAvatarProps) {
  const getContainerStyle = () => {
    if (typeof size === "number") {
      return [
        AppAvatarStyles.container,
        { width: size, height: size, borderRadius: size / 2 },
      ];
    }

    switch (size) {
      case "small":
        return [AppAvatarStyles.container, AppAvatarStyles.sizeSmall];
      case "large":
        return [AppAvatarStyles.container, AppAvatarStyles.sizeLarge];
      default:
        return [AppAvatarStyles.container, AppAvatarStyles.sizeMedium];
    }
  };

  const getTextStyle = () => {
    if (typeof size === "number") {
      const fontSize = Math.max(12, size * 0.4);
      return [AppAvatarStyles.text, { fontSize }];
    }

    switch (size) {
      case "small":
        return [AppAvatarStyles.text, AppAvatarStyles.textSmall];
      case "large":
        return [AppAvatarStyles.text, AppAvatarStyles.textLarge];
      default:
        return [AppAvatarStyles.text, AppAvatarStyles.textMedium];
    }
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (source?.uri) {
    return (
      <View testID="avatar-container" style={getContainerStyle()}>
        <Image
          testID="avatar-image"
          source={source}
          defaultSource={defaultSource}
          style={AppAvatarStyles.image}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <View testID="avatar-container" style={getContainerStyle()}>
      <Text style={getTextStyle()}>{name ? getInitials(name) : "?"}</Text>
    </View>
  );
}
