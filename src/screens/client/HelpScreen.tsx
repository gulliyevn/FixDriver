import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClientScreenProps } from '../../types/navigation';
import { HelpScreenStyles as styles } from '../../styles/screens/profile/HelpScreen.styles';

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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.title}>Помощь и правила</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.description}>
          Найдите ответы на часто задаваемые вопросы и ознакомьтесь с правилами сервиса
        </Text>
        
        {helpSections.map((section) => (
          <TouchableOpacity key={section.id} style={styles.helpItem}>
            <View style={styles.helpIcon}>
              <Ionicons name={section.icon as any} size={24} color="#003366" />
            </View>
            <View style={styles.helpInfo}>
              <Text style={styles.helpTitle}>{section.title}</Text>
              <Text style={styles.helpDescription}>{section.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}
        
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Нужна помощь?</Text>
          <Text style={styles.contactDescription}>
            Свяжитесь с нашей службой поддержки
          </Text>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>Написать в поддержку</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default HelpScreen; 