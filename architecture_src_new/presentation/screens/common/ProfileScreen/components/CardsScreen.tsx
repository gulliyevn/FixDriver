import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Modal, TextInput, Platform } from 'react-native';
import { ChevronLeft, Plus, Edit, Trash2, CreditCard } from '../../../../../shared/components/IconLibrary';
import { useTheme } from '../../../../../core/context/ThemeContext';
import { useAuth } from '../../../../../core/context/AuthContext';
import { useI18n } from '../../../../../shared/i18n';
import { createCardsScreenStyles } from './styles/CardsScreen.styles.ts';

interface Card {
  id: string;
  number: string;
  holderName: string;
  expiryDate: string;
  type: 'visa' | 'mastercard' | 'maestro';
  isDefault: boolean;
}

interface CardsScreenProps {
  onBack: () => void;
}

const CardsScreen: React.FC<CardsScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { t } = useI18n();
  const styles = createCardsScreenStyles(colors);

  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);

  // Моковые данные карт
  const mockCards: Card[] = [
    {
      id: '1',
      number: '**** **** **** 1234',
      holderName: (user as any)?.name || (user as any)?.firstName + ' ' + (user as any)?.lastName || 'Иван Иванов',
      expiryDate: '12/25',
      type: 'visa',
      isDefault: true,
    },
    {
      id: '2',
      number: '**** **** **** 5678',
      holderName: (user as any)?.name || (user as any)?.firstName + ' ' + (user as any)?.lastName || 'Иван Иванов',
      expiryDate: '08/26',
      type: 'mastercard',
      isDefault: false,
    },
  ];

  const isDriver = user?.role === 'driver';

  // Условная логика для разных ролей
  const getScreenTitle = () => {
    return isDriver ? t('driver.cards.title') : t('profile.cards.title');
  };

  const getEmptyStateTitle = () => {
    return isDriver ? t('driver.cards.noCards') : t('profile.cards.noCards');
  };

  const getEmptyStateDescription = () => {
    return isDriver ? t('driver.cards.noCardsDescription') : t('profile.cards.noCardsDescription');
  };

  // Загрузка карт
  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    setIsLoading(true);
    try {
      // TODO: Загрузка карт пользователя с бэкенда
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCards(mockCards);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить карты');
    } finally {
      setIsLoading(false);
    }
  };

  // Добавление новой карты
  const handleAddCard = async (cardData: Partial<Card>) => {
    try {
      // TODO: Добавление карты через API
      const newCard: Card = {
        id: Date.now().toString(),
        number: cardData.number || '**** **** **** 0000',
        holderName: cardData.holderName || '',
        expiryDate: cardData.expiryDate || '',
        type: cardData.type || 'visa',
        isDefault: cards.length === 0, // Первая карта становится основной
      };
      
      setCards(prev => [...prev, newCard]);
      setAddModalVisible(false);
      Alert.alert('Успех', 'Карта добавлена');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось добавить карту');
    }
  };

  // Редактирование карты
  const handleEditCard = async (cardId: string, updates: Partial<Card>) => {
    try {
      // TODO: Обновление карты через API
      setCards(prev => prev.map(card => 
        card.id === cardId ? { ...card, ...updates } : card
      ));
      setEditModalVisible(false);
      setEditingCard(null);
      Alert.alert('Успех', 'Карта обновлена');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось обновить карту');
    }
  };

  // Удаление карты
  const handleDeleteCard = (cardId: string) => {
    Alert.alert(
      'Удаление карты',
      'Вы уверены, что хотите удалить эту карту?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: Удаление карты через API
              setCards(prev => prev.filter(card => card.id !== cardId));
              Alert.alert('Успех', 'Карта удалена');
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось удалить карту');
            }
          }
        }
      ]
    );
  };

  // Установка карты по умолчанию
  const handleSetDefault = async (cardId: string) => {
    try {
      // TODO: Установка карты по умолчанию через API
      setCards(prev => prev.map(card => ({
        ...card,
        isDefault: card.id === cardId
      })));
      Alert.alert('Успех', 'Карта установлена по умолчанию');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось установить карту по умолчанию');
    }
  };

  // Сканирование карты
  const handleScanCard = async () => {
    Alert.alert(
      'Сканер карт',
      'Функция сканирования карт будет доступна в продакшн версии.',
      [{ text: 'OK' }]
    );
  };

  // Получение иконки типа карты
  const getCardIcon = (type: string) => {
    return <CreditCard size={24} color={colors.text} />;
  };

  // Получение цвета типа карты
  const getCardColor = (type: string) => {
    switch (type) {
      case 'visa': return '#1A1F71';
      case 'mastercard': return '#EB001B';
      case 'maestro': return '#0066CC';
      default: return colors.primary;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{getScreenTitle()}</Text>
        <TouchableOpacity onPress={handleScanCard} style={styles.scanButton}>
          <Plus size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Кнопка добавления карты */}
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => setAddModalVisible(true)}
        >
          <Plus size={20} color={colors.background} />
          <Text style={styles.addButtonText}>
            {t('profile.cards.addCard')}
          </Text>
        </TouchableOpacity>

        {/* Список карт */}
        {cards.length > 0 ? (
          <View style={styles.cardsList}>
            {cards.map((card) => (
              <View key={card.id} style={styles.cardItem}>
                <View style={[styles.cardContent, { borderColor: getCardColor(card.type) }]}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardType}>
                      {getCardIcon(card.type)}
                      <Text style={styles.cardTypeText}>
                        {card.type.toUpperCase()}
                      </Text>
                    </View>
                    {card.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultText}>
                          {t('profile.cards.default')}
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  <Text style={styles.cardNumber}>{card.number}</Text>
                  <Text style={styles.cardHolder}>{card.holderName}</Text>
                  <Text style={styles.cardExpiry}>{card.expiryDate}</Text>
                </View>
                
                <View style={styles.cardActions}>
                  {!card.isDefault && (
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleSetDefault(card.id)}
                    >
                      <Text style={styles.actionButtonText}>
                        {t('profile.cards.setDefault')}
                      </Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => {
                      setEditingCard(card);
                      setEditModalVisible(true);
                    }}
                  >
                    <Edit size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleDeleteCard(card.id)}
                  >
                    <Trash2 size={16} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <CreditCard size={64} color={colors.textSecondary} />
            <Text style={styles.emptyStateTitle}>{getEmptyStateTitle()}</Text>
            <Text style={styles.emptyStateDescription}>
              {getEmptyStateDescription()}
            </Text>
          </View>
        )}

        {/* Информация о безопасности */}
        <View style={styles.securityInfo}>
          <Text style={styles.securityTitle}>
            {t('profile.cards.security')}
          </Text>
          <Text style={styles.securityText}>
            {t('profile.cards.securityDescription')}
          </Text>
        </View>
      </ScrollView>

      {/* Модальное окно добавления карты */}
      <AddCardModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSave={handleAddCard}
        colors={colors}
        t={t}
      />

      {/* Модальное окно редактирования карты */}
      <EditCardModal
        visible={editModalVisible}
        card={editingCard}
        onClose={() => {
          setEditModalVisible(false);
          setEditingCard(null);
        }}
        onSave={(updates) => editingCard && handleEditCard(editingCard.id, updates)}
        colors={colors}
        t={t}
      />
    </View>
  );
};

