import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useI18n } from '../../shared/i18n';
import { NavigatorStyles as styles } from '../../shared/styles/navigation/Navigator.styles';

interface DriverNavigatorProps {
  onRoleSwitch: (role: 'client') => void;
  onLogout: () => void;
}

export const DriverNavigator: React.FC<DriverNavigatorProps> = ({ onRoleSwitch, onLogout }) => {
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
            <Text style={styles.title}>Driver Map</Text>
            <Text style={styles.subtitle}>Find available orders here</Text>
          </View>
        );
      case 'Orders':
        return (
          <View style={styles.content}>
            <Text style={styles.title}>Available Orders</Text>
            <Text style={styles.subtitle}>List of orders will appear here</Text>
          </View>
        );
      case 'Earnings':
        return (
          <View style={styles.content}>
            <Text style={styles.title}>Driver Earnings</Text>
            <Text style={styles.subtitle}>Your earnings statistics</Text>
          </View>
        );
      case 'Chat':
        return (
          <View style={styles.content}>
            <Text style={styles.title}>Driver Chat</Text>
            <Text style={styles.subtitle}>Conversations with clients</Text>
          </View>
        );
      case 'Profile':
        return (
          <View style={styles.content}>
            <Text style={styles.title}>Driver Profile</Text>
            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => onRoleSwitch('client')}
            >
              <Text style={styles.switchButtonText}>Switch to Client Mode</Text>
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
        <Text style={styles.tabBarPlaceholder}>Driver TabBar will be here</Text>
      </View>
    </View>
  );
};

export default DriverNavigator;
