import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { AuthService } from '../../services/AuthService';
import { UserRole } from '../../types/user';

const TestAuthScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const testRegister = async () => {
    if (!email || !password || !name || !surname || !phone) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    setLoading(true);
    setResult('Регистрация...');

    try {
      const response = await AuthService.register({
        name,
        surname,
        email,
        phone,
        country: 'US',
        role: UserRole.CLIENT,
      }, password);

      if (response.success) {
        setResult(`✅ Регистрация успешна!\nПользователь: ${response.user?.email}\nID: ${response.user?.id}`);
      } else {
        setResult(`❌ Ошибка регистрации: ${response.message}`);
      }
    } catch (error) {
      setResult(`❌ Исключение: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    if (!email || !password) {
      Alert.alert('Ошибка', 'Введите email и пароль');
      return;
    }

    setLoading(true);
    setResult('Вход...');

    try {
      const response = await AuthService.login(email, password);

      if (response.success) {
        setResult(`✅ Вход успешен!\nПользователь: ${response.user?.email}\nID: ${response.user?.id}`);
      } else {
        setResult(`❌ Ошибка входа: ${response.message}`);
      }
    } catch (error) {
      setResult(`❌ Исключение: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testWrongLogin = async () => {
    if (!email) {
      Alert.alert('Ошибка', 'Введите email');
      return;
    }

    setLoading(true);
    setResult('Тест неверного пароля...');

    try {
      const response = await AuthService.login(email, 'wrongpassword');

      if (!response.success) {
        setResult(`✅ Правильно отклонен: ${response.message}`);
      } else {
        setResult(`❌ Неожиданно принят неверный пароль`);
      }
    } catch (error) {
      setResult(`❌ Исключение: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
        🧪 Тест Аутентификации
      </Text>

      <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Регистрация</Text>
        
        <TextInput
          style={{ borderWidth: 1, borderColor: '#ddd', padding: 10, marginBottom: 10, borderRadius: 5 }}
          placeholder="Имя"
          value={name}
          onChangeText={setName}
        />
        
        <TextInput
          style={{ borderWidth: 1, borderColor: '#ddd', padding: 10, marginBottom: 10, borderRadius: 5 }}
          placeholder="Фамилия"
          value={surname}
          onChangeText={setSurname}
        />
        
        <TextInput
          style={{ borderWidth: 1, borderColor: '#ddd', padding: 10, marginBottom: 10, borderRadius: 5 }}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        
        <TextInput
          style={{ borderWidth: 1, borderColor: '#ddd', padding: 10, marginBottom: 10, borderRadius: 5 }}
          placeholder="Телефон"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        
        <TextInput
          style={{ borderWidth: 1, borderColor: '#ddd', padding: 10, marginBottom: 15, borderRadius: 5 }}
          placeholder="Пароль"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={{
            backgroundColor: '#007AFF',
            padding: 15,
            borderRadius: 5,
            alignItems: 'center',
            opacity: loading ? 0.5 : 1,
          }}
          onPress={testRegister}
          disabled={loading}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Вход</Text>
        
        <TextInput
          style={{ borderWidth: 1, borderColor: '#ddd', padding: 10, marginBottom: 10, borderRadius: 5 }}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        
        <TextInput
          style={{ borderWidth: 1, borderColor: '#ddd', padding: 10, marginBottom: 15, borderRadius: 5 }}
          placeholder="Пароль"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={{
            backgroundColor: '#34C759',
            padding: 15,
            borderRadius: 5,
            alignItems: 'center',
            marginBottom: 10,
            opacity: loading ? 0.5 : 1,
          }}
          onPress={testLogin}
          disabled={loading}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            {loading ? 'Вход...' : 'Войти'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: '#FF9500',
            padding: 15,
            borderRadius: 5,
            alignItems: 'center',
            opacity: loading ? 0.5 : 1,
          }}
          onPress={testWrongLogin}
          disabled={loading}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            {loading ? 'Тест...' : 'Тест неверного пароля'}
          </Text>
        </TouchableOpacity>
      </View>

      {result ? (
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Результат:</Text>
          <Text style={{ fontSize: 14, lineHeight: 20 }}>{result}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
};

export default TestAuthScreen; 