import React from 'react';
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
import { PlusScreenStyles } from '../../styles/screens/PlusScreen.styles';

const PlusScreen: React.FC = () => {
  const { isDark } = useTheme();

  const handleQuickAction = (action: string) => {
    Alert.alert(
      'Действие',
      `Функция "${action}" будет доступна в следующем обновлении`,
      [{ text: 'Понятно', style: 'default' }]
    );
  };

  const handlePremiumUpgrade = () => {
    Alert.alert(
      'Премиум',
      'Функция премиум подписки будет доступна в следующем обновлении',
      [{ text: 'Понятно', style: 'default' }]
    );
  };

  return (
    <SafeAreaView style={[PlusScreenStyles.container, { backgroundColor: isDark ? '#111827' : '#F8FAFC' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[PlusScreenStyles.header, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
        <Text style={[PlusScreenStyles.title, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
          Дополнительно
        </Text>
        <Text style={[PlusScreenStyles.subtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
          Дополнительные возможности
        </Text>
      </View>

      {/* Content */}
      <ScrollView style={[PlusScreenStyles.content, { backgroundColor: isDark ? '#111827' : '#F8FAFC' }]}>
        {/* Premium Card */}
        <View style={PlusScreenStyles.premiumCard}>
          <Text style={PlusScreenStyles.premiumTitle}>
            Премиум водитель
          </Text>
          <Text style={PlusScreenStyles.premiumSubtitle}>
            Получите приоритетные заказы и повышенные тарифы
          </Text>
          <TouchableOpacity
            style={PlusScreenStyles.premiumButton}
            onPress={handlePremiumUpgrade}
          >
            <Text style={PlusScreenStyles.premiumButtonText}>
              Узнать больше
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={PlusScreenStyles.section}>
          <Text style={[PlusScreenStyles.sectionTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
            Быстрые действия
          </Text>
          
          <View style={PlusScreenStyles.quickActions}>
            <TouchableOpacity
              style={[PlusScreenStyles.quickAction, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
              onPress={() => handleQuickAction('Настройки автомобиля')}
            >
              <View style={PlusScreenStyles.quickActionIcon}>
                <Ionicons name="car-outline" size={24} color="#3B82F6" />
              </View>
              <View style={PlusScreenStyles.quickActionContent}>
                <Text style={[PlusScreenStyles.quickActionTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
                  Настройки автомобиля
                </Text>
                <Text style={[PlusScreenStyles.quickActionSubtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  Управляйте информацией об автомобиле
                </Text>
              </View>
              <View style={PlusScreenStyles.quickActionArrow}>
                <Ionicons name="chevron-forward" size={20} color={isDark ? '#6B7280' : '#9CA3AF'} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[PlusScreenStyles.quickAction, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
              onPress={() => handleQuickAction('Платежные методы')}
            >
              <View style={PlusScreenStyles.quickActionIcon}>
                <Ionicons name="card-outline" size={24} color="#10B981" />
              </View>
              <View style={PlusScreenStyles.quickActionContent}>
                <Text style={[PlusScreenStyles.quickActionTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
                  Платежные методы
                </Text>
                <Text style={[PlusScreenStyles.quickActionSubtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  Управляйте способами получения оплаты
                </Text>
              </View>
              <View style={PlusScreenStyles.quickActionArrow}>
                <Ionicons name="chevron-forward" size={20} color={isDark ? '#6B7280' : '#9CA3AF'} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[PlusScreenStyles.quickAction, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
              onPress={() => handleQuickAction('Документы')}
            >
              <View style={PlusScreenStyles.quickActionIcon}>
                <Ionicons name="document-outline" size={24} color="#F59E0B" />
              </View>
              <View style={PlusScreenStyles.quickActionContent}>
                <Text style={[PlusScreenStyles.quickActionTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
                  Документы
                </Text>
                <Text style={[PlusScreenStyles.quickActionSubtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  Загрузите необходимые документы
                </Text>
              </View>
              <View style={PlusScreenStyles.quickActionArrow}>
                <Ionicons name="chevron-forward" size={20} color={isDark ? '#6B7280' : '#9CA3AF'} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Services Grid */}
        <View style={PlusScreenStyles.section}>
          <Text style={[PlusScreenStyles.sectionTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
            Услуги
          </Text>
          
          <View style={PlusScreenStyles.grid}>
            <TouchableOpacity
              style={[PlusScreenStyles.gridItem, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
              onPress={() => handleQuickAction('Грузоперевозки')}
            >
              <View style={PlusScreenStyles.gridItemIcon}>
                <Ionicons name="cube-outline" size={32} color="#3B82F6" />
              </View>
              <Text style={[PlusScreenStyles.gridItemTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
                Грузоперевозки
              </Text>
              <Text style={[PlusScreenStyles.gridItemSubtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                Перевозка грузов
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[PlusScreenStyles.gridItem, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
              onPress={() => handleQuickAction('Эвакуатор')}
            >
              <View style={PlusScreenStyles.gridItemIcon}>
                <Ionicons name="car-sport-outline" size={32} color="#10B981" />
              </View>
              <Text style={[PlusScreenStyles.gridItemTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
                Эвакуатор
              </Text>
              <Text style={[PlusScreenStyles.gridItemSubtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                Эвакуация автомобилей
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[PlusScreenStyles.gridItem, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
              onPress={() => handleQuickAction('Техпомощь')}
            >
              <View style={PlusScreenStyles.gridItemIcon}>
                <Ionicons name="construct-outline" size={32} color="#F59E0B" />
              </View>
              <Text style={[PlusScreenStyles.gridItemTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
                Техпомощь
              </Text>
              <Text style={[PlusScreenStyles.gridItemSubtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                Помощь на дороге
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[PlusScreenStyles.gridItem, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
              onPress={() => handleQuickAction('Доставка')}
            >
              <View style={PlusScreenStyles.gridItemIcon}>
                <Ionicons name="bicycle-outline" size={32} color="#EF4444" />
              </View>
              <Text style={[PlusScreenStyles.gridItemTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
                Доставка
              </Text>
              <Text style={[PlusScreenStyles.gridItemSubtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                Быстрая доставка
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PlusScreen; 