import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import { useTheme } from '../../context/ThemeContext';
import { RoleSelectScreenStyles } from '../../styles/screens/RoleSelectScreen.styles';
import LanguageSelector from '../../components/LanguageSelector';

export default function RoleSelectScreen() {
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const [langModal, setLangModal] = React.useState(false);

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
    <View style={[RoleSelectScreenStyles.container, isDark && RoleSelectScreenStyles.containerDark, {flex: 1}]}> 
      <ScrollView
        contentContainerStyle={[RoleSelectScreenStyles.content, { flexGrow: 1, justifyContent: 'flex-end' }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Заголовок */}
        <View style={RoleSelectScreenStyles.header}>
          <Text style={RoleSelectScreenStyles.title}>Выберите роль</Text>
          <Text style={RoleSelectScreenStyles.subtitle}>Как вы хотите использовать приложение?</Text>
        </View>
        {/* Клиент */}
        <View style={[RoleSelectScreenStyles.card, RoleSelectScreenStyles.cardClient, isDark && RoleSelectScreenStyles.cardDark]}>  
          <Text style={[RoleSelectScreenStyles.cardTitle, isDark && RoleSelectScreenStyles.cardTitleDark]}>Клиент</Text>
          <Text style={RoleSelectScreenStyles.cardSubtitle}>Заказывайте поездки для себя и своих детей</Text>
          <View style={RoleSelectScreenStyles.benefitsList}>
            <View style={RoleSelectScreenStyles.benefitItem}>
              <Ionicons name="checkmark-circle" size={22} color="#22C55E" />
              <Text style={RoleSelectScreenStyles.benefitText}>Безопасные поездки</Text>
            </View>
            <View style={RoleSelectScreenStyles.benefitItem}>
              <Ionicons name="checkmark-circle" size={22} color="#22C55E" />
              <Text style={RoleSelectScreenStyles.benefitText}>Отслеживание в реальном времени</Text>
            </View>
            <View style={RoleSelectScreenStyles.benefitItem}>
              <Ionicons name="checkmark-circle" size={22} color="#22C55E" />
              <Text style={RoleSelectScreenStyles.benefitText}>Удобная оплата</Text>
            </View>
          </View>
          <Button
            title="Выбрать"
            onPress={() => handleRoleSelect('client')}
            style={RoleSelectScreenStyles.chooseBtnClient}
            textStyle={RoleSelectScreenStyles.chooseBtnText}
            icon="arrow-forward"
            iconPosition="right"
          />
        </View>
        {/* Водитель */}
        <View style={[RoleSelectScreenStyles.card, RoleSelectScreenStyles.cardDriver, isDark && RoleSelectScreenStyles.cardDark]}>  
          <Text style={[RoleSelectScreenStyles.cardTitle, isDark && RoleSelectScreenStyles.cardTitleDark]}>Водитель</Text>
          <Text style={RoleSelectScreenStyles.cardSubtitle}>Зарабатывайте, предоставляя услуги перевозки</Text>
          <View style={RoleSelectScreenStyles.benefitsList}>
            <View style={RoleSelectScreenStyles.benefitItem}>
              <Ionicons name="checkmark-circle" size={22} color="#23408E" />
              <Text style={RoleSelectScreenStyles.benefitText}>Гибкий график работы</Text>
            </View>
            <View style={RoleSelectScreenStyles.benefitItem}>
              <Ionicons name="checkmark-circle" size={22} color="#23408E" />
              <Text style={RoleSelectScreenStyles.benefitText}>Высокий доход</Text>
            </View>
            <View style={RoleSelectScreenStyles.benefitItem}>
              <Ionicons name="checkmark-circle" size={22} color="#23408E" />
              <Text style={RoleSelectScreenStyles.benefitText}>Поддержка 24/7</Text>
            </View>
          </View>
          <Button
            title="Выбрать"
            onPress={() => handleRoleSelect('driver')}
            style={RoleSelectScreenStyles.chooseBtnDriver}
            textStyle={RoleSelectScreenStyles.chooseBtnText}
            icon="arrow-forward"
            iconPosition="right"
          />
        </View>
        {/* Войти */}
        <TouchableOpacity style={RoleSelectScreenStyles.loginWrap} onPress={handleLogin}>
          <Text style={RoleSelectScreenStyles.loginText}>Уже есть аккаунт? <Text style={RoleSelectScreenStyles.loginLink}>Войти</Text></Text>
        </TouchableOpacity>
        {/* Кнопка выбора языка */}
        <View style={RoleSelectScreenStyles.langWrap}>
          <TouchableOpacity style={RoleSelectScreenStyles.langBtn} onPress={() => setLangModal(true)}>
            <Ionicons name="language" size={20} color={isDark ? '#fff' : '#23408E'} />
            <Text style={RoleSelectScreenStyles.langBtnText}>Язык</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <LanguageSelector visible={langModal} onClose={() => setLangModal(false)} />
    </View>
  );
}
