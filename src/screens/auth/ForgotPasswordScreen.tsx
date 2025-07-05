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

interface ForgotPasswordScreenProps {
  navigation: any;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { isDark } = useTheme();

  const handleSendResetEmail = async () => {
    if (!email) {
      Alert.alert('Ошибка', 'Пожалуйста, введите ваш email');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Ошибка', 'Пожалуйста, введите корректный email адрес');
      return;
    }

    setIsLoading(true);
    
    // Симуляция отправки email
    setTimeout(() => {
      setIsLoading(false);
      setEmailSent(true);
      Alert.alert(
        'Email отправлен',
        'Мы отправили инструкции по восстановлению пароля на ваш email адрес.',
        [{ text: 'OK' }]
      );
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
              Забыли пароль?
            </Text>
            <Text style={[ForgotPasswordScreenStyles.subtitle, isDark && ForgotPasswordScreenStyles.subtitleDark]}>
              Не волнуйтесь! Введите ваш email адрес и мы отправим вам ссылку для восстановления пароля.
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
                placeholder="Введите ваш email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={isDark ? '#6B7280' : '#999'}
                editable={!emailSent}
              />
              {emailSent && (
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              )}
            </View>

            <TouchableOpacity
              style={[
                ForgotPasswordScreenStyles.sendButton,
                isLoading && ForgotPasswordScreenStyles.sendButtonDisabled,
                emailSent && ForgotPasswordScreenStyles.sendButtonSuccess,
              ]}
              onPress={handleSendResetEmail}
              disabled={isLoading || emailSent}
            >
              <Text style={ForgotPasswordScreenStyles.sendButtonText}>
                {isLoading
                  ? 'Отправка...'
                  : emailSent
                  ? 'Email отправлен'
                  : 'Отправить ссылку для восстановления'}
              </Text>
              {!isLoading && !emailSent && (
                <Ionicons name="send" size={20} color="#FFFFFF" />
              )}
              {emailSent && <Ionicons name="checkmark" size={20} color="#FFFFFF" />}
            </TouchableOpacity>

            {emailSent && (
              <View style={[ForgotPasswordScreenStyles.successMessage, isDark && ForgotPasswordScreenStyles.successMessageDark]}>
                <Ionicons name="mail" size={24} color="#10B981" />
                <Text style={[ForgotPasswordScreenStyles.successText, isDark && ForgotPasswordScreenStyles.successTextDark]}>
                  Проверьте вашу почту
                </Text>
                <Text style={[ForgotPasswordScreenStyles.successSubtext, isDark && ForgotPasswordScreenStyles.successSubtextDark]}>
                  Мы отправили инструкции по восстановлению пароля на {email}
                </Text>
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={ForgotPasswordScreenStyles.footer}>
            <Text style={[ForgotPasswordScreenStyles.footerText, isDark && ForgotPasswordScreenStyles.footerTextDark]}>
              Вспомнили пароль?{' '}
            </Text>
            <TouchableOpacity onPress={handleBackToLogin}>
              <Text style={ForgotPasswordScreenStyles.linkText}>Войти</Text>
            </TouchableOpacity>
          </View>

          {/* Help Section */}
          <View style={ForgotPasswordScreenStyles.helpSection}>
            <Text style={[ForgotPasswordScreenStyles.helpTitle, isDark && ForgotPasswordScreenStyles.helpTitleDark]}>
              Нужна помощь?
            </Text>
            <TouchableOpacity style={ForgotPasswordScreenStyles.helpButton} onPress={() => {
              const whatsappNumber = '+994516995513';
              const message = 'Здравствуйте! Мне нужна помощь с восстановлением пароля в приложении FixDrive.';
              const whatsappUrl = `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
              
              Linking.canOpenURL(whatsappUrl)
                .then((supported) => {
                  if (supported) {
                    return Linking.openURL(whatsappUrl);
                  } else {
                    // Fallback to web WhatsApp
                    const webWhatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
                    return Linking.openURL(webWhatsappUrl);
                  }
                })
                .catch((err) => {
                  console.error('Error opening WhatsApp:', err);
                  Alert.alert('Ошибка', 'Не удалось открыть WhatsApp. Попробуйте связаться с нами по телефону: +994516995513');
                });
            }}>
              <Ionicons
                name="logo-whatsapp"
                size={16}
                color="#25D366"
              />
              <Text style={ForgotPasswordScreenStyles.helpButtonText}>Связаться с поддержкой</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
