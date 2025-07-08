import { registerRootComponent } from 'expo';
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Alert
} from 'react-native';

function SuperSimpleApp() {
  const [loading, setLoading] = useState(false);

  const testLogin = (type) => {
    setLoading(true);
    
    setTimeout(() => {
      const email = type === 'client' ? 'client@example.com' : 'driver@example.com';
      
      console.log(`🧪 Тест входа как ${type}:`, email);
      
      Alert.alert(
        '✅ Успех!', 
        `Вошли как ${type}\nEmail: ${email}`
      );
      
      setLoading(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧪 Супер-простой тест</Text>
      
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

registerRootComponent(SuperSimpleApp); 