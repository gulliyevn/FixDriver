import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Button from '../../components/Button';
import { RoleSelectScreenStyles } from '../../styles/screens/RoleSelectScreen.styles';
import LanguageSelector from '../../components/LanguageSelector';
import LanguageButton from '../../components/LanguageButton';
import { useLanguage } from '../../context/LanguageContext';
import i18n from '../../i18n';
import { useI18n } from '../../hooks/useI18n';

const RoleSelectScreen: React.FC = () => {
  const navigation = useNavigation();
  const [langModal, setLangModal] = React.useState(false);
  const { t, language } = useI18n();

  React.useEffect(() => {
    console.log('🔧 TokenUtils доступен в консоли как global.TokenUtils');
    console.log('📝 Доступные методы:');
    console.log('   TokenUtils.clearAllTokens() - очистить все токены');
    console.log('   TokenUtils.debugTokens() - показать информацию о токенах');
    console.log('   TokenUtils.forceRefreshTokens() - принудительно обновить токены');
    console.log('   TokenUtils.resetTokens() - полный сброс токенов');
    console.log(' Текущий язык:', language);
    console.log(' common.roleSelect.chooseAccountType:', t('common.roleSelect.chooseAccountType'));
    console.log(' roleSelect в ru:', t('common.roleSelect'));
    console.log(' Ключи, начинающиеся с roleSelect:', Object.keys(t).filter(key => key.startsWith('roleSelect')));
  }, [t, language]);

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
    <View style={RoleSelectScreenStyles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={RoleSelectScreenStyles.contentContainer}
      >
        {/* Отступ сверху над иконкой */}
        <View style={RoleSelectScreenStyles.spacerTop} />

        {/* Логотип и иконка автомобиля по центру */}
        <View style={RoleSelectScreenStyles.headerLogo}>
          <View style={RoleSelectScreenStyles.logoIconWrap}>
            <MaterialCommunityIcons 
              name="car-multiple" 
              size={56} 
              color="#10B981" 
            />
          </View>
          <Text style={RoleSelectScreenStyles.logoText}>FixDrive</Text>
        </View>

        {/* Отступ под иконкой/логотипом */}
        <View style={RoleSelectScreenStyles.spacerLogoBottom} />

        {/* Title (no icon) */}
        <Text style={RoleSelectScreenStyles.title}>
          {t('common.roleSelect.chooseAccountType')}
        </Text>

        {/* Main Content (карточки) */}
        

        {/* Client Card */}
        <View style={RoleSelectScreenStyles.card}>
          <View style={RoleSelectScreenStyles.cardHeader}>
            <View style={RoleSelectScreenStyles.cardIconWrap}>
              <Ionicons name="person" size={32} color="#10B981" />
            </View>
            <Text style={RoleSelectScreenStyles.cardTitle}>
              {t('common.roleSelect.clientTitle')}
            </Text>
            <Text style={RoleSelectScreenStyles.cardSubtitle}>
              {t('common.roleSelect.clientSubtitle')}
            </Text>
          </View>
          
          <View style={RoleSelectScreenStyles.cardContent}>
            <View style={RoleSelectScreenStyles.featureItem}>
              <Ionicons name="shield-checkmark" size={20} color="#10B981" />
              <Text style={RoleSelectScreenStyles.featureText}>
                {t('common.roleSelect.clientSafe')}
              </Text>
            </View>
            <View style={RoleSelectScreenStyles.featureItem}>
              <Ionicons name="location" size={20} color="#10B981" />
              <Text style={RoleSelectScreenStyles.featureText}>
                {t('common.roleSelect.clientTracking')}
              </Text>
            </View>
            <View style={RoleSelectScreenStyles.featureItem}>
              <Ionicons name="card" size={20} color="#10B981" />
              <Text style={RoleSelectScreenStyles.featureText}>
                {t('common.roleSelect.clientPayment')}
              </Text>
            </View>
          </View>

          <Button
            title={t('common.roleSelect.choose') || 'Выбрать'}
            onPress={() => handleRoleSelect('client')}
            style={StyleSheet.flatten([RoleSelectScreenStyles.chooseBtn, RoleSelectScreenStyles.chooseBtnClient])}
            textStyle={RoleSelectScreenStyles.chooseBtnText}
            icon="arrow-forward"
            iconPosition="right"
          />
        </View>

        {/* Driver Card */}
        <View style={RoleSelectScreenStyles.card}>
          <View style={RoleSelectScreenStyles.cardHeader}>
            <View style={RoleSelectScreenStyles.cardIconWrap}>
              <Ionicons name="car" size={32} color="#3B82F6" />
            </View>
            <Text style={RoleSelectScreenStyles.cardTitle}>
              {t('common.roleSelect.driverTitle')}
            </Text>
            <Text style={RoleSelectScreenStyles.cardSubtitle}>
              {t('common.roleSelect.driverSubtitle')}
            </Text>
          </View>
          
          <View style={RoleSelectScreenStyles.cardContent}>
            <View style={RoleSelectScreenStyles.featureItem}>
              <Ionicons name="time" size={20} color="#3B82F6" />
              <Text style={RoleSelectScreenStyles.featureText}>
                {t('common.roleSelect.driverFlexible')}
              </Text>
            </View>
            <View style={RoleSelectScreenStyles.featureItem}>
              <Ionicons name="trending-up" size={20} color="#3B82F6" />
              <Text style={RoleSelectScreenStyles.featureText}>
                {t('common.roleSelect.driverIncome')}
              </Text>
            </View>
            <View style={RoleSelectScreenStyles.featureItem}>
              <Ionicons name="headset" size={20} color="#3B82F6" />
              <Text style={RoleSelectScreenStyles.featureText}>
                {t('common.roleSelect.driverSupport')}
              </Text>
            </View>
          </View>

          <Button
            title={t('common.roleSelect.choose') || 'Выбрать'}
            onPress={() => handleRoleSelect('driver')}
            style={StyleSheet.flatten([RoleSelectScreenStyles.chooseBtn, RoleSelectScreenStyles.chooseBtnDriver])}
            textStyle={RoleSelectScreenStyles.chooseBtnText}
            icon="arrow-forward"
            iconPosition="right"
          />
        </View>

        {/* Login Link (inline, одна строка) */}
        <View style={[RoleSelectScreenStyles.loginRow, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24, marginBottom: 8 }]}> 
          <Text style={RoleSelectScreenStyles.loginText}>
            {t('common.roleSelect.alreadyAccount')}
          </Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={RoleSelectScreenStyles.loginLink}>
              {t('common.roleSelect.login')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Отступ между Войти и LanguageButton */}
        <View style={RoleSelectScreenStyles.spacerLoginLang} />

        {/* Language Button (теперь под Войти) */}
        <View style={RoleSelectScreenStyles.langWrap}>
          <LanguageButton 
            onPress={() => setLangModal(true)}
            size="small"
          />
        </View>

        {/* Пустое пространство снизу */}
        <View style={RoleSelectScreenStyles.spacerBottom} />
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
