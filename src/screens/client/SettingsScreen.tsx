import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClientScreenProps } from '../../types/navigation';
import { SettingsScreenStyles as styles } from '../../styles/screens/profile/SettingsScreen.styles';
import { LanguageModalStyles as languageModalStyles } from '../../styles/components/LanguageModal.styles';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { colors } from '../../constants/colors';

/**
 * Экран настроек
 * 
 * TODO для интеграции с бэкендом:
 * 1. Заменить useState на useSettings hook
 * 2. Подключить SettingsService для API вызовов
 * 3. Добавить обработку ошибок и загрузки
 * 4. Реализовать сохранение настроек
 * 5. Подключить push-уведомления
 * 6. Добавить синхронизацию
 */

const SettingsScreen: React.FC<ClientScreenProps<'Settings'>> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t, language, languageOptions, setLanguage } = useLanguage();
  const currentColors = isDark ? colors.dark : colors.light;
  
  // Хук для push-уведомлений
  const {
    settings: notificationSettings,
    permissions,
    isLoading: notificationsLoading,
    togglePushNotifications,
    requestPermissions,
    openNotificationSettings,
  } = useNotifications();
  
  const [darkMode, setDarkMode] = useState(false);
  const [autoLocation, setAutoLocation] = useState(true);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const handleLanguageChange = () => {
    setLanguageModalVisible(true);
  };

  const selectLanguage = async (langCode: typeof language) => {
    try {
      await setLanguage(langCode);
      setLanguageModalVisible(false);
    } catch (error) {
      Alert.alert(
        t('profile.settings.language.error.title'),
        t('profile.settings.language.error.message')
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={currentColors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('profile.settings.title')}</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Уведомления */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.settings.notifications.title')}</Text>
          
          {notificationsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={currentColors.primary} />
              <Text style={styles.loadingText}>Загрузка настроек уведомлений...</Text>
            </View>
          ) : (
            <>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="notifications" size={24} color={currentColors.primary} />
                  <Text style={styles.settingLabel}>{t('profile.settings.notifications.push')}</Text>
                </View>
                <Switch 
                  value={notificationSettings.pushEnabled} 
                  onValueChange={togglePushNotifications}
                  disabled={!permissions?.granted && !permissions?.canAskAgain}
                />
              </View>

              {/* Кнопки управления */}
              {!permissions?.granted && permissions?.canAskAgain && (
                <TouchableOpacity style={styles.permissionButton} onPress={requestPermissions}>
                  <Text style={styles.permissionButtonText}>Запросить разрешения</Text>
                </TouchableOpacity>
              )}

              {!permissions?.granted && !permissions?.canAskAgain && (
                <TouchableOpacity style={styles.settingsButton} onPress={openNotificationSettings}>
                  <Text style={styles.settingsButtonText}>Открыть настройки</Text>
                </TouchableOpacity>
              )}




            </>
          )}
        </View>

        {/* Язык */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.settings.language.section')}</Text>
          <TouchableOpacity style={styles.settingItem} onPress={handleLanguageChange}>
            <View style={styles.settingInfo}>
              <Ionicons name="language" size={24} color={currentColors.primary} />
              <Text style={styles.settingLabel}>{t('profile.settings.language.current')}</Text>
            </View>
            <View style={styles.languageValue}>
              <Text style={[styles.settingLabel, { color: currentColors.textSecondary }]}>
                {languageOptions.find(lang => lang.code === language)?.flag} {languageOptions.find(lang => lang.code === language)?.name}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={currentColors.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Внешний вид */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.settings.appearance.title')}</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon" size={24} color={currentColors.primary} />
              <Text style={styles.settingLabel}>{t('profile.settings.appearance.darkMode')}</Text>
            </View>
            <Switch value={darkMode} onValueChange={setDarkMode} />
          </View>
        </View>

        {/* Местоположение */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.settings.location.title')}</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="location" size={24} color={currentColors.primary} />
              <Text style={styles.settingLabel}>{t('profile.settings.location.autoLocation')}</Text>
            </View>
            <Switch value={autoLocation} onValueChange={setAutoLocation} />
          </View>
        </View>

        {/* Безопасность */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.settings.security.title')}</Text>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="lock-closed" size={24} color={currentColors.primary} />
              <Text style={styles.settingLabel}>{t('profile.settings.security.changePassword')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={currentColors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="finger-print" size={24} color={currentColors.primary} />
              <Text style={styles.settingLabel}>{t('profile.settings.security.biometric')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={currentColors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Данные */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.settings.data.title')}</Text>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="download" size={24} color={currentColors.primary} />
              <Text style={styles.settingLabel}>{t('profile.settings.data.export')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={currentColors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="trash" size={24} color={currentColors.error} />
              <Text style={[styles.settingLabel, styles.dangerText]}>{t('profile.settings.data.deleteAccount')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={currentColors.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Модал выбора языка */}
      <Modal
        visible={languageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={languageModalStyles.modalOverlay}>
          <View style={languageModalStyles.modalContent}>
                        <View style={languageModalStyles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="language" size={20} color="#003366" style={{ marginRight: 8 }} />
                <Text style={languageModalStyles.modalTitle}>
                  {t('profile.settings.language.title')}
                </Text>
              </View>
                              <TouchableOpacity 
                  onPress={() => setLanguageModalVisible(false)}
                  style={languageModalStyles.closeButton}
                >
                  <Ionicons name="close" size={20} color={currentColors.textSecondary} />
                </TouchableOpacity>
            </View>
            
            <ScrollView style={languageModalStyles.languageList} showsVerticalScrollIndicator={false}>
              {languageOptions.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    languageModalStyles.languageItem,
                    lang.code === language && languageModalStyles.languageItemSelected
                  ]}
                  onPress={() => selectLanguage(lang.code)}
                >
                  <Text style={languageModalStyles.languageFlag}>{lang.flag}</Text>
                  <Text style={[
                    languageModalStyles.languageName,
                    lang.code === language && languageModalStyles.languageNameSelected
                  ]}>
                    {lang.name}
                  </Text>
                  {lang.code === language && (
                    <Ionicons name="checkmark-circle" size={24} color="#2196f3" />
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