// Компонент модального окна добавления карты
const AddCardModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onSave: (cardData: Partial<Card>) => void;
  colors: any;
  t: (key: string) => string;
}> = ({ visible, onClose, onSave, colors, t }) => {
  const modalStyles = createCardsScreenStyles(colors);
  const [formData, setFormData] = useState({
    number: '',
    holderName: '',
    expiryDate: '',
    type: 'visa' as const,
  });

  const handleSave = () => {
    if (!formData.number || !formData.holderName || !formData.expiryDate) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }
    onSave(formData);
    setFormData({ number: '', holderName: '', expiryDate: '', type: 'visa' });
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={modalStyles.modalOverlay}>
        <View style={modalStyles.modalContent}>
          <Text style={modalStyles.modalTitle}>{t('profile.cards.addCard')}</Text>
          
          <TextInput
            style={modalStyles.modalInput}
            placeholder={t('profile.cards.cardNumber')}
            value={formData.number}
            onChangeText={(text) => setFormData(prev => ({ ...prev, number: text }))}
            keyboardType="numeric"
            maxLength={19}
          />
          
          <TextInput
            style={modalStyles.modalInput}
            placeholder={t('profile.cards.holderName')}
            value={formData.holderName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, holderName: text }))}
          />
          
          <TextInput
            style={modalStyles.modalInput}
            placeholder="MM/YY"
            value={formData.expiryDate}
            onChangeText={(text) => setFormData(prev => ({ ...prev, expiryDate: text }))}
            maxLength={5}
          />
          
          <View style={modalStyles.modalButtons}>
            <TouchableOpacity style={modalStyles.modalCancelButton} onPress={onClose}>
              <Text style={modalStyles.modalCancelButtonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={modalStyles.modalSaveButton} onPress={handleSave}>
              <Text style={modalStyles.modalSaveButtonText}>{t('common.save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Компонент модального окна редактирования карты
const EditCardModal: React.FC<{
  visible: boolean;
  card: Card | null;
  onClose: () => void;
  onSave: (updates: Partial<Card>) => void;
  colors: any;
  t: (key: string) => string;
}> = ({ visible, card, onClose, onSave, colors, t }) => {
  const modalStyles = createCardsScreenStyles(colors);
  const [formData, setFormData] = useState({
    holderName: '',
    expiryDate: '',
  });

  useEffect(() => {
    if (card) {
      setFormData({
        holderName: card.holderName,
        expiryDate: card.expiryDate,
      });
    }
  }, [card]);

  const handleSave = () => {
    if (!formData.holderName || !formData.expiryDate) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }
    onSave(formData);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={modalStyles.modalOverlay}>
        <View style={modalStyles.modalContent}>
          <Text style={modalStyles.modalTitle}>{t('profile.cards.editCard')}</Text>
          
          <TextInput
            style={modalStyles.modalInput}
            placeholder={t('profile.cards.holderName')}
            value={formData.holderName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, holderName: text }))}
          />
          
          <TextInput
            style={modalStyles.modalInput}
            placeholder="MM/YY"
            value={formData.expiryDate}
            onChangeText={(text) => setFormData(prev => ({ ...prev, expiryDate: text }))}
            maxLength={5}
          />
          
          <View style={modalStyles.modalButtons}>
            <TouchableOpacity style={modalStyles.modalCancelButton} onPress={onClose}>
              <Text style={modalStyles.modalCancelButtonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={modalStyles.modalSaveButton} onPress={handleSave}>
              <Text style={modalStyles.modalSaveButtonText}>{t('common.save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CardsScreen;
