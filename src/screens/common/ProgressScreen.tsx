import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ProgressScreenStyles } from '../../styles/screens/ProgressScreen.styles';

const ProgressScreen: React.FC = () => {
  const { logout } = useAuth();
  const { isDark } = useTheme();

  const handleLogout = () => {
    Alert.alert(
      'Выход',
      'Вы уверены, что хотите выйти?',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Выйти', onPress: logout, style: 'destructive' }
      ]
    );
  };

  return (
    <ScrollView style={ProgressScreenStyles.container}>
      <View style={ProgressScreenStyles.header}>
        <Text style={[ProgressScreenStyles.headerTitle, { color: isDark ? '#fff' : '#000' }]}>
          Прогресс разработки
        </Text>
        <TouchableOpacity style={ProgressScreenStyles.logoutButton} onPress={handleLogout}>
          <Text style={ProgressScreenStyles.logoutButtonText}>Выйти</Text>
        </TouchableOpacity>
      </View>

      <View style={[ProgressScreenStyles.overallSection, { backgroundColor: isDark ? '#2c2c2e' : '#fff' }]}>
        <Text style={[ProgressScreenStyles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}>
          Общий прогресс
        </Text>
        <Text style={[ProgressScreenStyles.overallText, { color: isDark ? '#ccc' : '#666' }]}>
          Проект находится в активной разработке. Основная архитектура готова, 
          ведется интеграция с бэкендом и настройка реальных сервисов.
        </Text>
      </View>

      <View style={[ProgressScreenStyles.detailsSection, { backgroundColor: isDark ? '#2c2c2e' : '#fff' }]}>
        <Text style={[ProgressScreenStyles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}>
          Детали по компонентам
        </Text>
        
        <View style={ProgressScreenStyles.progressItem}>
          <Text style={[ProgressScreenStyles.stepText, { color: isDark ? '#fff' : '#000' }]}>
            Frontend (React Native)
          </Text>
          <View style={ProgressScreenStyles.statusContainer}>
            <View style={[ProgressScreenStyles.statusDot, { backgroundColor: '#4CAF50' }]} />
            <Text style={[ProgressScreenStyles.statusText, { color: isDark ? '#ccc' : '#666' }]}>
              Готово (95%)
            </Text>
          </View>
        </View>

        <View style={ProgressScreenStyles.progressItem}>
          <Text style={[ProgressScreenStyles.stepText, { color: isDark ? '#fff' : '#000' }]}>
            Backend API
          </Text>
          <View style={ProgressScreenStyles.statusContainer}>
            <View style={[ProgressScreenStyles.statusDot, { backgroundColor: '#FF9800' }]} />
            <Text style={[ProgressScreenStyles.statusText, { color: isDark ? '#ccc' : '#666' }]}>
              В разработке (60%)
            </Text>
          </View>
        </View>

        <View style={ProgressScreenStyles.progressItem}>
          <Text style={[ProgressScreenStyles.stepText, { color: isDark ? '#fff' : '#000' }]}>
            База данных
          </Text>
          <View style={ProgressScreenStyles.statusContainer}>
            <View style={[ProgressScreenStyles.statusDot, { backgroundColor: '#2196F3' }]} />
            <Text style={[ProgressScreenStyles.statusText, { color: isDark ? '#ccc' : '#666' }]}>
              В разработке (70%)
            </Text>
          </View>
        </View>

        <View style={ProgressScreenStyles.progressItem}>
          <Text style={[ProgressScreenStyles.stepText, { color: isDark ? '#fff' : '#000' }]}>
            Интеграции (карты, платежи)
          </Text>
          <View style={ProgressScreenStyles.statusContainer}>
            <View style={[ProgressScreenStyles.statusDot, { backgroundColor: '#9C27B0' }]} />
            <Text style={[ProgressScreenStyles.statusText, { color: isDark ? '#ccc' : '#666' }]}>
              Планируется (30%)
            </Text>
          </View>
        </View>
      </View>

      <View style={[ProgressScreenStyles.statsSection, { backgroundColor: isDark ? '#2c2c2e' : '#fff' }]}>
        <Text style={[ProgressScreenStyles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}>
          Статистика
        </Text>
        
        <View style={ProgressScreenStyles.statsGrid}>
          <View style={[ProgressScreenStyles.statCard, { backgroundColor: isDark ? '#3a3a3c' : '#f8f9fa' }]}>
            <Text style={[ProgressScreenStyles.statValue, { color: isDark ? '#fff' : '#000' }]}>22</Text>
            <Text style={[ProgressScreenStyles.statLabel, { color: isDark ? '#ccc' : '#666' }]}>
              Компонента
            </Text>
          </View>
          
          <View style={[ProgressScreenStyles.statCard, { backgroundColor: isDark ? '#3a3a3c' : '#f8f9fa' }]}>
            <Text style={[ProgressScreenStyles.statValue, { color: isDark ? '#fff' : '#000' }]}>15</Text>
            <Text style={[ProgressScreenStyles.statLabel, { color: isDark ? '#ccc' : '#666' }]}>
              Экранов
            </Text>
          </View>
          
          <View style={[ProgressScreenStyles.statCard, { backgroundColor: isDark ? '#3a3a3c' : '#f8f9fa' }]}>
            <Text style={[ProgressScreenStyles.statValue, { color: isDark ? '#fff' : '#000' }]}>8</Text>
            <Text style={[ProgressScreenStyles.statLabel, { color: isDark ? '#ccc' : '#666' }]}>
              Сервисов
            </Text>
          </View>
        </View>
      </View>

      <View style={[ProgressScreenStyles.nextStepsSection, { backgroundColor: isDark ? '#2c2c2e' : '#fff' }]}>
        <Text style={[ProgressScreenStyles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}>
          Следующие шаги
        </Text>
        
        <View style={ProgressScreenStyles.stepsList}>
          <View style={ProgressScreenStyles.stepItem}>
            <Text style={ProgressScreenStyles.stepNumber}>1</Text>
            <Text style={[ProgressScreenStyles.stepText, { color: isDark ? '#fff' : '#000' }]}>
              Интеграция с реальными API
            </Text>
          </View>
          
          <View style={ProgressScreenStyles.stepItem}>
            <Text style={ProgressScreenStyles.stepNumber}>2</Text>
            <Text style={[ProgressScreenStyles.stepText, { color: isDark ? '#fff' : '#000' }]}>
              Настройка MapTiler для карт
            </Text>
          </View>
          
          <View style={ProgressScreenStyles.stepItem}>
            <Text style={ProgressScreenStyles.stepNumber}>3</Text>
            <Text style={[ProgressScreenStyles.stepText, { color: isDark ? '#fff' : '#000' }]}>
              WebSocket для реального чата
            </Text>
          </View>
          
          <View style={ProgressScreenStyles.stepItem}>
            <Text style={ProgressScreenStyles.stepNumber}>4</Text>
            <Text style={[ProgressScreenStyles.stepText, { color: isDark ? '#fff' : '#000' }]}>
              Тестирование и оптимизация
            </Text>
          </View>
          
          <View style={ProgressScreenStyles.stepItem}>
            <Text style={ProgressScreenStyles.stepNumber}>5</Text>
            <Text style={[ProgressScreenStyles.stepText, { color: isDark ? '#fff' : '#000' }]}>
              Деплой в продакшен
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProgressScreen; 