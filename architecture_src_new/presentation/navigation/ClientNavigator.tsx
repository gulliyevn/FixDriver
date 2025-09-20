import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useI18n } from '../../shared/i18n';
import { NavigatorStyles as styles } from '../../shared/styles/navigation/Navigator.styles';

interface ClientNavigatorProps {
  onRoleSwitch: (role: 'driver') => void;
  onLogout: () => void;
}

export const ClientNavigator: React.FC<ClientNavigatorProps> = ({ onRoleSwitch, onLogout }) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('Map');

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Map':
        return (
          <View style={styles.content}>
            <Text style={styles.title}>Client Map</Text>
            <Text style={styles.subtitle}>Find available drivers here</Text>
          </View>
        );
      case 'Drivers':
        return (
          <View style={styles.content}>
            <Text style={styles.title}>Available Drivers</Text>
            <Text style={styles.subtitle}>List of drivers will appear here</Text>
          </View>
        );
      case 'Schedule':
        return (
          <View style={styles.content}>
            <Text style={styles.title}>Trip Schedule</Text>
            <Text style={styles.subtitle}>Your scheduled trips</Text>
          </View>
        );
      case 'Chat':
        return (
          <View style={styles.content}>
            <Text style={styles.title}>Client Chat</Text>
            <Text style={styles.subtitle}>Conversations with drivers</Text>
          </View>
        );
      case 'Profile':
        return (
          <View style={styles.content}>
            <Text style={styles.title}>Client Profile</Text>
            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => onRoleSwitch('driver')}
            >
              <Text style={styles.switchButtonText}>Switch to Driver Mode</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return (
          <View style={styles.content}>
            <Text style={styles.title}>{activeTab}</Text>
            <Text style={styles.subtitle}>Coming soon...</Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {renderContent()}
      
      {/* TabBar будет добавлен здесь */}
      <View style={styles.tabBarContainer}>
        {/* TODO: Добавить TabBar компонент */}
        <Text style={styles.tabBarPlaceholder}>Client TabBar will be here</Text>
      </View>
    </View>
  );
};

export default ClientNavigator;
