import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Alert,
  StatusBar
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AppCard from '../../components/AppCard';
import Button from '../../components/Button';
import { colors } from '../../constants/colors';
import mockData from '../../utils/mockData';
import { ScheduleScreenStyles } from '../../styles/screens/ScheduleScreen.styles';

interface ScheduleItem {
  id: string;
  date: string;
  time: string;
  client: string;
  from: string;
  to: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  earnings: number;
}

const ScheduleScreen: React.FC = () => {
  const { isDark } = useTheme();
  
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>(mockData.scheduleItems.map(item => ({
    id: item.id,
    date: item.date,
    time: item.time,
    client: item.driver, // Используем driver как client для водительского экрана
    from: item.from,
    to: item.to,
    status: item.status as 'upcoming' | 'completed' | 'cancelled',
    earnings: Math.floor(Math.random() * 500) + 200, // Генерируем случайный заработок
  })));

  const handleAcceptSchedule = () => {
    Alert.alert(
      'Подтверждение',
      'Функция подтверждения поездок будет доступна в следующем обновлении',
      [{ text: 'Понятно', style: 'default' }]
    );
  };

  const handleCancelSchedule = (item: ScheduleItem) => {
    Alert.alert(
      'Отмена поездки',
      `Отменить поездку ${item.date} в ${item.time}?`,
      [
        { text: 'Нет', style: 'cancel' },
        {
          text: 'Отменить',
          style: 'destructive',
          onPress: () => {
            setScheduleItems(prev => 
              prev.map(schedule => 
                schedule.id === item.id 
                  ? { ...schedule, status: 'cancelled' as const }
                  : schedule
              )
            );
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return '#3B82F6';
      case 'completed': return '#10B981';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Предстоит';
      case 'completed': return 'Завершена';
      case 'cancelled': return 'Отменена';
      default: return 'Неизвестно';
    }
  };

  const totalEarnings = scheduleItems
    .filter(item => item.status === 'completed')
    .reduce((sum, item) => sum + item.earnings, 0);

  return (
    <SafeAreaView style={[ScheduleScreenStyles.container, { backgroundColor: isDark ? '#111827' : '#F8FAFC' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[ScheduleScreenStyles.header, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
        <Text style={[ScheduleScreenStyles.title, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
          Расписание
        </Text>
        <Text style={[ScheduleScreenStyles.subtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
          Управляйте своими поездками
        </Text>
      </View>

      {/* Content */}
      <ScrollView style={[ScheduleScreenStyles.content, { backgroundColor: isDark ? '#111827' : '#F8FAFC' }]}>
        {/* Earnings Summary */}
        <View style={[ScheduleScreenStyles.bookingCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
          <Text style={[ScheduleScreenStyles.sectionTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
            Заработок за неделю
          </Text>
          
          <View style={{ alignItems: 'center', paddingVertical: 16 }}>
            <Text style={{ 
              fontSize: 32, 
              fontWeight: '700', 
              color: '#10B981',
              marginBottom: 8 
            }}>
              {totalEarnings} ₽
            </Text>
            <Text style={{ 
              fontSize: 16, 
              color: isDark ? '#9CA3AF' : '#6B7280' 
            }}>
              {scheduleItems.filter(item => item.status === 'completed').length} поездок
            </Text>
          </View>
        </View>

        {/* Schedule List */}
        <View style={[ScheduleScreenStyles.scheduleCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
          <Text style={[ScheduleScreenStyles.sectionTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
            Мои поездки
          </Text>
          
          {scheduleItems.map((item) => (
            <View
              key={item.id}
              style={[
                ScheduleScreenStyles.scheduleItem,
                { backgroundColor: isDark ? '#374151' : '#FFFFFF' },
                item.status === 'upcoming' && ScheduleScreenStyles.scheduleItemActive,
                item.status === 'completed' && ScheduleScreenStyles.scheduleItemCompleted,
                item.status === 'cancelled' && ScheduleScreenStyles.scheduleItemCancelled,
              ]}
            >
              <View style={ScheduleScreenStyles.scheduleIcon}>
                <Ionicons 
                  name="time-outline" 
                  size={24} 
                  color={getStatusColor(item.status)} 
                />
              </View>
              
              <View style={ScheduleScreenStyles.scheduleContent}>
                <View style={ScheduleScreenStyles.scheduleHeader}>
                  <Text style={[ScheduleScreenStyles.scheduleTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
                    {item.date} в {item.time}
                  </Text>
                  <Text style={[
                    ScheduleScreenStyles.scheduleStatus,
                    item.status === 'upcoming' && ScheduleScreenStyles.scheduleStatusUpcoming,
                    item.status === 'completed' && ScheduleScreenStyles.scheduleStatusCompleted,
                    item.status === 'cancelled' && ScheduleScreenStyles.scheduleStatusCancelled,
                  ]}>
                    {getStatusText(item.status)}
                  </Text>
                </View>
                
                <Text style={[ScheduleScreenStyles.scheduleDetails, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  {item.client}
                </Text>
                
                <Text style={[ScheduleScreenStyles.scheduleTime, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  {item.from} → {item.to}
                </Text>
                
                {item.earnings > 0 && (
                  <Text style={{ 
                    fontSize: 14, 
                    fontWeight: '600', 
                    color: '#10B981',
                    marginTop: 4 
                  }}>
                    +{item.earnings} ₽
                  </Text>
                )}
              </View>
              
              {item.status === 'upcoming' && (
                <View style={ScheduleScreenStyles.scheduleActions}>
                  <TouchableOpacity
                    style={[ScheduleScreenStyles.actionButton, ScheduleScreenStyles.cancelButton]}
                    onPress={() => handleCancelSchedule(item)}
                  >
                    <Text style={ScheduleScreenStyles.cancelButtonText}>
                      Отменить
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
          
          {scheduleItems.length === 0 && (
            <View style={ScheduleScreenStyles.emptyContainer}>
              <Ionicons 
                name="calendar-outline" 
                size={64} 
                color={isDark ? '#6B7280' : '#9CA3AF'} 
              />
              <Text style={[ScheduleScreenStyles.emptyText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                Нет запланированных поездок
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ScheduleScreen;
