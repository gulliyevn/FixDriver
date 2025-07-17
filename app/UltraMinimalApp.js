import { registerRootComponent } from 'expo';
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Alert
} from 'react-native';

function UltraMinimalApp() {
  const [loading, setLoading] = useState(false);

  const testLogin = async (type) => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const email = type === 'client' ? 'client@example.com' : 'driver@example.com';
      
  
      
      Alert.alert(
        '✅ Успех!', 
        `Вошли как ${type}\nEmail: ${email}`
      );
      
    } catch (error) {
      Alert.alert('❌ Ошибка', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧪 Ультра-минимальный тест</Text>
      
      <TouchableOpacity
        style={[styles.button, styles.clientButton]}
        onPress={() => testLogin('client')}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? '⏳ Тестируем...' : '👤 Клиент'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, styles.driverButton]}
        onPress={() => testLogin('driver')}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? '⏳ Тестируем...' : '🚗 Водитель'}
        </Text>
      </TouchableOpacity>
      
      <Text style={styles.info}>
        client@example.com / password123{'\n'}
        driver@example.com / password123
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    width: 200,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
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
  info: {
    marginTop: 40,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

registerRootComponent(UltraMinimalApp); 