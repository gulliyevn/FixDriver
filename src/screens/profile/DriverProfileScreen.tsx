import React from 'react';
import { View, Text } from 'react-native';
import { DriverProfileScreenStyles } from '../../styles/screens/DriverProfileScreen.styles';

const DriverProfileScreen: React.FC = () => {
  return (
    <View style={DriverProfileScreenStyles.container}>
      <Text style={DriverProfileScreenStyles.title}>Профиль водителя</Text>
      <Text style={DriverProfileScreenStyles.subtitle}>
        Здесь будет интерфейс профиля водителя
      </Text>
    </View>
  );
};

export default DriverProfileScreen;
