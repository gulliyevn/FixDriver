import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClientScreenProps } from '../../types/navigation';
import { SettingsScreenStyles as styles } from '../../styles/screens/profile/SettingsScreen.styles';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
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
  
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoLocation, setAutoLocation] = useState(true);

  const handleLanguageChange = () => {
    const currentLangInfo = languageOptions.find(lang => lang.code === language);
    
    const languageButtons = languageOptions.map(lang => ({
      text: `${lang.flag} ${lang.name}`,
      onPress: async () => {
        try {
          await setLanguage(lang.code);
          Alert.alert(
            t('profile.settings.language.success.title'),
            t('profile.settings.language.success.message', { language: lang.name })
          );
        } catch (error) {
          Alert.alert(
            t('profile.settings.language.error.title'),
            t('profile.settings.language.error.message')
          );
        }
      }
    }));
    
    Alert.alert(
      t('profile.settings.language.title'),
      t('profile.settings.language.select'),
      [...languageButtons, { text: t('common.cancel'), style: 'cancel' as const }]
    );
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
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications" size={24} color={currentColors.primary} />
              <Text style={styles.settingLabel}>{t('profile.settings.notifications.push')}</Text>
            </View>
            <Switch value={notifications} onValueChange={setNotifications} />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="volume-high" size={24} color={currentColors.primary} />
              <Text style={styles.settingLabel}>{t('profile.settings.notifications.sound')}</Text>
            </View>
            <Switch value={sound} onValueChange={setSound} />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="phone-portrait" size={24} color={currentColors.primary} />
              <Text style={styles.settingLabel}>{t('profile.settings.notifications.vibration')}</Text>
            </View>
            <Switch value={vibration} onValueChange={setVibration} />
          </View>
        </View>

        {/* Язык */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.settings.language.section')}</Text>
          <TouchableOpacity style={styles.settingItem} onPress={handleLanguageChange}>
            <View style={styles.settingInfo}>
              <Ionicons name="language" size={24} color={currentColors.primary} />
              <Text style={styles.settingLabel}>{t('profile.settings.language.current')}</Text>
            </View>
            <View style={styles.settingInfo}>
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
    </View>
  );
};

export default SettingsScreen; 