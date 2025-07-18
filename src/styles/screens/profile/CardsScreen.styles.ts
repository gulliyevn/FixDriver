import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';

export const CardsScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60, // Увеличиваем отступ сверху для SafeArea
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003366',
  },
  addButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  // Пустое состояние
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#003366',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 32,
  },
  addCardButton: {
    backgroundColor: '#003366',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  addCardButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Карточки
  cardItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardDetails: {
    marginLeft: 12,
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003366',
    marginBottom: 4,
  },
  cardNumber: {
    fontSize: 14,
    color: '#888',
  },
  deleteButton: {
    padding: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#003366',
  },
  cardExpiry: {
    fontSize: 14,
    color: '#888',
  },
  // Добавить новую карту
  addNewCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 16,
  },
  addNewCardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003366',
    marginLeft: 8,
  },
});

// Функция для получения динамических стилей в зависимости от темы
export const getCardsScreenStyles = (isDark: boolean) => {
  const currentColors = isDark ? colors.dark : colors.light;
  
  return {
    container: {
      backgroundColor: currentColors.background,
    },
    header: {
      borderBottomColor: currentColors.border,
    },
    title: {
      color: currentColors.text,
    },
    emptyTitle: {
      color: currentColors.text,
    },
    emptyDescription: {
      color: currentColors.textSecondary,
    },
    cardItem: {
      backgroundColor: currentColors.card,
    },
    cardName: {
      color: currentColors.text,
    },
    cardNumber: {
      color: currentColors.textSecondary,
    },
    cardType: {
      color: currentColors.text,
    },
    cardExpiry: {
      color: currentColors.textSecondary,
    },
    addNewCardButton: {
      backgroundColor: currentColors.surface,
    },
    addNewCardText: {
      color: currentColors.text,
    },
  };
}; 