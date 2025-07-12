import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClientScreenProps } from '../../types/navigation';
import { AboutScreenStyles as styles } from '../../styles/screens/profile/AboutScreen.styles';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { colors } from '../../constants/colors';

/**
 * Экран информации о приложении
 * 
 * TODO для интеграции с бэкендом:
 * 1. Заменить статичные данные на API вызовы
 * 2. Подключить AppInfoService для получения информации
 * 3. Добавить обработку ошибок и загрузки
 * 4. Реализовать проверку обновлений
 * 5. Подключить аналитику
 */

const AboutScreen: React.FC<ClientScreenProps<'About'>> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const currentColors = isDark ? colors.dark : colors.light;
  
  const appInfo = {
    name: 'FixDrive',
    version: '1.0.0',
    build: '2024.01.15',
    description: 'Сервис заказа такси и поездок в Азербайджане'
  };

  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={currentColors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('client.about.title')}</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.appInfo}>
          <View style={styles.appIcon}>
            <Ionicons name="car" size={64} color={currentColors.primary} />
          </View>
          <Text style={styles.appName}>{appInfo.name}</Text>
          <Text style={styles.appVersion}>{t('client.about.version')} {appInfo.version}</Text>
          <Text style={styles.appDescription}>{appInfo.description}</Text>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>{t('client.about.information')}</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>{t('client.about.version')}</Text>
            <Text style={styles.infoValue}>{appInfo.version}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>{t('client.about.build')}</Text>
            <Text style={styles.infoValue}>{appInfo.build}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>{t('client.about.developer')}</Text>
            <Text style={styles.infoValue}>FixDrive Team</Text>
          </View>
        </View>
        
        <View style={styles.linksSection}>
          <Text style={styles.sectionTitle}>{t('client.about.links')}</Text>
          <TouchableOpacity 
            style={styles.linkItem}
            onPress={() => handleOpenLink('https://fixdrive.az')}
          >
            <Ionicons name="globe" size={24} color={currentColors.primary} />
            <Text style={styles.linkText}>{t('client.about.website')}</Text>
            <Ionicons name="open-outline" size={20} color={currentColors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.linkItem}
            onPress={() => handleOpenLink('mailto:support@fixdrive.az')}
          >
            <Ionicons name="mail" size={24} color={currentColors.primary} />
            <Text style={styles.linkText}>{t('client.about.support')}</Text>
            <Ionicons name="open-outline" size={20} color={currentColors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.linkItem}
            onPress={() => handleOpenLink('https://fixdrive.az/privacy')}
          >
            <Ionicons name="shield-checkmark" size={24} color={currentColors.primary} />
            <Text style={styles.linkText}>{t('client.about.privacy')}</Text>
            <Ionicons name="open-outline" size={20} color={currentColors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.linkItem}
            onPress={() => handleOpenLink('https://fixdrive.az/terms')}
          >
            <Ionicons name="document-text" size={24} color={currentColors.primary} />
            <Text style={styles.linkText}>{t('client.about.terms')}</Text>
            <Ionicons name="open-outline" size={20} color={currentColors.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default AboutScreen; 