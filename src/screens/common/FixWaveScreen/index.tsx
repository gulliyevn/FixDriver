import React, { useMemo, useState, useRef } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import { getCurrentColors } from '../../../constants/colors';
import { createFixWaveScreenStyles } from './styles';
import FixDriveDropdown from '../../../components/FixDriveDropdown';
import FixDriveMapInput from '../../../components/FixDriveMapInput';
import { useFixDriveFamilyMembers } from '../../../hooks/useFixDriveFamilyMembers';

const FixWaveScreen: React.FC = () => {
  const { isDark } = useTheme();
  const colors = useMemo(() => getCurrentColors(isDark), [isDark]);
  const styles = useMemo(() => createFixWaveScreenStyles(isDark), [isDark]);
  const { t } = useLanguage();

  // Состояние для переключения кнопки
  const [isButtonLeft, setIsButtonLeft] = useState(true);
  const buttonPosition = useRef(new Animated.Value(0)).current;
  
  // Хук для получения участников семьи
  const { getFamilyMemberOptions, getFamilyMemberById, familyMembers, loading } = useFixDriveFamilyMembers();
  
  // Состояния для выбранных значений
  const [selectedFamilyMember, setSelectedFamilyMember] = useState<string>('');
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [addresses, setAddresses] = useState<any[]>([]);

  // Обработчик переключения кнопки с анимацией
  const toggleButtonPosition = () => {
    const toValue = isButtonLeft ? 1 : 0;
    
    Animated.timing(buttonPosition, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    
    setIsButtonLeft(!isButtonLeft);
  };

  // Обработчик клика по кнопке (переключает контент)
  const handleButtonPress = () => {
    toggleButtonPosition();
  };

  // Обработчик клика по контейнеру (только переключает)
  const handleContainerPress = () => {
    toggleButtonPosition();
  };

  // Опции для dropdown участников семьи
  const familyMemberOptions = getFamilyMemberOptions();

  // Опции для dropdown пакетов
  const packageOptions = [
    { key: 'standard', label: t('premium.packages.standard'), value: 'standard' },
    { key: 'plus', label: t('premium.packages.plus'), value: 'plus' },
    { key: 'premium', label: t('premium.packages.premium'), value: 'premium' },
  ];

  // Обработчики выбора
  const handleFamilyMemberSelect = (value: string) => {
    setSelectedFamilyMember(value);
  };

  const handlePackageSelect = (value: string) => {
    setSelectedPackage(value);
  };

  const handleAddressesChange = (newAddresses: any[]) => {
    setAddresses(newAddresses);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Хедер скопированный из ChatListScreen */}
      <View style={styles.header}>
        {/* Пустой контейнер слева для центрирования */}
        <View style={styles.headerLeft} />
        
        {/* Контейнер по центру */}
        <View style={styles.headerContainer}>
          {/* Анимированная кнопка */}
          <Animated.View 
            style={[
              styles.headerButton,
              {
                left: buttonPosition.interpolate({
                  inputRange: [0, 1],
                  outputRange: [4, 96], // 4px от левого края или 96px от левого края (200-100-4)
                }),
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.buttonInner}
              onPress={handleButtonPress}
            >
              <Text style={styles.buttonText}>
                {isButtonLeft ? 'FixDrive' : 'FixWave'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
          
          {/* TouchableOpacity для клика по контейнеру */}
          <TouchableOpacity 
            style={styles.containerTouchable}
            onPress={handleContainerPress}
            activeOpacity={1}
          />
        </View>
        
        {/* Пустой контейнер справа для центрирования */}
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={{ flex: 1, padding: 20 }} showsVerticalScrollIndicator={false}>
        
        {/* 3 круга с иконками и прогресс барами между ними - показываем только на левой странице */}
        {isButtonLeft && (
          <>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-around', 
              alignItems: 'center',
              paddingTop: 0,
              paddingBottom: 10
            }}>
              {/* Круг 1 */}
              <View style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 20,
                backgroundColor: colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3
              }}>
                <Ionicons name="location" size={18} color="#FFFFFF" />
              </View>
              
              {/* Прогресс бар 1 */}
              <View style={{ 
                flex: 1, 
                height: 2, 
                backgroundColor: '#E0E0E0', 
                borderRadius: 1,
                marginHorizontal: 10,
                overflow: 'hidden'
              }}>
                <View style={{ 
                  height: '100%', 
                  width: '0%', 
                  backgroundColor: colors.primary,
                  borderRadius: 1
                }} />
              </View>
              
              {/* Круг 2 */}
              <View style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 20,
                backgroundColor: colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3
              }}>
                <Ionicons name="time" size={18} color="#FFFFFF" />
              </View>
              
              {/* Прогресс бар 2 */}
              <View style={{ 
                flex: 1, 
                height: 2, 
                backgroundColor: '#E0E0E0', 
                borderRadius: 1,
                marginHorizontal: 10,
                overflow: 'hidden'
              }}>
                <View style={{ 
                  height: '100%', 
                  width: '0%', 
                  backgroundColor: colors.primary,
                  borderRadius: 1
                }} />
              </View>
              
              {/* Круг 3 */}
              <View style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 20,
                backgroundColor: colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3
              }}>
                <Ionicons name="car" size={18} color="#FFFFFF" />
              </View>
            </View>
            
            {/* Контейнеры выбора */}
            <View style={{ marginTop: 10 }}>
              {/* Выбор участника семьи */}
              {loading ? (
                <Text style={{ color: colors.primary, textAlign: 'center', marginBottom: 16 }}>
                  Загрузка участников семьи...
                </Text>
              ) : (
                <FixDriveDropdown
                  label={t('common.fixDrive.selectFamilyMember')}
                  placeholder={t('common.fixDrive.familyMemberPlaceholder')}
                  options={familyMemberOptions}
                  selectedValue={selectedFamilyMember}
                  onSelect={handleFamilyMemberSelect}
                />
              )}

              {/* Выбор пакета */}
              <FixDriveDropdown
                label={t('common.fixDrive.selectPackage')}
                placeholder={t('common.fixDrive.packagePlaceholder')}
                options={packageOptions}
                selectedValue={selectedPackage}
                onSelect={handlePackageSelect}
              />

              {/* Ввод адреса через карту */}
              <FixDriveMapInput onAddressesChange={handleAddressesChange} />
              
              {/* Одна широкая кнопка Сохранить */}
              <TouchableOpacity 
                style={{ 
                  backgroundColor: colors.primary,
                  paddingVertical: 12,
                  marginHorizontal: 20,
                  marginTop: 8,
                  marginBottom: 20,
                  borderRadius: 8
                }}
              >
                <Text style={{ 
                  color: '#FFFFFF', 
                  fontSize: 16, 
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  {t('common.save')}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        
      </ScrollView>
    </SafeAreaView>
  );
};

export default FixWaveScreen;
