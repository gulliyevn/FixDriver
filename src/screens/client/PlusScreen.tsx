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
import { PlusScreenStyles } from '../../styles/screens/PlusScreen.styles';

type NavigationProp = StackNavigationProp<ClientStackParamList, 'Plus'>;

const PlusScreen: React.FC = () => {
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
  
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRide = () => {
    navigation.navigate('Drivers');
  };

  const handleScheduleRide = () => {
    navigation.navigate('Schedule');
  };

  const handlePackageDelivery = () => {
    Alert.alert('Доставка', 'Функция доставки пакетов будет доступна в ближайшее время');
  };

  const handleRouteBuilder = () => {
    Alert.alert('Построитель маршрутов', 'Функция построения маршрутов будет доступна в ближайшее время');
  };

  return (
    <SafeAreaView style={[PlusScreenStyles.container, { backgroundColor: isDark ? '#111827' : '#F8FAFC' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[PlusScreenStyles.header, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
        <TouchableOpacity
          style={PlusScreenStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? '#F9FAFB' : '#1F2937'} />
        </TouchableOpacity>
        
        <Text style={[PlusScreenStyles.title, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
          Новый заказ
        </Text>
        
        <View style={PlusScreenStyles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView 
        style={PlusScreenStyles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={PlusScreenStyles.scrollContent}
      >
        {/* Quick Ride */}
        <TouchableOpacity
          style={[PlusScreenStyles.optionCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
          onPress={handleQuickRide}
        >
          <View style={PlusScreenStyles.optionIcon}>
            <Ionicons name="car" size={32} color="#3B82F6" />
          </View>
          <View style={PlusScreenStyles.optionContent}>
            <Text style={[PlusScreenStyles.optionTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
              Быстрая поездка
            </Text>
            <Text style={[PlusScreenStyles.optionDescription, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              Заказать поездку прямо сейчас
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={isDark ? '#9CA3AF' : '#6B7280'} />
        </TouchableOpacity>

        {/* Schedule Ride */}
        <TouchableOpacity
          style={[PlusScreenStyles.optionCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
          onPress={handleScheduleRide}
        >
          <View style={PlusScreenStyles.optionIcon}>
            <Ionicons name="calendar" size={32} color="#10B981" />
          </View>
          <View style={PlusScreenStyles.optionContent}>
            <Text style={[PlusScreenStyles.optionTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
              Запланировать поездку
            </Text>
            <Text style={[PlusScreenStyles.optionDescription, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              Забронировать поездку на будущее
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={isDark ? '#9CA3AF' : '#6B7280'} />
        </TouchableOpacity>

        {/* Package Delivery */}
        <TouchableOpacity
          style={[PlusScreenStyles.optionCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
          onPress={handlePackageDelivery}
        >
          <View style={PlusScreenStyles.optionIcon}>
            <Ionicons name="cube" size={32} color="#F59E0B" />
          </View>
          <View style={PlusScreenStyles.optionContent}>
            <Text style={[PlusScreenStyles.optionTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
              Доставка пакетов
            </Text>
            <Text style={[PlusScreenStyles.optionDescription, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              Отправить посылку или документы
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={isDark ? '#9CA3AF' : '#6B7280'} />
        </TouchableOpacity>

        {/* Route Builder */}
        <TouchableOpacity
          style={[PlusScreenStyles.optionCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
          onPress={handleRouteBuilder}
        >
          <View style={PlusScreenStyles.optionIcon}>
            <Ionicons name="map" size={32} color="#8B5CF6" />
          </View>
          <View style={PlusScreenStyles.optionContent}>
            <Text style={[PlusScreenStyles.optionTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
              Построитель маршрутов
            </Text>
            <Text style={[PlusScreenStyles.optionDescription, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              Создать сложный маршрут с остановками
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={isDark ? '#9CA3AF' : '#6B7280'} />
        </TouchableOpacity>
      </ScrollView>

      {/* Loading Overlay */}
      {loading && (
        <View style={PlusScreenStyles.loadingOverlay}>
          <Text style={PlusScreenStyles.loadingText}>Загрузка...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default PlusScreen; 