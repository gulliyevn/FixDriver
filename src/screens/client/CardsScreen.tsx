import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClientScreenProps } from '../../types/navigation';
import { CardsScreenStyles as styles } from '../../styles/screens/profile/CardsScreen.styles';
import { mockCards } from '../../mocks/cardsMock';

/**
 * Экран управления банковскими картами
 * 
 * TODO для интеграции с бэкендом:
 * 1. Заменить useState на useCards hook
 * 2. Подключить CardsService для API вызовов
 * 3. Добавить обработку ошибок и загрузки
 * 4. Реализовать добавление/удаление карт
 * 5. Подключить платежную систему
 * 6. Добавить валидацию карт
 */

const CardsScreen: React.FC<ClientScreenProps<'Cards'>> = ({ navigation }) => {
  const [cards] = useState(mockCards);

  const handleAddCard = () => {
    Alert.alert(
      'Добавить карту',
      'Выберите способ добавления',
      [
        { text: 'Сканировать карту', onPress: () => console.log('Сканировать карту') },
        { text: 'Ввести вручную', onPress: () => console.log('Ввести вручную') },
        { text: 'Отмена', style: 'cancel' }
      ]
    );
  };

  const handleDeleteCard = (cardId: string) => {
    Alert.alert(
      'Удалить карту',
      'Вы уверены, что хотите удалить эту карту?',
      [
        { text: 'Удалить', style: 'destructive', onPress: () => console.log(`Удалить карту ${cardId}`) },
        { text: 'Отмена', style: 'cancel' }
      ]
    );
  };

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'visa':
        return 'card';
      case 'mastercard':
        return 'card';
      default:
        return 'card';
    }
  };

  const getCardColor = (type: string) => {
    switch (type) {
      case 'visa':
        return '#1a1f71';
      case 'mastercard':
        return '#eb001b';
      default:
        return '#003366';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.title}>Мои карты</Text>
        <TouchableOpacity onPress={handleAddCard} style={styles.addButton}>
          <Ionicons name="add" size={24} color="#003366" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {cards.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="card-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>Нет добавленных карт</Text>
            <Text style={styles.emptyDescription}>
              Добавьте банковскую карту для быстрого пополнения баланса
            </Text>
            <TouchableOpacity style={styles.addCardButton} onPress={handleAddCard}>
              <Text style={styles.addCardButtonText}>Добавить карту</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {cards.map((card) => (
              <View key={card.id} style={styles.cardItem}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardInfo}>
                    <Ionicons 
                      name={getCardIcon(card.type) as any} 
                      size={32} 
                      color={getCardColor(card.type)} 
                    />
                    <View style={styles.cardDetails}>
                      <Text style={styles.cardName}>{card.name}</Text>
                      <Text style={styles.cardNumber}>•••• {card.lastFour}</Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    onPress={() => handleDeleteCard(card.id)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash-outline" size={20} color="#e53935" />
                  </TouchableOpacity>
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardType}>{card.type.toUpperCase()}</Text>
                  <Text style={styles.cardExpiry}>Действует до {card.expiry}</Text>
                </View>
              </View>
            ))}
            
            <TouchableOpacity style={styles.addNewCardButton} onPress={handleAddCard}>
              <Ionicons name="add-circle-outline" size={24} color="#003366" />
              <Text style={styles.addNewCardText}>Добавить новую карту</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default CardsScreen; 