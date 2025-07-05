import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SocialAuthService } from '../services/SocialAuthService';
import { SocialAuthButtonsStyles } from '../styles/components/SocialAuthButtons.styles';

interface SocialAuthButtonsProps {
  onSuccess?: (user: Record<string, unknown>) => void;
  onError?: (error: string) => void;
}

export default function SocialAuthButtons({ onSuccess, onError }: SocialAuthButtonsProps) {
  const handleGoogleSignIn = async () => {
    try {
      const result = await SocialAuthService.signInWithGoogle();
      if (result.success) {
        onSuccess?.(result.user as unknown as Record<string, unknown>);
      } else {
        onError?.(result.error || 'Ошибка входа через Google');
      }
    } catch {
      onError?.('Ошибка входа через Google');
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const result = await SocialAuthService.signInWithFacebook();
      if (result.success) {
        onSuccess?.(result.user as unknown as Record<string, unknown>);
      } else {
        onError?.(result.error || 'Ошибка входа через Facebook');
      }
    } catch {
      onError?.('Ошибка входа через Facebook');
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const result = await SocialAuthService.signInWithApple();
      if (result.success) {
        onSuccess?.(result.user as unknown as Record<string, unknown>);
      } else {
        onError?.(result.error || 'Ошибка входа через Apple');
      }
    } catch {
      onError?.('Ошибка входа через Apple');
    }
  };

  return (
    <View style={SocialAuthButtonsStyles.container}>
      <TouchableOpacity
        style={SocialAuthButtonsStyles.googleButton}
        onPress={handleGoogleSignIn}
      >
        <Ionicons name="logo-google" size={20} color="#DB4437" />
        <Text style={SocialAuthButtonsStyles.googleText}>
          Продолжить с Google
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={SocialAuthButtonsStyles.facebookButton}
        onPress={handleFacebookSignIn}
      >
        <Ionicons name="logo-facebook" size={20} color="#FFFFFF" />
        <Text style={SocialAuthButtonsStyles.facebookText}>
          Продолжить с Facebook
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={SocialAuthButtonsStyles.appleButton}
        onPress={handleAppleSignIn}
      >
        <Ionicons name="logo-apple" size={20} color="#FFFFFF" />
        <Text style={SocialAuthButtonsStyles.appleText}>
          Продолжить с Apple
        </Text>
      </TouchableOpacity>
    </View>
  );
} 