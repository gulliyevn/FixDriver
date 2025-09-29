import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { ChevronLeft, HelpCircle, FileText, CreditCard, Shield, Phone, MessageCircle } from '../../../../../shared/components/IconLibrary';
import { useTheme } from '../../../../../core/context/ThemeContext';
import { useAuth } from '../../../../../core/context/AuthContext';
import { useI18n } from '../../../../../shared/i18n';
import { createHelpScreenStyles } from './styles/HelpScreen.styles';

interface HelpScreenProps {
  onBack: () => void;
}

/**
 * Экран помощи и правил
 * 
 * TODO для интеграции с бэкендом:
 * 1. Заменить статичные данные на API вызовы
 * 2. Подключить HelpService для получения FAQ
 * 3. Добавить обработку ошибок и загрузки
 * 4. Реализовать поиск по FAQ
 * 5. Подключить чат поддержки
 */

const HelpScreen: React.FC<HelpScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { t } = useI18n();
  const styles = createHelpScreenStyles(colors);
  
  // Определяем роль пользователя
  const isDriver = user?.role === 'driver';
  
  // Состояние для модальных окон
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  
  // Условная логика для разных ролей
  const getScreenTitle = () => {
    return isDriver ? 'Помощь и правила' : 'Помощь и правила';
  };
  
  // Обработчик контакта с поддержкой
  const handleSupportContact = async () => {
    const phoneNumber = '+994516995513';
    const message = 'Привет! Мне нужна помощь с приложением FixDrive.';
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    
    try {
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        // Fallback на обычный звонок
        await Linking.openURL(`tel:${phoneNumber}`);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось открыть WhatsApp');
      console.error('WhatsApp contact error:', error);
    }
  };
  
  // Обработчик открытия правил
  const handleOpenRules = () => {
    setShowRulesModal(true);
  };
  
  // Обработчик открытия помощи по бронированию
  const handleOpenBookingHelp = () => {
    setShowBookingModal(true);
  };
  
  // Обработчик открытия помощи по платежам
  const handleOpenPaymentHelp = () => {
    setShowPaymentModal(true);
  };
  
  // Обработчик открытия помощи по безопасности
  const handleOpenSafetyHelp = () => {
    setShowSafetyModal(true);
  };
  
  // Получение списка помощи в зависимости от роли
  const getHelpItems = () => {
    const baseItems = [
      {
        id: 'rules',
        title: 'Правила и условия',
        description: 'Ознакомьтесь с правилами использования сервиса',
        icon: FileText,
        onPress: handleOpenRules
      },
      {
        id: 'booking',
        title: 'Как заказать такси',
        description: 'Пошаговая инструкция по бронированию',
        icon: HelpCircle,
        onPress: handleOpenBookingHelp
      },
      {
        id: 'payment',
        title: 'Способы оплаты',
        description: 'Информация о доступных способах оплаты',
        icon: CreditCard,
        onPress: handleOpenPaymentHelp
      },
      {
        id: 'safety',
        title: 'Безопасность',
        description: 'Правила безопасности в поездках',
        icon: Shield,
        onPress: handleOpenSafetyHelp
      }
    ];
    
    // Для водителей добавляем дополнительные пункты
    if (isDriver) {
      return [
        ...baseItems,
        {
          id: 'driver-rules',
          title: 'Правила для водителей',
          description: 'Особые правила и требования для водителей',
          icon: FileText,
          onPress: () => Alert.alert('Правила для водителей', 'Модальное окно будет реализовано')
        }
      ];
    }
    
    return baseItems;
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
          <Text style={styles.description}>
            Здесь вы найдете ответы на часто задаваемые вопросы и полезную информацию о сервисе.
          </Text>
          
          {/* Help Items */}
          {getHelpItems().map((item) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.helpItem}
                onPress={item.onPress}
              >
                <View style={styles.helpIcon}>
                  <IconComponent size={24} color={colors.primary} />
                </View>
                <View style={styles.helpInfo}>
                  <Text style={styles.helpTitle}>{item.title}</Text>
                  <Text style={styles.helpDescription}>{item.description}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
          
          {/* Contact Section */}
          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>Нужна помощь?</Text>
            <Text style={styles.contactDescription}>
              Свяжитесь с нашей службой поддержки через WhatsApp
            </Text>
            <TouchableOpacity style={styles.contactButton} onPress={handleSupportContact}>
              <MessageCircle size={20} color="#FFFFFF" style={styles.supportIcon} />
              <Text style={styles.contactButtonText}>Написать в поддержку</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HelpScreen;
