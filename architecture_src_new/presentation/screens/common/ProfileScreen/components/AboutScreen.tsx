import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, Modal } from 'react-native';
import { ChevronLeft, Info, FileText, Shield, Globe, ExternalLink, X } from '../../../../../shared/components/IconLibrary';
import { useTheme } from '../../../../../core/context/ThemeContext';
import { useAuth } from '../../../../../core/context/AuthContext';
import { useI18n } from '../../../../../shared/i18n';
import { createAboutScreenStyles } from './styles/AboutScreen.styles';

interface AboutScreenProps {
  onBack: () => void;
}

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

const AboutScreen: React.FC<AboutScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { t } = useI18n();
  const styles = createAboutScreenStyles(colors);
  
  // Определяем роль пользователя
  const isDriver = user?.role === 'driver';
  
  // Состояние для модальных окон
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  
  // Условная логика для разных ролей
  const getScreenTitle = () => {
    return isDriver ? 'О приложении' : 'О приложении';
  };
  
  // Информация о приложении
  const appInfo = {
    name: 'FixDrive',
    version: '1.0.0',
    build: '2025.07.01'
  };
  
  // Обработчик открытия ссылки
  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };
  
  // Обработчик открытия политики конфиденциальности
  const handleOpenPrivacy = () => {
    setShowPrivacyModal(true);
  };
  
  // Обработчик открытия условий использования
  const handleOpenTerms = () => {
    setShowTermsModal(true);
  };
  
  // Получение информации о приложении в зависимости от роли
  const getAppInfo = () => {
    const baseInfo = [
      { label: 'Версия', value: appInfo.version },
      { label: 'Сборка', value: appInfo.build },
      { label: 'Дата сборки', value: '01.07.2025' }
    ];
    
    // Для водителей добавляем дополнительную информацию
    if (isDriver) {
      return [
        ...baseInfo,
        { label: 'Режим', value: 'Водитель' },
        { label: 'Статус', value: 'Активен' }
      ];
    }
    
    return baseInfo;
  };
  
  // Получение ссылок в зависимости от роли
  const getLinks = () => {
    const baseLinks = [
      {
        id: 'privacy',
        title: 'Политика конфиденциальности',
        icon: Shield,
        onPress: handleOpenPrivacy
      },
      {
        id: 'terms',
        title: 'Условия использования',
        icon: FileText,
        onPress: handleOpenTerms
      },
      {
        id: 'website',
        title: 'Официальный сайт',
        icon: Globe,
        onPress: () => handleOpenLink('https://fixdrive.az')
      }
    ];
    
    // Для водителей добавляем дополнительные ссылки
    if (isDriver) {
      return [
        ...baseLinks,
        {
          id: 'driver-rules',
          title: 'Правила для водителей',
          icon: FileText,
          onPress: () => handleOpenLink('https://fixdrive.az/driver-rules')
        }
      ];
    }
    
    return baseLinks;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{getScreenTitle()}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          {/* App Info */}
          <View style={styles.appInfo}>
            <View style={styles.appIcon}>
              <Text style={styles.appIconText}>FD</Text>
            </View>
            <View style={styles.appTextContainer}>
              <Text style={styles.appName}>{appInfo.name}</Text>
              <Text style={styles.appVersion}>Версия {appInfo.version}</Text>
            </View>
          </View>
          
          <Text style={styles.appDescription}>
            Современное приложение для заказа такси с удобным интерфейсом и быстрым сервисом.
          </Text>
          
          {/* App Information */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Информация о приложении</Text>
            {getAppInfo().map((info, index) => (
              <View key={index} style={styles.infoItem}>
                <Text style={styles.infoLabel}>{info.label}</Text>
                <Text style={styles.infoValue}>{info.value}</Text>
              </View>
            ))}
          </View>
          
          {/* Links */}
          <View style={styles.linksSection}>
            <Text style={styles.sectionTitle}>Полезные ссылки</Text>
            {getLinks().map((link) => {
              const IconComponent = link.icon;
              return (
                <TouchableOpacity
                  key={link.id}
                  style={styles.linkItem}
                  onPress={link.onPress}
                >
                  <IconComponent size={20} color={colors.primary} />
                  <Text style={styles.linkText}>{link.title}</Text>
                  <ExternalLink size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Privacy Modal */}
      <Modal
        visible={showPrivacyModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowPrivacyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Политика конфиденциальности</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowPrivacyModal(false)}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScrollView}>
              <Text style={styles.modalText}>
                Здесь будет текст политики конфиденциальности...
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Terms Modal */}
      <Modal
        visible={showTermsModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowTermsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Условия использования</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowTermsModal(false)}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScrollView}>
              <Text style={styles.modalText}>
                Здесь будут условия использования...
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AboutScreen;
