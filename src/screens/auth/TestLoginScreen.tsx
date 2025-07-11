import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  Alert,
  StyleSheet
} from 'react-native';
import { AuthService } from '../../services/AuthService';

const TestLoginScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleTestLogin = async (type: 'client' | 'driver') => {
    setLoading(true);
    try {
      const email = type === 'client' ? 'client@example.com' : 'driver@example.com';
      const password = 'password123';
      
  
      
      const result = await AuthService.login(email, password);
      
      if (result.success) {
        Alert.alert(
          '✅ Успешный вход!', 
          `Вошли как ${type}\nEmail: ${email}\nПользователь: ${result.user?.name}`
        );
    
      } else {
        Alert.alert('❌ Ошибка входа', result.message || 'Неизвестная ошибка');
        console.error('❌ Ошибка входа:', result);
      }
    } catch (error) {
      Alert.alert('❌ Исключение', error instanceof Error ? error.message : 'Неизвестная ошибка');
      console.error('❌ Исключение при входе:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🧪 Тестовый экран входа</Text>
        <Text style={styles.subtitle}>Проверка работы моков</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.clientButton]}
            onPress={() => handleTestLogin('client')}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? '⏳ Тестируем...' : '👤 Тест входа клиента'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.driverButton]}
            onPress={() => handleTestLogin('driver')}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? '⏳ Тестируем...' : '🚗 Тест входа водителя'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>📋 Доступные аккаунты:</Text>
          <Text style={styles.infoText}>👤 Клиент: client@example.com / password123</Text>
          <Text style={styles.infoText}>🚗 Водитель: driver@example.com / password123</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 40,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  clientButton: {
    backgroundColor: '#10B981',
  },
  driverButton: {
    backgroundColor: '#3B82F6',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
  },
});

export default TestLoginScreen; 