import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import { colors } from '../../constants/colors';
import { RoleSelectScreenStyles } from '../../styles/screens/RoleSelectScreen.styles';

export default function RoleSelectScreen() {
  const navigation = useNavigation();

  const handleRoleSelect = (role: 'client' | 'driver') => {
    if (role === 'client') {
      navigation.navigate('ClientRegister' as never);
    } else {
      navigation.navigate('DriverRegister' as never);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login' as never);
  };

  return (
    <ScrollView style={RoleSelectScreenStyles.container} contentContainerStyle={RoleSelectScreenStyles.content}>
      <View style={RoleSelectScreenStyles.header}>
        <Text style={RoleSelectScreenStyles.title}>Выберите роль</Text>
        <Text style={RoleSelectScreenStyles.subtitle}>Как вы хотите использовать приложение?</Text>
      </View>

      <View style={RoleSelectScreenStyles.roleContainer}>
        <View style={RoleSelectScreenStyles.roleCard}>
          <Ionicons
            name="person"
            size={48}
            color={colors.light.primary}
            style={RoleSelectScreenStyles.roleIcon}
          />
          <Text style={RoleSelectScreenStyles.roleTitle}>Клиент</Text>
          <Text style={RoleSelectScreenStyles.roleDescription}>
            Заказывайте поездки для себя и своих близких
          </Text>
          <Button
            title="Зарегистрироваться как клиент"
            onPress={() => handleRoleSelect('client')}
            variant="primary"
          />
        </View>

        <View style={RoleSelectScreenStyles.roleCard}>
          <Ionicons
            name="car-sport"
            size={48}
            color={colors.light.secondary}
            style={RoleSelectScreenStyles.roleIcon}
          />
          <Text style={RoleSelectScreenStyles.roleTitle}>Водитель</Text>
          <Text style={RoleSelectScreenStyles.roleDescription}>
            Зарабатывайте, предоставляя услуги перевозки
          </Text>
          <Button
            title="Зарегистрироваться как водитель"
            onPress={() => handleRoleSelect('driver')}
            variant="secondary"
          />
        </View>
      </View>

      <View style={RoleSelectScreenStyles.footer}>
        <Text style={RoleSelectScreenStyles.footerText}>
          Уже есть аккаунт?{' '}
          <Text style={RoleSelectScreenStyles.loginLink} onPress={handleLogin}>
            Войти
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}
