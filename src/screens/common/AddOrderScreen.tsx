import React, { useMemo, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { getCurrentColors } from '../../constants/colors';
import { createAddOrderScreenStyles } from '../../styles/screens/AddOrderScreen.styles';
import { orderService } from '../../services/OrderService';
import { useBalance } from '../../hooks/useBalance';
import { useFamilyMembers } from '../../hooks/useFamilyMembers';

const AddOrderScreen: React.FC = () => {
  const { isDark } = useTheme();
  const colors = useMemo(() => getCurrentColors(isDark), [isDark]);
  const styles = useMemo(() => createAddOrderScreenStyles(isDark), [isDark]);
  const { t } = useLanguage();
  const { deductBalance } = useBalance() as any;
  const { familyMembers } = useFamilyMembers() as any;
  const [selectedPassengerId, setSelectedPassengerId] = useState<string | 'self'>('self');

  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [price, setPrice] = useState('6');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stops, setStops] = useState<string[]>([]);
  const [packageType, setPackageType] = useState<'basic' | 'comfort' | 'premium'>('basic');
  const [carClass, setCarClass] = useState<'sedan' | 'suv' | 'minivan'>('sedan');
  const [passengers, setPassengers] = useState<number>(1);

  const handleCreateOrder = async () => {
    if (!pickup || !destination) {
      Alert.alert(t('errors.error'), t('components.form.validation.required'));
      return;
    }
    const amount = Number(price) || 0;
    setIsSubmitting(true);
    try {
      const balanceOk = await deductBalance(amount, `order ${amount} AFc`);
      if (!balanceOk) {
        Alert.alert(t('errors.error'), t('client.paymentHistory.notEnoughFunds') || 'Недостаточно средств');
        return;
      }
      const newOrder = await orderService.createOrder({
        clientId: 'me',
        driverId: '',
        from: pickup,
        to: destination,
        stops,
        packageType,
        carClass,
        passengers,
        departureTime: new Date().toISOString(),
        status: 'pending' as any,
        route: [],
        price: amount,
        distance: 0,
        duration: 0,
        createdAt: '' as any,
        updatedAt: '' as any,
        passenger: selectedPassengerId === 'self'
          ? { name: 'Me', relationship: 'self', phone: '' }
          : { name: `${familyMembers.find((m:any)=>m.id===selectedPassengerId)?.name} ${familyMembers.find((m:any)=>m.id===selectedPassengerId)?.surname}`.trim(), relationship: 'family', phone: familyMembers.find((m:any)=>m.id===selectedPassengerId)?.phone || '' },
      } as any);
      Alert.alert(t('common.success'), `${t('client.orders.created', { id: newOrder.id } as any)}`);
    } catch (e) {
      Alert.alert(t('errors.error'), 'Order failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>
          {t('client.plus.title')}
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>{t('client.plus.step2.pickupAddress')}</Text>
          <TextInput
            value={pickup}
            onChangeText={setPickup}
            placeholder={t('components.input.address')}
            placeholderTextColor={colors.textSecondary}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t('client.plus.step2.destinationAddress')}</Text>
          <TextInput
            value={destination}
            onChangeText={setDestination}
            placeholder={t('components.input.address')}
            placeholderTextColor={colors.textSecondary}
            style={styles.input}
          />
        </View>

        {/* Доп. остановки */}
        <View style={styles.field}>
          <Text style={styles.label}>{t('client.plus.step2.stops') || 'Доп. адреса (остановки)'}</Text>
          <View style={styles.chipsRow}>
            {stops.map((s, idx) => (
              <View key={`${s}-${idx}`} style={[styles.chip, { flexDirection: 'row', alignItems: 'center', gap: 8 }]}> 
                <Text style={styles.chipText}>{s}</Text>
                <TouchableOpacity onPress={() => setStops((prev) => prev.filter((_, i) => i !== idx))}>
                  <Ionicons name="close" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addButton} onPress={() => {
              const next = prompt?.('Введите адрес остановки');
              if (typeof next === 'string' && next.trim()) setStops((p) => [...p, next.trim()]);
            }}>
              <Text style={styles.addButtonText}>{t('components.modal.add') || 'Добавить'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.helperText}>{t('client.plus.step2.notesPlaceholder')}</Text>
        </View>

        {/* Пакет/класс авто */}
        <View style={styles.field}>
          <Text style={styles.sectionTitle}>{t('client.plus.step1.title')}</Text>
          <View style={styles.chipsRow}>
            {(['basic','comfort','premium'] as const).map((p) => (
              <TouchableOpacity key={p} style={[styles.chip, packageType===p && styles.chipActive]} onPress={() => setPackageType(p)}>
                <Text style={[styles.chipText, packageType===p && styles.chipTextActive]}>{t(`premium.package.${p}`) || p}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.sectionTitle}>{t('client.cars.title') || 'Класс авто'}</Text>
          <View style={styles.chipsRow}>
            {(['sedan','suv','minivan'] as const).map((c) => (
              <TouchableOpacity key={c} style={[styles.chip, carClass===c && styles.chipActive]} onPress={() => setCarClass(c)}>
                <Text style={[styles.chipText, carClass===c && styles.chipTextActive]}>{t(`components.card.${c}`) || c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Пассажир: Я или член семьи */}
        <View style={styles.field}>
          <Text style={styles.sectionTitle}>{t('profile.family.title') || 'Пассажир'}</Text>
          <View style={styles.chipsRow}>
            <TouchableOpacity style={[styles.chip, selectedPassengerId==='self' && styles.chipActive]} onPress={() => setSelectedPassengerId('self')}>
              <Text style={[styles.chipText, selectedPassengerId==='self' && styles.chipTextActive]}>{t('profile.title') || 'Я'}</Text>
            </TouchableOpacity>
            {familyMembers?.map((m:any)=> (
              <TouchableOpacity key={m.id} style={[styles.chip, selectedPassengerId===m.id && styles.chipActive]} onPress={() => setSelectedPassengerId(m.id)}>
                <Text style={[styles.chipText, selectedPassengerId===m.id && styles.chipTextActive]}>{`${m.name} ${m.surname}`}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.helperText}>{t('profile.family.choosePassenger') || 'Выберите для кого оформляется поездка'}</Text>
        </View>

        {/* Пассажиры */}
        <View style={styles.field}>
          <Text style={styles.label}>{t('client.plus.step2.passengers')}</Text>
          <View style={styles.stepper}>
            <TouchableOpacity style={styles.stepperBtn} onPress={() => setPassengers((v)=>Math.max(1, v-1))}>
              <Ionicons name="remove" size={18} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.stepperValue}>{passengers}</Text>
            <TouchableOpacity style={styles.stepperBtn} onPress={() => setPassengers((v)=>Math.min(7, v+1))}>
              <Ionicons name="add" size={18} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t('client.balance.amountInAFc')}</Text>
          <TextInput
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
            placeholder="0"
            placeholderTextColor={colors.textSecondary}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t('components.input.comment')}</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder={t('components.input.comment')}
            placeholderTextColor={colors.textSecondary}
            style={[styles.input, styles.inputMultiline]}
            multiline
          />
        </View>

        <TouchableOpacity disabled={isSubmitting} onPress={handleCreateOrder} style={styles.submitButton}>
          <Text style={styles.submitText}>{t('client.orders.create', { defaultValue: 'Создать заказ' } as any)}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddOrderScreen;


