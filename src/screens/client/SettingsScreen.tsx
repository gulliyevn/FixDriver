import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClientScreenProps } from '../../types/navigation';
import { SettingsScreenStyles as styles } from '../../styles/screens/profile/SettingsScreen.styles';

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
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoLocation, setAutoLocation] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.title}>Настройки</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Уведомления */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Уведомления</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications" size={24} color="#003366" />
              <Text style={styles.settingLabel}>Push-уведомления</Text>
            </View>
            <Switch value={notifications} onValueChange={setNotifications} />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="volume-high" size={24} color="#003366" />
              <Text style={styles.settingLabel}>Звук</Text>
            </View>
            <Switch value={sound} onValueChange={setSound} />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="phone-portrait" size={24} color="#003366" />
              <Text style={styles.settingLabel}>Вибрация</Text>
            </View>
            <Switch value={vibration} onValueChange={setVibration} />
          </View>
        </View>

        {/* Внешний вид */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Внешний вид</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon" size={24} color="#003366" />
              <Text style={styles.settingLabel}>Темная тема</Text>
            </View>
            <Switch value={darkMode} onValueChange={setDarkMode} />
          </View>
        </View>

        {/* Местоположение */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Местоположение</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="location" size={24} color="#003366" />
              <Text style={styles.settingLabel}>Автоматическое определение</Text>
            </View>
            <Switch value={autoLocation} onValueChange={setAutoLocation} />
          </View>
        </View>

        {/* Безопасность */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Безопасность</Text>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="lock-closed" size={24} color="#003366" />
              <Text style={styles.settingLabel}>Изменить пароль</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="finger-print" size={24} color="#003366" />
              <Text style={styles.settingLabel}>Биометрическая аутентификация</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Данные */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Данные</Text>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="download" size={24} color="#003366" />
              <Text style={styles.settingLabel}>Экспорт данных</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="trash" size={24} color="#e53935" />
              <Text style={[styles.settingLabel, styles.dangerText]}>Удалить аккаунт</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen; 