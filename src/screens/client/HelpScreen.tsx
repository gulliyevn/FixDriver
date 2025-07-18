import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Pressable, ScrollView, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClientScreenProps } from '../../types/navigation';
import { HelpScreenStyles as styles, getHelpScreenStyles } from '../../styles/screens/profile/HelpScreen.styles';
import RulesModal from '../../components/RulesModal';
import BookingHelpModal from '../../components/BookingHelpModal';
import PaymentHelpModal from '../../components/PaymentHelpModal';
import SafetyHelpModal from '../../components/SafetyHelpModal';
import { useTheme } from '../../context/ThemeContext';

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

const HelpScreen: React.FC<ClientScreenProps<'Help'>> = ({ navigation }) => {
  const { isDark } = useTheme();
  const dynamicStyles = getHelpScreenStyles(isDark);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);


  const handleSupportContact = async () => {
    const phoneNumber = '+994516995513';
    const message = 'Здравствуйте! Мне нужна помощь с приложением FixDrive.';
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    const webUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    try {
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось открыть WhatsApp');
    }
  };
  const helpSections = [
    {
      id: '1',
      title: 'Как заказать поездку?',
      icon: 'car',
      description: 'Узнайте, как быстро заказать поездку'
    },
    {
      id: '2',
      title: 'Оплата и тарифы',
      icon: 'card',
      description: 'Информация о способах оплаты и тарифах'
    },
    {
      id: '3',
      title: 'Безопасность',
      icon: 'shield-checkmark',
      description: 'Меры безопасности в поездках'
    },
    {
      id: '4',
      title: 'Правила пользования',
      icon: 'document-text',
      description: 'Основные правила сервиса'
    },
    {
      id: '5',
      title: 'Поддержка',
      icon: 'chatbubbles',
      description: 'Связаться с поддержкой'
    }
  ];

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <View style={[styles.header, dynamicStyles.header]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#003366'} />
        </TouchableOpacity>
        <Text style={[styles.title, dynamicStyles.title]}>Помощь и правила</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.description, dynamicStyles.description]}>
          Найдите ответы на часто задаваемые вопросы и ознакомьтесь с правилами сервиса
        </Text>
        
        {helpSections.map((section) => (
          <TouchableOpacity 
            key={section.id} 
            style={[styles.helpItem, dynamicStyles.helpItem]}
            onPress={() => {
              switch(section.id) {
                case '1':
                  setShowBookingModal(true);
                  break;
                case '2':
                  setShowPaymentModal(true);
                  break;
                case '3':
                  setShowSafetyModal(true);
                  break;
                case '4':
                  setShowRulesModal(true);
                  break;
                case '5':
                  navigation.navigate('SupportChat');
                  break;
              }
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.helpIcon, dynamicStyles.helpIcon]}>
              <Ionicons name={section.icon as any} size={24} color={isDark ? '#fff' : '#003366'} />
            </View>
            <View style={styles.helpInfo}>
              <Text style={[styles.helpTitle, dynamicStyles.helpTitle]}>{section.title}</Text>
              <Text style={[styles.helpDescription, dynamicStyles.helpDescription]}>{section.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#666' : '#ccc'} />
          </TouchableOpacity>
        ))}
        
        <View style={styles.contactSection}>
          <Text style={[styles.contactTitle, dynamicStyles.contactTitle]}>Нужна помощь?</Text>
          <Text style={[styles.contactDescription, dynamicStyles.contactDescription]}>
            Свяжитесь с нашей службой поддержки
          </Text>
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={handleSupportContact}
          >
            <Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" style={styles.supportIcon} />
            <Text style={styles.contactButtonText}>Связаться с поддержкой</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <RulesModal 
        visible={showRulesModal}
        onClose={() => setShowRulesModal(false)}
      />
      <BookingHelpModal 
        visible={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />
      <PaymentHelpModal 
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
      />
      <SafetyHelpModal 
        visible={showSafetyModal}
        onClose={() => setShowSafetyModal(false)}
      />
    </View>
  );
};

export default HelpScreen; 