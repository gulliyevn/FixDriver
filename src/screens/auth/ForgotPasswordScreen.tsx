import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { ForgotPasswordScreenStyles } from '../../styles/screens/ForgotPasswordScreen.styles';
import { useLanguage } from '../../context/LanguageContext';

interface ForgotPasswordScreenProps {
  navigation: {
    goBack: () => void;
  };
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const handleSendResetEmail = async () => {
    if (!email) {
      Alert.alert(t('login.forgotPassword.errorTitle'), t('login.forgotPassword.errorEmpty'));
      return;
    }
    if (!email.includes('@')) {
      Alert.alert(t('login.forgotPassword.errorTitle'), t('login.forgotPassword.errorInvalid'));
      return;
    }
    setIsLoading(true);
      setTimeout(() => {
      setIsLoading(false);
      Alert.alert(t('login.forgotPassword.successTitle'), t('login.forgotPassword.successText'));
    }, 2000);
  };

  const handleBackToLogin = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[ForgotPasswordScreenStyles.container, isDark && ForgotPasswordScreenStyles.containerDark]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={ForgotPasswordScreenStyles.keyboardView}
      >
        <ScrollView contentContainerStyle={ForgotPasswordScreenStyles.scrollContent}>
          {/* Header */}
          <View style={ForgotPasswordScreenStyles.header}>
            <TouchableOpacity style={ForgotPasswordScreenStyles.backButton} onPress={handleBackToLogin}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={isDark ? '#F9FAFB' : '#111827'}
              />
            </TouchableOpacity>
            <View style={[ForgotPasswordScreenStyles.iconContainer, isDark && ForgotPasswordScreenStyles.iconContainerDark]}>
              <Ionicons name="lock-closed" size={48} color="#1E3A8A" />
            </View>
            <Text style={[ForgotPasswordScreenStyles.title, isDark && ForgotPasswordScreenStyles.titleDark]}>
              {t('login.forgotPassword.title')}
            </Text>
          </View>

          {/* Form */}
          <View style={ForgotPasswordScreenStyles.form}>
            <View style={[ForgotPasswordScreenStyles.inputContainer, isDark && ForgotPasswordScreenStyles.inputContainerDark]}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={isDark ? '#9CA3AF' : '#666'}
                style={ForgotPasswordScreenStyles.inputIcon}
              />
              <TextInput
                style={[ForgotPasswordScreenStyles.input, isDark && ForgotPasswordScreenStyles.inputDark]}
                placeholder={t('login.forgotPassword.emailPlaceholder')}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={isDark ? '#6B7280' : '#999'}
              />
            </View>
            <TouchableOpacity
              style={ForgotPasswordScreenStyles.sendButton}
              onPress={handleSendResetEmail}
              disabled={isLoading}
            >
              <Text style={ForgotPasswordScreenStyles.sendButtonText}>
                {isLoading ? t('login.forgotPassword.sending') : t('login.forgotPassword.sendButton')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Text
          style={ForgotPasswordScreenStyles.loginLinkUnderline}
          onPress={handleBackToLogin}
        >
          {t('login.loginButton')}
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
