import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClientScreenProps } from '../../types/navigation';
import { SettingsScreenStyles as styles, getSettingsScreenColors } from '../../styles/screens/profile/SettingsScreen.styles';
import { LanguageModalStyles as languageModalStyles, getLanguageModalColors } from '../../styles/components/LanguageModal.styles';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { useAuth } from '../../context/AuthContext';
import { ProfileService } from '../../services/ProfileService';
import { getCurrentColors } from '../../constants/colors';

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
  const { isDark, theme, toggleTheme } = useTheme();
  const { language, languageOptions, setLanguage, t } = useLanguage();
  const { logout } = useAuth();
  

  const currentColors = getCurrentColors(isDark);
  const languageModalColors = getLanguageModalColors(isDark);
  const settingsColors = getSettingsScreenColors(isDark);
  
  // Хук для push-уведомлений
  const {
    settings: notificationSettings,
    permissions,
    isLoading: notificationsLoading,
    togglePushNotifications,
    requestPermissions,
    openNotificationSettings,
  } = useNotifications();
  
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
    <View style={[styles.container, settingsColors.container]}>
      <View style={[styles.header, settingsColors.header]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={currentColors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, settingsColors.title]}>{t('profile.settings.title')}</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Уведомления */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, settingsColors.sectionTitle]}>{t('profile.settings.notifications.title')}</Text>
          
          {notificationsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={currentColors.primary} />
              <Text style={[styles.loadingText, settingsColors.loadingText]}>Загрузка настроек уведомлений...</Text>
            </View>
          ) : (
            <>
              <View style={[styles.settingItem, settingsColors.settingItem]}>
                <View style={styles.settingInfo}>
                  <Ionicons name="notifications" size={24} color={currentColors.primary} />
                  <Text style={[styles.settingLabel, settingsColors.settingLabel]}>{t('profile.settings.notifications.push')}</Text>
                </View>
                <Switch 
                  value={notificationSettings.pushEnabled} 
                  onValueChange={togglePushNotifications}
                />
              </View>
              
              {!permissions.granted && (
                <TouchableOpacity 
                  style={styles.permissionButton}
                  onPress={requestPermissions}
                >
                  <Text style={styles.permissionButtonText}>
                    Разрешить уведомления
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {/* Язык */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, settingsColors.sectionTitle]}>{t('profile.settings.language.section')}</Text>
          <TouchableOpacity style={[styles.settingItem, settingsColors.settingItem]} onPress={handleLanguageChange}>
            <View style={styles.settingInfo}>
              <Ionicons name="language" size={24} color={currentColors.primary} />
              <Text style={[styles.settingLabel, settingsColors.settingLabel]}>{t('profile.settings.language.current')}</Text>
            </View>
            <View style={styles.languageValue}>
              <Text style={[styles.settingLabel, { color: currentColors.textSecondary, fontWeight: '600' }]}>
                {languageOptions.find(lang => lang.code === language)?.flag} {languageOptions.find(lang => lang.code === language)?.name}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={currentColors.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Внешний вид */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, settingsColors.sectionTitle]}>{t('profile.settings.appearance.title')}</Text>
          <View style={[styles.settingItem, settingsColors.settingItem]}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon" size={24} color={currentColors.primary} />
              <Text style={[styles.settingLabel, settingsColors.settingLabel]}>{t('profile.settings.appearance.darkMode')}</Text>
            </View>
            <Switch value={isDark} onValueChange={toggleTheme} />
          </View>
        </View>

        {/* Местоположение */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, settingsColors.sectionTitle]}>{t('profile.settings.location.title')}</Text>
          <View style={[styles.settingItem, settingsColors.settingItem]}>
            <View style={styles.settingInfo}>
              <Ionicons name="location" size={24} color={currentColors.primary} />
              <Text style={[styles.settingLabel, settingsColors.settingLabel]}>{t('profile.settings.location.autoLocation')}</Text>
            </View>
            <Switch value={autoLocation} onValueChange={setAutoLocation} />
          </View>
        </View>

        {/* Безопасность */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, settingsColors.sectionTitle]}>{t('profile.settings.security.title')}</Text>
          <TouchableOpacity 
            style={[styles.settingItem, settingsColors.settingItem]}
            onPress={() => navigation.navigate('ChangePassword')}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="lock-closed" size={24} color={currentColors.primary} />
              <Text style={[styles.settingLabel, settingsColors.settingLabel]}>{t('profile.settings.security.changePassword')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={currentColors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Данные */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, settingsColors.sectionTitle]}>{t('profile.settings.data.title')}</Text>
          <TouchableOpacity 
            style={[styles.settingItem, settingsColors.settingItem]}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => {
              Alert.alert(
                t('profile.settings.data.deleteAccount'),
                t('profile.settings.data.deleteAccountConfirm'),
                [
                  { text: t('common.cancel'), style: 'cancel' },
                  { 
                    text: t('profile.settings.data.deleteAccount'), 
                    style: 'destructive',
                                         onPress: async () => {
                       try {
                         // Вызываем API для удаления аккаунта
                         const result = await ProfileService.deleteAccount();
                         
                         if (!result.success) {
                           throw new Error(result.message || 'Failed to delete account');
                         }
                         
                         Alert.alert(
                           t('profile.settings.data.deleteAccountSuccess'),
                           t('profile.settings.data.deleteAccountSuccessMessage'),
                           [
                             {
                               text: t('common.ok'),
                               onPress: async () => {
                                 // Выходим из аккаунта после удаления
                                 await logout();
                                 // Перенаправляем на экран входа
                                 navigation.navigate('Auth', { screen: 'Login' });
                               }
                             }
                           ]
                         );
                       } catch (error) {
                         Alert.alert(
                           t('common.error'),
                           t('profile.settings.data.deleteAccountError') || 'Не удалось удалить аккаунт',
                           [{ text: t('common.ok') }]
                         );
                       }
                     }
                  }
                ]
              );
            }}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="trash" size={24} color={currentColors.error} />
              <Text style={[styles.settingLabel, settingsColors.settingLabel, settingsColors.dangerText]}>{t('profile.settings.data.deleteAccount')}</Text>
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
          <View style={[languageModalStyles.modalContent, languageModalColors.modalContent]}>
            <View style={[languageModalStyles.modalHeader, languageModalColors.modalHeader]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="language" size={20} color={currentColors.primary} style={{ marginRight: 8 }} />
                <Text style={[languageModalStyles.modalTitle, languageModalColors.modalTitle]}>
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
                    languageModalColors.languageItem,
                    lang.code === language && languageModalStyles.languageItemSelected,
                    lang.code === language && languageModalColors.languageItemSelected
                  ]}
                  onPress={() => selectLanguage(lang.code)}
                >
                  <Text style={languageModalStyles.languageFlag}>{lang.flag}</Text>
                  <Text style={[
                    languageModalStyles.languageName,
                    languageModalColors.languageName,
                    lang.code === language && languageModalStyles.languageNameSelected,
                    lang.code === language && languageModalColors.languageNameSelected
                  ]}>
                    {lang.name}
                  </Text>
                  {lang.code === language && (
                    <Ionicons name="checkmark-circle" size={24} color={currentColors.primary} />
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