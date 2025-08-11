import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  StatusBar,
  Alert,
  TextInput
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ClientStackParamList } from '../../types/navigation';
import { PlusScreenStyles } from '../../styles/screens/PlusScreen.styles';
import { colors } from '../../constants/colors';

type NavigationProp = StackNavigationProp<ClientStackParamList, 'Plus'>;

interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  rides: number;
  duration: string;
  popular?: boolean;
}

const PlusScreen: React.FC = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const navigation = useNavigation<NavigationProp>();
  const currentColors = isDark ? colors.dark : colors.light;
  
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [step, setStep] = useState<'package' | 'details' | 'route'>('package');
  const [bookingDetails, setBookingDetails] = useState({
    passengers: 1,
    pickupAddress: '',
    destinationAddress: '',
    date: new Date(),
    time: new Date(),
    notes: ''
  });

  const packages: Package[] = [
    {
      id: 'basic',
      name: 'Базовый',
      description: '10 поездок в месяц',
      price: 5000,
      rides: 10,
      duration: '30 дней'
    },
    {
      id: 'standard',
      name: 'Стандарт',
      description: '20 поездок в месяц',
      price: 8000,
      rides: 20,
      duration: '30 дней',
      popular: true
    },
    {
      id: 'premium',
      name: 'Премиум',
      description: 'Безлимитные поездки',
      price: 15000,
      rides: -1,
      duration: '30 дней'
    }
  ];

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
    setStep('details');
  };

  const handleNextStep = () => {
    if (step === 'package') {
      setStep('details');
    } else if (step === 'details') {
      setStep('route');
    } else {
      // Финальный шаг - создание бронирования
      handleCreateBooking();
    }
  };

  const handleCreateBooking = () => {
    Alert.alert(
      'Бронирование создано',
      'Ваша поездка успешно забронирована!',
      [
        { text: 'OK', onPress: () => navigation.navigate('Schedule') }
      ]
    );
  };

  const renderPackageStep = () => (
    <ScrollView style={PlusScreenStyles.content} showsVerticalScrollIndicator={false}>
      <Text style={[PlusScreenStyles.stepTitle, { color: currentColors.text }]}>
        {t('client.plus.step1.title')}
      </Text>
      <Text style={[PlusScreenStyles.stepDescription, { color: currentColors.textSecondary }]}>
        {t('client.plus.step1.description')}
      </Text>
      
      {packages.map((pkg) => (
        <TouchableOpacity
          key={pkg.id}
          style={[
            PlusScreenStyles.packageCard,
            { backgroundColor: currentColors.card },
            selectedPackage === pkg.id && { borderColor: currentColors.primary, borderWidth: 2 }
          ]}
          onPress={() => handlePackageSelect(pkg.id)}
        >
          {pkg.popular && (
            <View style={[PlusScreenStyles.popularBadge, { backgroundColor: currentColors.primary }]}>
              <Text style={[PlusScreenStyles.popularText, { color: currentColors.card }]}>{t('client.plus.step1.popular')}</Text>
            </View>
          )}
          
          <View style={PlusScreenStyles.packageHeader}>
            <Text style={[PlusScreenStyles.packageName, { color: currentColors.text }]}>{pkg.name}</Text>
            <Text style={[PlusScreenStyles.packagePrice, { color: currentColors.primary }]}>
              {pkg.price.toLocaleString()} ₽
            </Text>
          </View>
          
          <Text style={[PlusScreenStyles.packageDescription, { color: currentColors.textSecondary }]}>
            {pkg.description}
          </Text>
          
          <View style={PlusScreenStyles.packageDetails}>
            <Text style={[PlusScreenStyles.packageDetail, { color: currentColors.textSecondary }]}>
              {pkg.rides === -1 ? 'Безлимит' : `${pkg.rides} поездок`}
            </Text>
            <Text style={[PlusScreenStyles.packageDetail, { color: currentColors.textSecondary }]}>
              {pkg.duration}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderDetailsStep = () => (
    <ScrollView style={PlusScreenStyles.content} showsVerticalScrollIndicator={false}>
      <Text style={[PlusScreenStyles.stepTitle, { color: currentColors.text }]}>
        {t('client.plus.step2.title')}
      </Text>
      
      <View style={[PlusScreenStyles.inputGroup, { backgroundColor: currentColors.card }]}>
        <Text style={[PlusScreenStyles.inputLabel, { color: currentColors.text }]}>{t('client.plus.step2.passengers')}</Text>
        <TextInput
          style={[PlusScreenStyles.input, { color: currentColors.text, borderColor: currentColors.border }]}
          value={bookingDetails.passengers.toString()}
          onChangeText={(text) => setBookingDetails(prev => ({ ...prev, passengers: parseInt(text) || 1 }))}
          keyboardType="numeric"
          placeholder="1"
          placeholderTextColor={currentColors.textSecondary}
        />
      </View>
      
      <View style={[PlusScreenStyles.inputGroup, { backgroundColor: currentColors.card }]}>
        <Text style={[PlusScreenStyles.inputLabel, { color: currentColors.text }]}>{t('client.plus.step2.pickupAddress')}</Text>
        <TextInput
          style={[PlusScreenStyles.input, { color: currentColors.text, borderColor: currentColors.border }]}
          value={bookingDetails.pickupAddress}
          onChangeText={(text) => setBookingDetails(prev => ({ ...prev, pickupAddress: text }))}
          placeholder={t('client.plus.step2.pickupAddress')}
          placeholderTextColor={currentColors.textSecondary}
        />
      </View>
      
      <View style={[PlusScreenStyles.inputGroup, { backgroundColor: currentColors.card }]}>
        <Text style={[PlusScreenStyles.inputLabel, { color: currentColors.text }]}>{t('client.plus.step2.destinationAddress')}</Text>
        <TextInput
          style={[PlusScreenStyles.input, { color: currentColors.text, borderColor: currentColors.border }]}
          value={bookingDetails.destinationAddress}
          onChangeText={(text) => setBookingDetails(prev => ({ ...prev, destinationAddress: text }))}
          placeholder={t('client.plus.step2.destinationAddress')}
          placeholderTextColor={currentColors.textSecondary}
        />
      </View>
      
      <View style={[PlusScreenStyles.inputGroup, { backgroundColor: currentColors.card }]}>
        <Text style={[PlusScreenStyles.inputLabel, { color: currentColors.text }]}>{t('client.plus.step2.notes')}</Text>
        <TextInput
          style={[PlusScreenStyles.textArea, { color: currentColors.text, borderColor: currentColors.border }]}
          value={bookingDetails.notes}
          onChangeText={(text) => setBookingDetails(prev => ({ ...prev, notes: text }))}
          placeholder={t('client.plus.step2.notesPlaceholder')}
          placeholderTextColor={currentColors.textSecondary}
          multiline
          numberOfLines={3}
        />
      </View>
    </ScrollView>
  );

  const renderRouteStep = () => (
    <View style={PlusScreenStyles.content}>
      <Text style={[PlusScreenStyles.stepTitle, { color: currentColors.text }]}>
        Подтверждение маршрута
      </Text>
      
      <View style={[PlusScreenStyles.routeCard, { backgroundColor: currentColors.card }]}>
        <View style={PlusScreenStyles.routePoint}>
          <View style={[PlusScreenStyles.routeDot, { backgroundColor: currentColors.textTertiary }]} />
          <Text style={[PlusScreenStyles.routeAddress, { color: currentColors.text }]}>
            {bookingDetails.pickupAddress || 'Адрес отправления'}
          </Text>
        </View>
        
        <View style={[PlusScreenStyles.routeLine, { backgroundColor: currentColors.secondary }]} />
        
        <View style={PlusScreenStyles.routePoint}>
          <View style={[PlusScreenStyles.routeDot, { backgroundColor: currentColors.textSecondary }]} />
          <Text style={[PlusScreenStyles.routeAddress, { color: currentColors.text }]}>
            {bookingDetails.destinationAddress || 'Адрес назначения'}
          </Text>
        </View>
      </View>
      
      <View style={[PlusScreenStyles.summaryCard, { backgroundColor: currentColors.card }]}>
        <Text style={[PlusScreenStyles.summaryTitle, { color: currentColors.text }]}>Детали бронирования</Text>
        <Text style={[PlusScreenStyles.summaryText, { color: currentColors.textSecondary }]}>
          Пассажиры: {bookingDetails.passengers}
        </Text>
        <Text style={[PlusScreenStyles.summaryText, { color: currentColors.textSecondary }]}>
          Пакет: {packages.find(p => p.id === selectedPackage)?.name}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[PlusScreenStyles.container, { backgroundColor: currentColors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[PlusScreenStyles.header, { backgroundColor: currentColors.card }]}>
        <TouchableOpacity
          style={PlusScreenStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={currentColors.text} />
        </TouchableOpacity>
        
        <Text style={[PlusScreenStyles.title, { color: currentColors.text }]}>
          {step === 'package' ? 'Выбор пакета' : 
           step === 'details' ? 'Детали поездки' : 'Подтверждение'}
        </Text>
        
        <View style={PlusScreenStyles.placeholder} />
      </View>

      {/* Step Indicator */}
      <View style={PlusScreenStyles.stepIndicator}>
        <View style={[PlusScreenStyles.step, step === 'package' && { backgroundColor: currentColors.primary }]} />
        <View style={[PlusScreenStyles.step, step === 'details' && { backgroundColor: currentColors.primary }]} />
        <View style={[PlusScreenStyles.step, step === 'route' && { backgroundColor: currentColors.primary }]} />
      </View>

      {/* Content */}
      {step === 'package' && renderPackageStep()}
      {step === 'details' && renderDetailsStep()}
      {step === 'route' && renderRouteStep()}

      {/* Next Button */}
      {step !== 'package' && (
        <View style={PlusScreenStyles.buttonContainer}>
          <TouchableOpacity
            style={[PlusScreenStyles.nextButton, { backgroundColor: currentColors.primary }]}
            onPress={handleNextStep}
          >
            <Text style={[PlusScreenStyles.nextButtonText, { color: currentColors.card }]}>
              {step === 'details' ? 'Продолжить' : 'Забронировать'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Loading Overlay */}
      {loading && (
        <View style={PlusScreenStyles.loadingOverlay}>
          <Text style={[PlusScreenStyles.loadingText, { color: currentColors.text }]}>Загрузка...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default PlusScreen; 