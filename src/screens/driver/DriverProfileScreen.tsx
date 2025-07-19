import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { DriverProfileScreenStyles } from '../../styles/screens/DriverProfileScreen.styles';

const DriverProfileScreen: React.FC = () => {
  const { logout } = useAuth();
  const { t } = useLanguage();

  return (
    <View style={DriverProfileScreenStyles.container}>
      <Text style={DriverProfileScreenStyles.title}>Профиль водителя</Text>
      <Text style={DriverProfileScreenStyles.subtitle}>
        Здесь будет интерфейс профиля водителя
      </Text>
      
      {/* Кнопка "Выйти" */}
      <TouchableOpacity 
        style={DriverProfileScreenStyles.logout} 
        onPress={logout}
      >
        <Text style={DriverProfileScreenStyles.logoutText}>
          {t('driver.chat.logout')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DriverProfileScreen; 