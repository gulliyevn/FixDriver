import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StartTripScreenStyles } from '../../styles/screens/StartTripScreen.styles';

export default function StartTripScreen() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartTrip = () => {
    setIsLoading(true);
    // TODO: Реальная логика начала поездки
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Поездка начата', 'Удачной поездки!');
      navigation.goBack();
    }, 1000);
  };

  const handleCancelTrip = () => {
    Alert.alert(
      'Отменить поездку',
      'Вы уверены, что хотите отменить поездку?',
      [
        { text: 'Нет', style: 'cancel' },
        { text: 'Да', onPress: () => navigation.goBack(), style: 'destructive' }
      ]
    );
  };

  return (
    <SafeAreaView style={StartTripScreenStyles.container}>
      <View style={StartTripScreenStyles.content}>
        <View style={StartTripScreenStyles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={StartTripScreenStyles.title}>Начать поездку</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={StartTripScreenStyles.tripInfo}>
          <Text style={StartTripScreenStyles.tripTitle}>Детали поездки</Text>
          
          <View style={StartTripScreenStyles.infoCard}>
            <View style={StartTripScreenStyles.infoRow}>
              <Ionicons name="person" size={20} color="#666" />
              <Text style={StartTripScreenStyles.infoText}>Анна Иванова</Text>
            </View>
            
            <View style={StartTripScreenStyles.infoRow}>
              <Ionicons name="call" size={20} color="#666" />
              <Text style={StartTripScreenStyles.infoText}>+7 (999) 123-45-67</Text>
            </View>
            
            <View style={StartTripScreenStyles.infoRow}>
              <Ionicons name="location" size={20} color="#666" />
              <Text style={StartTripScreenStyles.infoText}>ул. Ленина, 15</Text>
            </View>
            
            <View style={StartTripScreenStyles.infoRow}>
              <Ionicons name="navigate" size={20} color="#666" />
              <Text style={StartTripScreenStyles.infoText}>ул. Пушкина, 8</Text>
            </View>
            
            <View style={StartTripScreenStyles.infoRow}>
              <Ionicons name="cash" size={20} color="#666" />
              <Text style={StartTripScreenStyles.infoText}>450 ₽</Text>
            </View>
          </View>
        </View>

        <View style={StartTripScreenStyles.actions}>
          <TouchableOpacity
            style={[StartTripScreenStyles.startButton, isLoading && StartTripScreenStyles.startButtonDisabled]}
            onPress={handleStartTrip}
            disabled={isLoading}
          >
            <Ionicons name="play" size={24} color="#fff" />
            <Text style={StartTripScreenStyles.startButtonText}>
              {isLoading ? 'Запуск...' : 'Начать поездку'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={StartTripScreenStyles.cancelButton}
            onPress={handleCancelTrip}
          >
            <Text style={StartTripScreenStyles.cancelButtonText}>Отменить</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
