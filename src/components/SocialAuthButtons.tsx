import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SocialAuthService } from "../services/SocialAuthService";
import { SocialAuthButtonsStyles } from "../styles/components/SocialAuthButtons.styles";
import { useI18n } from "../hooks/useI18n";
import GoogleIcon from "./GoogleIcon";

interface SocialAuthButtonsProps {
  onPress?: (provider: "google" | "facebook" | "apple") => Promise<void>;
  onSuccess?: (user: Record<string, unknown>) => void;
  onError?: (error: string) => void;
}

export default function SocialAuthButtons({
  onPress,
  onSuccess,
  onError,
}: SocialAuthButtonsProps) {
  const { t } = useI18n();
  const handleGoogleSignIn = async () => {
    if (onPress) {
      await onPress("google");
      return;
    }

    try {
      const result = await SocialAuthService.signInWithGoogle();
      if (result.success) {
        onSuccess?.(result.user as unknown as Record<string, unknown>);
      } else {
        onError?.(result.error || "Ошибка входа через Google");
      }
    } catch {
      onError?.("Ошибка входа через Google");
    }
  };

  const handleFacebookSignIn = async () => {
    if (onPress) {
      await onPress("facebook");
      return;
    }

    try {
      const result = await SocialAuthService.signInWithFacebook();
      if (result.success) {
        onSuccess?.(result.user as unknown as Record<string, unknown>);
      } else {
        onError?.(result.error || "Ошибка входа через Facebook");
      }
    } catch {
      onError?.("Ошибка входа через Facebook");
    }
  };

  const handleAppleSignIn = async () => {
    if (onPress) {
      await onPress("apple");
      return;
    }

    try {
      const result = await SocialAuthService.signInWithApple();
      if (result.success) {
        onSuccess?.(result.user as unknown as Record<string, unknown>);
      } else {
        onError?.(result.error || "Ошибка входа через Apple");
      }
    } catch {
      onError?.("Ошибка входа через Apple");
    }
  };

  return (
    <View style={SocialAuthButtonsStyles.container}>
      <TouchableOpacity
        style={SocialAuthButtonsStyles.googleButton}
        onPress={handleGoogleSignIn}
      >
        <GoogleIcon size={28} />
      </TouchableOpacity>

      <TouchableOpacity
        style={SocialAuthButtonsStyles.facebookButton}
        onPress={handleFacebookSignIn}
      >
        <Ionicons name="logo-facebook" size={28} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={SocialAuthButtonsStyles.appleButton}
        onPress={handleAppleSignIn}
      >
        <Ionicons name="logo-apple" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
