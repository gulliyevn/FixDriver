import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import { createRoleSelectScreenStyles } from '../../styles/screens/RoleSelectScreen.styles';
import { createThemeToggleStyles } from '../../styles/components/ThemeToggle.styles';
import LanguageSelector from '../../components/LanguageSelector';
import LanguageButton from '../../components/LanguageButton';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { getCurrentColors } from '../../constants/colors';
import i18n from '../../i18n';
import { useI18n } from '../../hooks/useI18n';

const RoleSelectScreen: React.FC = () => {
  const navigation = useNavigation();
  const [langModal, setLangModal] = React.useState(false);
  const { t, language } = useI18n();
  const { isDark, toggleTheme } = useTheme();
  
  // Создаем стили с учетом текущей темы
  const styles = createRoleSelectScreenStyles(isDark);
  const themeToggleStyles = createThemeToggleStyles(isDark);
  
  // Получаем текущие цвета
  const currentColors = getCurrentColors(isDark);

  // Отладочная информация
  console.log('Current language:', language);
  console.log('Client title translation:', t('common.roleSelect.clientTitle'));
  console.log('Driver title translation:', t('common.roleSelect.driverTitle'));


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
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Отступ сверху над иконкой */}
        <View style={styles.spacerTop} />

        {/* Логотип по центру */}
        <View style={styles.headerLogo}>
          <View style={styles.logoIconWrap}>
            <Image 
              source={require('../../../assets/icon.png')}
              style={{ width: 56, height: 56, borderRadius: 12 }}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.logoText}>FixDrive</Text>
        </View>

        {/* Отступ под иконкой/логотипом */}
        <View style={styles.spacerLogoBottom} />



        {/* Main Content (карточки) */}
        

        {/* Client Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconWrap}>
              <Ionicons name="person" size={32} color="#10B981" />
            </View>
            <Text style={styles.cardTitle}>
              {t('common.roleSelect.clientTitle')}
            </Text>
            <Text style={styles.cardSubtitle}>
              {t('common.roleSelect.clientSubtitle')}
            </Text>
          </View>
          
          <View style={styles.cardContent}>
            <View style={styles.featureItem}>
              <Ionicons name="shield-checkmark" size={20} color="#10B981" />
              <Text style={styles.featureText}>
                {t('common.roleSelect.clientSafe')}
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="location" size={20} color="#10B981" />
              <Text style={styles.featureText}>
                {t('common.roleSelect.clientTracking')}
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="card" size={20} color="#10B981" />
              <Text style={styles.featureText}>
                {t('common.roleSelect.clientPayment')}
              </Text>
            </View>
          </View>

          <Button
            title={t('common.roleSelect.choose') || 'Выбрать'}
            onPress={() => handleRoleSelect('client')}
            style={StyleSheet.flatten([styles.chooseBtn, styles.chooseBtnClient])}
            textStyle={styles.chooseBtnText}
            icon="arrow-forward"
            iconPosition="right"
          />
        </View>

        {/* Driver Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconWrap}>
              <Ionicons name="car" size={32} color="#3B82F6" />
            </View>
            <Text style={styles.cardTitle}>
              {t('common.roleSelect.driverTitle')}
            </Text>
            <Text style={styles.cardSubtitle}>
              {t('common.roleSelect.driverSubtitle')}
            </Text>
          </View>
          
          <View style={styles.cardContent}>
            <View style={styles.featureItem}>
              <Ionicons name="time" size={20} color="#3B82F6" />
              <Text style={styles.featureText}>
                {t('common.roleSelect.driverFlexible')}
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="cash" size={20} color="#3B82F6" />
              <Text style={styles.featureText}>
                {t('common.roleSelect.driverIncome')}
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="call" size={20} color="#3B82F6" />
              <Text style={styles.featureText}>
                {t('common.roleSelect.driverSupport')}
              </Text>
            </View>
          </View>

          <Button
            title={t('common.roleSelect.choose') || 'Выбрать'}
            onPress={() => handleRoleSelect('driver')}
            style={StyleSheet.flatten([styles.chooseBtn, styles.chooseBtnDriver])}
            textStyle={styles.chooseBtnText}
            icon="arrow-forward"
            iconPosition="right"
          />
        </View>

        {/* Login Link (inline, одна строка) */}
        <View style={styles.loginRow}> 
          <Text style={styles.loginText}>
            {t('common.roleSelect.alreadyAccount')}
          </Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.loginLink}>
              {t('common.roleSelect.login')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Отступ между Войти и LanguageButton */}
        <View style={styles.spacerLoginLang} />

        {/* Language and Theme Buttons Row */}
        <View style={themeToggleStyles.container}>
          <LanguageButton 
            onPress={() => setLangModal(true)}
            size="small"
          />
        </View>

        {/* Пустое пространство снизу */}
        <View style={styles.spacerBottom} />
      </ScrollView>

      {/* Language Selector Modal */}
      <LanguageSelector 
        visible={langModal} 
        onClose={() => setLangModal(false)} 
      />
    </View>
  );
};

export default RoleSelectScreen;
