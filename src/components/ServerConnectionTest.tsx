import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { ConfigUtils } from '../config/environment';
import { AuthService } from '../services/AuthService';

export const ServerConnectionTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<string>('Не проверено');

  const testServerConnection = async () => {
    setIsLoading(true);
    try {
      const isHealthy = await ConfigUtils.checkServerHealth();
      setServerStatus(isHealthy ? '✅ Сервер доступен' : '❌ Сервер недоступен');
    } catch (error) {
      setServerStatus('❌ Ошибка подключения');
      console.error('Server connection test failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testLogin = async () => {
    setIsLoading(true);
    try {
      const result = await AuthService.login('test@example.com', 'password123');
      if (result.success) {
        Alert.alert('Успех', 'Вход выполнен успешно!');
      } else {
        Alert.alert('Ошибка', result.message || 'Неизвестная ошибка');
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Ошибка при входе');
      console.error('Login test failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testRegister = async () => {
    setIsLoading(true);
    try {
      const testEmail = `test${Date.now()}@example.com`;
      const result = await AuthService.register({
        name: 'Тест',
        surname: 'Пользователь',
        email: testEmail,
        phone: '+994501234567',
        country: 'Азербайджан',
        role: 'client' as any,
      }, 'password123');
      
      if (result.success) {
        Alert.alert('Успех', 'Регистрация выполнена успешно!');
      } else {
        Alert.alert('Ошибка', result.message || 'Неизвестная ошибка');
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Ошибка при регистрации');
      console.error('Register test failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ padding: 20, backgroundColor: '#f5f5f5' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
        Тест подключения к серверу
      </Text>
      
      <Text style={{ marginBottom: 10 }}>
        Статус сервера: {serverStatus}
      </Text>
      
      <TouchableOpacity
        style={{
          backgroundColor: '#007AFF',
          padding: 15,
          borderRadius: 8,
          marginBottom: 10,
        }}
        onPress={testServerConnection}
        disabled={isLoading}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          {isLoading ? 'Проверка...' : 'Проверить подключение'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={{
          backgroundColor: '#34C759',
          padding: 15,
          borderRadius: 8,
          marginBottom: 10,
        }}
        onPress={testLogin}
        disabled={isLoading}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          {isLoading ? 'Тестирование...' : 'Тест входа'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={{
          backgroundColor: '#FF9500',
          padding: 15,
          borderRadius: 8,
          marginBottom: 10,
        }}
        onPress={testRegister}
        disabled={isLoading}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          {isLoading ? 'Тестирование...' : 'Тест регистрации'}
        </Text>
      </TouchableOpacity>
      
      <Text style={{ fontSize: 12, color: '#666', marginTop: 20 }}>
        Сервер: 31.97.76.106:8080
      </Text>
    </View>
  );
}; 