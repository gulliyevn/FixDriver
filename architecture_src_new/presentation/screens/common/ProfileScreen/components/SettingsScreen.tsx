import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert, ActivityIndicator, Modal } from 'react-native';
import { ChevronLeft, Bell, Globe, Palette, Shield, LogOut, User, Car, Settings as SettingsIcon } from '../../../../../shared/components/IconLibrary';
import { useTheme } from '../../../../../core/context/ThemeContext';
import { useI18n } from '../../../../../shared/i18n';
import { useAuth } from '../../../../../core/context/AuthContext';
import { createSettingsScreenStyles } from './styles/SettingsScreen.styles.ts';

interface SettingsScreenProps {
  onBack: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const { language, changeLanguage, t } = useI18n();
  const { logout, user } = useAuth();
  const styles = createSettingsScreenStyles(colors);

  const [isLoading, setIsLoading] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    pushNotifications: true,
    emailNotifications: false,
    smsNotifications: false,
    tripUpdates: true,
    promotions: false,
    securityAlerts: true,
  });

  const isDriver = user?.role === 'driver';

  // Условная логика для разных ролей
  const getScreenTitle = () => {
    return isDriver ? t('driver.settings') : t('profile.settings.title');
  };

  // Обработчики настроек уведомлений
  const handleNotificationToggle = (key: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Сохранение настроек (заглушка)
  const saveSettings = async () => {
    setIsLoading(true);
    try {
      // TODO: Интеграция с бэкендом для сохранения настроек пользователя
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Успех', 'Настройки сохранены');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить настройки');
    } finally {
      setIsLoading(false);
    }
  };

  // Смена языка
  const handleLanguageChange = (newLanguage: string) => {
    changeLanguage(newLanguage);
    setLanguageModalVisible(false);
  };

  // Выход из аккаунта
  const handleLogout = () => {
    Alert.alert(
      'Выход',
      'Вы уверены, что хотите выйти из аккаунта?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Выйти', 
          style: 'destructive',
          onPress: logout
        }
      ]
    );
  };

  // Опции языка
  const languageOptions = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'az', name: 'Azərbaycan', flag: '🇦🇿' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ];

  const currentLanguage = languageOptions.find(lang => lang.code === language);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{getScreenTitle()}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Основные настройки */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.settings.general')}</Text>
          
          {/* Тема */}
          <TouchableOpacity style={styles.settingItem} onPress={toggleTheme}>
            <View style={styles.settingLeft}>
              <Palette size={24} color={colors.text} />
              <Text style={styles.settingLabel}>{t('profile.settings.theme')}</Text>
            </View>
            <Text style={styles.settingValue}>
              {isDark ? t('profile.settings.dark') : t('profile.settings.light')}
            </Text>
          </TouchableOpacity>

          {/* Язык */}
          <TouchableOpacity 
            style={styles.settingItem} 
            onPress={() => setLanguageModalVisible(true)}
          >
            <View style={styles.settingLeft}>
              <Globe size={24} color={colors.text} />
              <Text style={styles.settingLabel}>{t('profile.settings.language')}</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>{currentLanguage?.flag} {currentLanguage?.name}</Text>
              <ChevronLeft size={16} color={colors.textSecondary} style={styles.chevron} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Уведомления */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.settings.notifications')}</Text>
          
          {/* Push уведомления */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={24} color={colors.text} />
              <Text style={styles.settingLabel}>{t('profile.settings.pushNotifications')}</Text>
            </View>
            <Switch
              value={notificationSettings.pushNotifications}
              onValueChange={(value) => handleNotificationToggle('pushNotifications', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={notificationSettings.pushNotifications ? colors.background : colors.textSecondary}
            />
          </View>

          {/* Обновления поездок */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Car size={24} color={colors.text} />
              <Text style={styles.settingLabel}>{t('profile.settings.tripUpdates')}</Text>
            </View>
            <Switch
              value={notificationSettings.tripUpdates}
              onValueChange={(value) => handleNotificationToggle('tripUpdates', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={notificationSettings.tripUpdates ? colors.background : colors.textSecondary}
            />
          </View>

          {/* Промоакции */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={24} color={colors.text} />
              <Text style={styles.settingLabel}>{t('profile.settings.promotions')}</Text>
            </View>
            <Switch
              value={notificationSettings.promotions}
              onValueChange={(value) => handleNotificationToggle('promotions', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={notificationSettings.promotions ? colors.background : colors.textSecondary}
            />
          </View>

          {/* Безопасность */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Shield size={24} color={colors.text} />
              <Text style={styles.settingLabel}>{t('profile.settings.securityAlerts')}</Text>
            </View>
            <Switch
              value={notificationSettings.securityAlerts}
              onValueChange={(value) => handleNotificationToggle('securityAlerts', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={notificationSettings.securityAlerts ? colors.background : colors.textSecondary}
            />
          </View>
        </View>

        {/* Роль-специфичные настройки */}
        {isDriver && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('driver.settings.driverSpecific')}</Text>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Car size={24} color={colors.text} />
                <Text style={styles.settingLabel}>{t('driver.settings.vehicleSettings')}</Text>
              </View>
              <ChevronLeft size={16} color={colors.textSecondary} style={styles.chevron} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Shield size={24} color={colors.text} />
                <Text style={styles.settingLabel}>{t('driver.settings.documentSettings')}</Text>
              </View>
              <ChevronLeft size={16} color={colors.textSecondary} style={styles.chevron} />
            </TouchableOpacity>
          </View>
        )}

        {/* Кнопка сохранения */}
        <TouchableOpacity 
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]} 
          onPress={saveSettings}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={styles.saveButtonText}>{t('profile.settings.save')}</Text>
          )}
        </TouchableOpacity>

        {/* Кнопка выхода */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={colors.error} />
          <Text style={[styles.logoutButtonText, { color: colors.error }]}>
            {t('profile.settings.logout')}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Модальное окно выбора языка */}
      <Modal
        visible={languageModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('profile.settings.selectLanguage')}</Text>
              <TouchableOpacity onPress={() => setLanguageModalVisible(false)}>
                <Text style={styles.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.languageList}>
              {languageOptions.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageItem,
                    language === lang.code && styles.languageItemSelected
                  ]}
                  onPress={() => handleLanguageChange(lang.code)}
                >
                  <Text style={styles.languageFlag}>{lang.flag}</Text>
                  <Text style={[
                    styles.languageName,
                    language === lang.code && styles.languageNameSelected
                  ]}>
                    {lang.name}
                  </Text>
                  {language === lang.code && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SettingsScreen;
