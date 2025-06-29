import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Alert,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { TravelPackage, ActivePackage, BookingRequest, RoutePoint, Passenger } from '../../types/package';
import PackageService from '../../services/PackageService';
import PackageCard from '../../components/PackageCard';
import RouteBuilder from '../../components/RouteBuilder';
import InputField from '../../components/InputField';
import Select from '../../components/Select';
import PhoneInput from '../../components/PhoneInput';
import Button from '../../components/Button';

type BookingStep = 'package' | 'form' | 'confirmation';

const PlusScreen: React.FC = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  
  // State для управления процессом бронирования
  const [currentStep, setCurrentStep] = useState<BookingStep>('package');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Данные пакетов
  const [activePackage, setActivePackage] = useState<ActivePackage | null>(null);
  const [availablePackages, setAvailablePackages] = useState<TravelPackage[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  
  // Данные формы бронирования
  const [route, setRoute] = useState<RoutePoint[]>([]);
  const [passenger, setPassenger] = useState<Passenger>({
    id: '',
    name: '',
    relationship: '',
    phone: '',
    notes: '',
    isTemplate: false,
  });
  const [passengerTemplates, setPassengerTemplates] = useState<Passenger[]>([]);
  const [departureDate, setDepartureDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [returnTime, setReturnTime] = useState('');
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [driverNotes, setDriverNotes] = useState('');
  
  // Данные расчета
  const [routeDistance, setRouteDistance] = useState(0);
  const [routeDuration, setRouteDuration] = useState(0);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [needsExtraPayment, setNeedsExtraPayment] = useState(false);
  const [extraPaymentAmount, setExtraPaymentAmount] = useState(0);
  const [extraPaymentReason, setExtraPaymentReason] = useState('');

  // Загрузка данных
  const loadData = async () => {
    try {
      setLoading(true);
      
      const [activePackageData, packagesData, templatesData] = await Promise.all([
        PackageService.getActivePackage(user?.id || ''),
        PackageService.getAvailablePackages(),
        PackageService.getPassengerTemplates(user?.id || ''),
      ]);
      
      setActivePackage(activePackageData);
      setAvailablePackages(packagesData);
      setPassengerTemplates(templatesData);
      
      // Если есть активный пакет, автоматически выбираем его
      if (activePackageData) {
        setSelectedPackageId(activePackageData.id);
        setCurrentStep('form');
      }
      
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  // Обновление данных
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Выбор пакета
  const handlePackageSelect = async (packageId: string) => {
    try {
      if (packageId === activePackage?.id) {
        // Если выбран активный пакет, переходим к форме
        setSelectedPackageId(packageId);
        setCurrentStep('form');
        return;
      }

      // Покупка нового пакета
      setLoading(true);
      const purchasedPackage = await PackageService.purchasePackage(packageId, user?.id || '');
      setActivePackage(purchasedPackage);
      setSelectedPackageId(packageId);
      setCurrentStep('form');
      
      Alert.alert('Успешно!', `Пакет "${purchasedPackage.name}" активирован`);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось приобрести пакет');
    } finally {
      setLoading(false);
    }
  };

  // Расчет маршрута
  const handleRouteCalculated = (distance: number, duration: number, price: number) => {
    setRouteDistance(distance);
    setRouteDuration(duration);
    setEstimatedPrice(price);

    // Проверяем, нужна ли доплата
    if (activePackage && activePackage.type !== 'single') {
      const extraPayment = PackageService.checkExtraPayment(activePackage, distance, duration);
      setNeedsExtraPayment(extraPayment.needsExtra);
      setExtraPaymentAmount(extraPayment.extraAmount);
      setExtraPaymentReason(extraPayment.reason || '');
    }
  };

  // Выбор шаблона пассажира
  const handlePassengerTemplateSelect = (option: { value: string | number }) => {
    const template = passengerTemplates.find(t => t.id === option.value);
    if (template) {
      setPassenger(template);
    }
  };

  // Валидация формы
  const validateForm = (): boolean => {
    if (!passenger.name.trim()) {
      Alert.alert('Ошибка', 'Укажите имя пассажира');
      return false;
    }
    
    if (!passenger.relationship.trim()) {
      Alert.alert('Ошибка', 'Укажите отношение к пассажиру');
      return false;
    }
    
    if (route.filter(p => p.address.trim()).length < 2) {
      Alert.alert('Ошибка', 'Укажите минимум 2 адреса в маршруте');
      return false;
    }
    
    if (!departureDate || !departureTime) {
      Alert.alert('Ошибка', 'Укажите дату и время отправления');
      return false;
    }
    
    if (routeDistance === 0) {
      Alert.alert('Ошибка', 'Сначала рассчитайте маршрут');
      return false;
    }

    return true;
  };

  // Переход к подтверждению
  const proceedToConfirmation = () => {
    if (validateForm()) {
      setCurrentStep('confirmation');
    }
  };

  // Создание бронирования
  const handleCreateBooking = async () => {
    try {
      setLoading(true);
      
      const departureDateTime = new Date(`${departureDate} ${departureTime}`);
      const returnDateTime = isRoundTrip && returnTime ? 
        new Date(`${departureDate} ${returnTime}`) : undefined;

      const bookingData: Partial<BookingRequest> = {
        packageId: selectedPackageId,
        passenger,
        route: route.filter(p => p.address.trim()),
        departureTime: departureDateTime,
        returnTime: returnDateTime,
        driverNotes,
        isRoundTrip,
        estimatedDistance: routeDistance,
        estimatedDuration: routeDuration,
        estimatedPrice: estimatedPrice + extraPaymentAmount,
        needsExtraPayment,
        extraPaymentAmount,
      };

      const booking = await PackageService.createBooking(bookingData);
      
      Alert.alert(
        'Поездка забронирована!', 
        `Ваша поездка на ${new Date(booking.departureTime).toLocaleString('ru-RU')} успешно забронирована.`,
        [
          { text: 'OK', onPress: () => {
            // Сброс формы и возврат к началу
            setCurrentStep('package');
            setRoute([]);
            setPassenger({ id: '', name: '', relationship: '', phone: '', notes: '', isTemplate: false });
            setDepartureDate('');
            setDepartureTime('');
            setReturnTime('');
            setDriverNotes('');
            setRouteDistance(0);
            setRouteDuration(0);
            setEstimatedPrice(0);
            loadData(); // Обновляем данные пакета
          }}
        ]
      );
      
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось создать бронирование');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const relationshipOptions = [
    { label: 'Дочь', value: 'дочь' },
    { label: 'Сын', value: 'сын' },
    { label: 'Мама', value: 'мама' },
    { label: 'Папа', value: 'папа' },
    { label: 'Жена', value: 'жена' },
    { label: 'Муж', value: 'муж' },
    { label: 'Бабушка', value: 'бабушка' },
    { label: 'Дедушка', value: 'дедушка' },
    { label: 'Друг', value: 'друг' },
    { label: 'Коллега', value: 'коллега' },
    { label: 'Босс', value: 'босс' },
    { label: 'Клиент', value: 'клиент' },
    { label: 'Я сам(а)', value: 'я' },
  ];

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111827' : '#F9FAFB' }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
            Загрузка...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111827' : '#F9FAFB' }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Заголовок */}
      <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
            Бронирование поездки
          </Text>
          
          {/* Индикатор шагов */}
          <View style={styles.stepIndicator}>
            {[
              { step: 'package', label: 'Пакет', icon: '📦' },
              { step: 'form', label: 'Анкета', icon: '📝' },
              { step: 'confirmation', label: 'Подтверждение', icon: '✅' },
            ].map((item, index) => (
              <View key={item.step} style={styles.stepItem}>
                <View style={[
                  styles.stepCircle,
                  {
                    backgroundColor: currentStep === item.step ? '#3B82F6' :
                      (index < ['package', 'form', 'confirmation'].indexOf(currentStep)) ? '#10B981' : '#D1D5DB'
                  }
                ]}>
                  <Text style={styles.stepIcon}>{item.icon}</Text>
                </View>
                <Text style={[
                  styles.stepLabel,
                  { color: isDark ? '#9CA3AF' : '#6B7280' }
                ]}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* БЛОК 1: Выбор пакета */}
        {currentStep === 'package' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
              Выберите пакет поездок
            </Text>

            {/* Активный пакет */}
            {activePackage && (
              <View style={styles.activePackageSection}>
                <Text style={[styles.activePackageTitle, { color: isDark ? '#10B981' : '#059669' }]}>
                  У вас активен план:
                </Text>
                <PackageCard
                  package={activePackage}
                  isActive={true}
                  onSelect={handlePackageSelect}
                />
                <Button
                  title="Добавить поездку +"
                  onPress={() => handlePackageSelect(activePackage.id)}
                  variant="primary"
                  style={styles.addTripButton}
                />
              </View>
            )}

            {/* Доступные пакеты */}
            {(!activePackage || activePackage.tripsRemaining === 0) && (
              <View style={styles.packagesSection}>
                <Text style={[styles.packagesTitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  {activePackage ? 'Ваш пакет закончился. Выберите новый:' : 'Выберите пакет или оплатите разово:'}
                </Text>
                
                {availablePackages.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    package={pkg}
                    onSelect={handlePackageSelect}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {/* БЛОК 2: Анкета поездки */}
        {currentStep === 'form' && (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
              Детали поездки
            </Text>

            {/* Выбор пассажира */}
            <View style={styles.formGroup}>
              <Text style={[styles.fieldLabel, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
                Информация о пассажире
              </Text>
              
              {passengerTemplates.length > 0 && (
                <Select
                  placeholder="Выберите из сохраненных или введите нового"
                  options={passengerTemplates.map(t => ({ label: `${t.name} (${t.relationship})`, value: t.id }))}
                  value=""
                  onSelect={handlePassengerTemplateSelect}
                />
              )}

              <InputField
                placeholder="Имя пассажира *"
                value={passenger.name}
                onChangeText={(text) => setPassenger({ ...passenger, name: text })}
                required
              />

              <Select
                placeholder="Отношение к пассажиру *"
                options={relationshipOptions}
                value={passenger.relationship}
                onSelect={(option) => setPassenger({ ...passenger, relationship: option.value as string })}
                required
              />

              <PhoneInput
                placeholder="Телефон пассажира (опционально)"
                value={passenger.phone || ''}
                onChangeText={(text) => setPassenger({ ...passenger, phone: text })}
              />
            </View>

            {/* Маршрут */}
            <View style={styles.formGroup}>
              <RouteBuilder
                route={route}
                onRouteChange={setRoute}
                onRouteCalculated={handleRouteCalculated}
              />
            </View>

            {/* Дата и время */}
            <View style={styles.formGroup}>
              <Text style={[styles.fieldLabel, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
                Время поездки
              </Text>
              
              <View style={styles.dateTimeRow}>
                <InputField
                  placeholder="Дата (ДД.ММ.ГГГГ) *"
                  value={departureDate}
                  onChangeText={setDepartureDate}
                  leftIcon="calendar"
                  style={styles.dateInput}
                  required
                />
                
                <InputField
                  placeholder="Время *"
                  value={departureTime}
                  onChangeText={setDepartureTime}
                  leftIcon="time"
                  style={styles.timeInput}
                  required
                />
              </View>

              <View style={styles.roundTripContainer}>
                <Button
                  title={isRoundTrip ? "Обратная поездка: ДА" : "Обратная поездка: НЕТ"}
                  onPress={() => setIsRoundTrip(!isRoundTrip)}
                  variant={isRoundTrip ? "primary" : "outline"}
                  size="small"
                />
                
                {isRoundTrip && (
                  <InputField
                    placeholder="Время возвращения"
                    value={returnTime}
                    onChangeText={setReturnTime}
                    leftIcon="time"
                    style={styles.returnTimeInput}
                  />
                )}
              </View>
            </View>

            {/* Комментарий водителю */}
            <View style={styles.formGroup}>
              <InputField
                placeholder="Комментарий водителю (опционально)"
                value={driverNotes}
                onChangeText={setDriverNotes}
                multiline
                numberOfLines={3}
                style={styles.notesInput}
                leftIcon="chatbubble"
              />
                    </View>

            {/* Расчет стоимости */}
            {routeDistance > 0 && (
              <View style={[styles.priceCalculation, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
                <Text style={[styles.priceTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
                  Расчет поездки
                </Text>
                
                <View style={styles.priceDetails}>
                  <Text style={[styles.priceDetail, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                    🛣️ Расстояние: {routeDistance} км
                  </Text>
                  <Text style={[styles.priceDetail, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                    ⏱️ Время: {routeDuration} мин
                  </Text>
                  <Text style={[styles.priceDetail, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                    💰 Базовая стоимость: {estimatedPrice} ₼
                  </Text>
                  
                  {needsExtraPayment && (
                    <View style={styles.extraPayment}>
                      <Text style={styles.extraPaymentWarning}>
                        ⚠️ {extraPaymentReason}
                      </Text>
                      <Text style={styles.extraPaymentAmount}>
                        Доплата: {extraPaymentAmount} ₼
                      </Text>
                    </View>
                  )}

                  <Text style={[styles.totalPrice, { color: isDark ? '#10B981' : '#059669' }]}>
                    Итого: {estimatedPrice + extraPaymentAmount} ₼
                  </Text>
                </View>
              </View>
            )}

            <Button
              title="Продолжить к подтверждению"
              onPress={proceedToConfirmation}
              variant="primary"
              style={styles.continueButton}
              disabled={routeDistance === 0}
            />
          </View>
        )}

        {/* БЛОК 3: Подтверждение */}
        {currentStep === 'confirmation' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
              Подтверждение бронирования
            </Text>

            <View style={[styles.confirmationCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
              {/* Пакет */}
              <View style={styles.confirmationSection}>
                <Text style={[styles.confirmationLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  Пакет:
                </Text>
                <Text style={[styles.confirmationValue, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
                  {availablePackages.find(p => p.id === selectedPackageId)?.name || activePackage?.name}
                </Text>
        </View>

              {/* Пассажир */}
              <View style={styles.confirmationSection}>
                <Text style={[styles.confirmationLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  Пассажир:
                </Text>
                <Text style={[styles.confirmationValue, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
                  {passenger.name} ({passenger.relationship})
                </Text>
                {passenger.phone && (
                  <Text style={[styles.confirmationSubtext, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                    {passenger.phone}
                  </Text>
                )}
                </View>

              {/* Маршрут */}
              <View style={styles.confirmationSection}>
                <Text style={[styles.confirmationLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  Маршрут:
                </Text>
                {route.filter(p => p.address.trim()).map((point, index) => (
                  <Text key={point.id} style={[styles.confirmationValue, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
                    {index === 0 ? '🟢' : index === route.length - 1 ? '🔴' : '🟡'} {point.address}
                  </Text>
                ))}
        </View>

              {/* Время */}
              <View style={styles.confirmationSection}>
                <Text style={[styles.confirmationLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  Время:
                </Text>
                <Text style={[styles.confirmationValue, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
                  {departureDate} в {departureTime}
                </Text>
                {isRoundTrip && returnTime && (
                  <Text style={[styles.confirmationSubtext, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                    Возвращение: {returnTime}
                  </Text>
                )}
              </View>

              {/* Комментарий */}
              {driverNotes && (
                <View style={styles.confirmationSection}>
                  <Text style={[styles.confirmationLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                    Комментарий:
                  </Text>
                  <Text style={[styles.confirmationValue, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
                    {driverNotes}
                  </Text>
                </View>
              )}

              {/* Стоимость */}
              <View style={[styles.confirmationSection, styles.priceSection]}>
                <Text style={[styles.confirmationLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  Итоговая стоимость:
                </Text>
                <Text style={[styles.finalPrice, { color: isDark ? '#10B981' : '#059669' }]}>
                  {estimatedPrice + extraPaymentAmount} ₼
                </Text>
                {needsExtraPayment && (
                  <Text style={styles.extraPaymentNote}>
                    (включая доплату {extraPaymentAmount} ₼)
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.confirmationButtons}>
              <Button
                title="Назад"
                onPress={() => setCurrentStep('form')}
                variant="outline"
                style={styles.backButton}
              />
              
              <Button
                title="Забронировать поездку"
                onPress={handleCreateBooking}
                variant="success"
                style={styles.confirmButton}
                loading={loading}
              />
        </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  stepItem: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepIcon: {
    fontSize: 16,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  activePackageSection: {
    marginBottom: 16,
  },
  activePackageTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  addTripButton: {
    marginTop: 12,
  },
  packagesSection: {
    marginTop: 16,
  },
  packagesTitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  formGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  templateSelect: {
    marginBottom: 8,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInput: {
    flex: 2,
  },
  timeInput: {
    flex: 1,
  },
  roundTripContainer: {
    marginTop: 12,
  },
  returnTimeInput: {
    marginTop: 8,
  },
  notesInput: {
    height: 80,
  },
  priceCalculation: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  priceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  priceDetails: {
    gap: 6,
  },
  priceDetail: {
    fontSize: 14,
  },
  extraPayment: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#FEF3CD',
    borderRadius: 6,
  },
  extraPaymentWarning: {
    fontSize: 14,
    color: '#92400E',
    marginBottom: 4,
  },
  extraPaymentAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  continueButton: {
    marginTop: 16,
  },
  confirmationCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmationSection: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  confirmationLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  confirmationValue: {
    fontSize: 16,
    marginBottom: 2,
  },
  confirmationSubtext: {
    fontSize: 14,
  },
  priceSection: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  finalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  extraPaymentNote: {
    fontSize: 12,
    color: '#92400E',
    marginTop: 4,
  },
  confirmationButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 2,
  },
});

export default PlusScreen; 