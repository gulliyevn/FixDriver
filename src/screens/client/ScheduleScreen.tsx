import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  StatusBar,
  Alert
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ClientStackParamList } from '../../types/navigation';
import { ScheduleScreenStyles } from '../../styles/screens/ScheduleScreen.styles';

type NavigationProp = StackNavigationProp<ClientStackParamList, 'Schedule'>;

const ScheduleScreen: React.FC = () => {
  const { isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Загрузка данных
      console.log('Загрузка данных расписания...');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[ScheduleScreenStyles.container, { backgroundColor: isDark ? '#111827' : '#F8FAFC' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[ScheduleScreenStyles.header, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
        <TouchableOpacity
          style={ScheduleScreenStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? '#F9FAFB' : '#1F2937'} />
        </TouchableOpacity>
        
        <Text style={[ScheduleScreenStyles.title, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
          Расписание
        </Text>
        
        <View style={ScheduleScreenStyles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView 
        style={ScheduleScreenStyles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={ScheduleScreenStyles.scrollContent}
      >
        <View style={ScheduleScreenStyles.emptyContainer}>
          <Ionicons name="calendar-outline" size={64} color={isDark ? '#9CA3AF' : '#6B7280'} />
          <Text style={[ScheduleScreenStyles.emptyTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
            Нет запланированных поездок
          </Text>
          <Text style={[ScheduleScreenStyles.emptyDescription, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            Запланируйте свою первую поездку
          </Text>
          
          <TouchableOpacity
            style={[ScheduleScreenStyles.scheduleButton, { backgroundColor: isDark ? '#3B82F6' : '#1E40AF' }]}
            onPress={() => navigation.navigate('Plus')}
          >
            <Text style={ScheduleScreenStyles.scheduleButtonText}>
              Запланировать поездку
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Loading Overlay */}
      {loading && (
        <View style={ScheduleScreenStyles.loadingOverlay}>
          <Text style={ScheduleScreenStyles.loadingText}>Загрузка...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ScheduleScreen;
