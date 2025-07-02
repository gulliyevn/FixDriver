import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import SocialAuthService from '../services/SocialAuthService';

interface SocialAuthButtonsProps {
  onGooglePress: () => void;
  onFacebookPress: () => void;
  onApplePress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({
  onGooglePress,
  onFacebookPress,
  onApplePress,
  isLoading = false,
  disabled = false,
}) => {
  const { isDark } = useTheme();

  const isGoogleAvailable = SocialAuthService.isSocialAuthAvailable('google');
  const isFacebookAvailable = SocialAuthService.isSocialAuthAvailable('facebook');
  const isAppleAvailable = SocialAuthService.isSocialAuthAvailable('apple');

  return (
    <View style={styles.container}>
      {/* Google и Facebook кнопки в ряд */}
      <View style={styles.socialButtons}>
        {isGoogleAvailable && (
          <TouchableOpacity 
            style={[
              styles.socialButton, 
              styles.googleButton, 
              isDark && styles.socialButtonDark,
              (isLoading || disabled) && styles.buttonDisabled
            ]} 
            onPress={onGooglePress}
            disabled={isLoading || disabled}
          >
            <Ionicons name="logo-google" size={24} color="#DB4437" />
            <Text style={[
              styles.socialButtonText, 
              isDark && styles.socialButtonTextDark,
              (isLoading || disabled) && styles.textDisabled
            ]}>
              Google
            </Text>
          </TouchableOpacity>
        )}

        {isFacebookAvailable && (
          <TouchableOpacity 
            style={[
              styles.socialButton, 
              styles.facebookButton, 
              isDark && styles.socialButtonDark,
              (isLoading || disabled) && styles.buttonDisabled
            ]} 
            onPress={onFacebookPress}
            disabled={isLoading || disabled}
          >
            <Ionicons name="logo-facebook" size={24} color="#4267B2" />
            <Text style={[
              styles.socialButtonText, 
              isDark && styles.socialButtonTextDark,
              (isLoading || disabled) && styles.textDisabled
            ]}>
              Facebook
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Apple кнопка отдельно */}
      {isAppleAvailable && (
        <TouchableOpacity 
          style={[
            styles.appleButton, 
            isDark && styles.appleButtonDark,
            (isLoading || disabled) && styles.buttonDisabled
          ]} 
          onPress={onApplePress}
          disabled={isLoading || disabled}
        >
          <Ionicons 
            name="logo-apple" 
            size={24} 
            color={isDark ? '#FFFFFF' : '#000000'} 
          />
          <Text style={[
            styles.appleButtonText, 
            isDark && styles.appleButtonTextDark,
            (isLoading || disabled) && styles.textDisabled
          ]}>
            Войти с Apple
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  socialButtonDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  googleButton: {
    // Специфичные стили для Google
  },
  facebookButton: {
    // Специфичные стили для Facebook
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  socialButtonTextDark: {
    color: '#D1D5DB',
  },
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appleButtonDark: {
    backgroundColor: '#FFFFFF',
  },
  appleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  appleButtonTextDark: {
    color: '#000000',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  textDisabled: {
    opacity: 0.7,
  },
});

export default SocialAuthButtons; 