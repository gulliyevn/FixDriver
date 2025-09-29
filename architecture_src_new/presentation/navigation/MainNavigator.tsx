import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useI18n } from '../../shared/i18n';
import { NavigatorStyles as styles } from '../../shared/styles/navigation/Navigator.styles';
import TabBar from './TabBar';
import { AuthServiceStub } from '../../data/datasources/grpc/stubs/AuthServiceStub';
import { UserRole } from '../../shared/types';

// Импорт MapScreen будет внутри функции

type Role = 'client' | 'driver';

interface MainNavigatorProps {
  onLogout: () => void;
}

export const MainNavigator: React.FC<MainNavigatorProps> = ({ onLogout }) => {
  const { t } = useI18n();
  const [currentRole, setCurrentRole] = useState<Role>('client');
  const [activeTab, setActiveTab] = useState('Map');
  const [isTabBarHidden, setIsTabBarHidden] = useState(false);
  
  // Создаем экземпляр AuthServiceStub
  const authService = new AuthServiceStub();

  // Загружаем текущую роль пользователя при инициализации
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user && user.role) {
          setCurrentRole(user.role as Role);
        }
      } catch (error) {
        console.log('No current user, using default role: client');
      }
    };
    
    loadCurrentUser();
  }, []);

  const handleRoleSwitch = async (newRole: Role) => {
    try {
      // Вызываем AuthServiceStub.switchRole для сохранения в мок базе
      await authService.switchRole(newRole as UserRole);
      
      // Обновляем локальное состояние
      setCurrentRole(newRole);
      setActiveTab('Map'); // Сбрасываем на главный таб при смене роли
      
      console.log(`Role switched to: ${newRole}`);
    } catch (error) {
      console.error('Failed to switch role:', error);
    }
  };

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
  };

  const renderContent = () => {
    // Общие экраны
    const MapScreen = require('../screens/common/MapScreen').default;
    const { ChatScreen } = require('../screens/common/ChatScreen');
    const ProfileScreen = require('../screens/common/ProfileScreen').default;

    if (currentRole === 'client') {
      switch (activeTab) {
        case 'Map':
          return <MapScreen />;
        case 'Drivers': {
          const OrdersScreen = require('../screens/common/OrdersScreen').default;
          return <OrdersScreen />;
        }
        case 'Schedule': {
          const ScheduleScreen = require('../screens/client/ScheduleScreen').default;
          return <ScheduleScreen />;
        }
        case 'Chat':
          return <ChatScreen />;
        case 'Profile':
          return <ProfileScreen onLogout={onLogout} onSubScreenChange={setIsTabBarHidden} />;
        default:
          return (
            <View style={styles.content}>
              <Text style={styles.title}>{activeTab}</Text>
              <Text style={styles.subtitle}>Coming soon...</Text>
            </View>
          );
      }
    } else {
      // driver
      switch (activeTab) {
        case 'Map':
          return <MapScreen />;
        case 'Orders': {
          const OrdersScreen = require('../screens/common/OrdersScreen').default;
          return <OrdersScreen />;
        }
        case 'Earnings': {
          const EarningsScreen = require('../screens/driver/EarningsScreen').default;
          return <EarningsScreen />;
        }
        case 'Chat':
          return <ChatScreen />;
        case 'Profile':
          return <ProfileScreen onLogout={onLogout} onSubScreenChange={setIsTabBarHidden} />;
        default:
          return (
            <View style={styles.content}>
              <Text style={styles.title}>{activeTab}</Text>
              <Text style={styles.subtitle}>Coming soon...</Text>
            </View>
          );
      }
    }
  };

  return (
    <View style={styles.container}>
      {renderContent()}
      
      {/* TabBar интегрирован */}
      <View style={styles.tabBarContainer}>
        <TabBar
          currentRole={currentRole}
          onRoleSwitch={handleRoleSwitch}
          activeTab={activeTab}
          onTabPress={handleTabPress}
          isHidden={isTabBarHidden}
        />
      </View>
    </View>
  );
};

export default MainNavigator;
