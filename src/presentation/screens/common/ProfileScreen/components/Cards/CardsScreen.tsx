/**
 * CardsScreen component
 * Main cards management screen for profile
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import { useAuth } from '../../../context/AuthContext';
import { useCards } from '../../../../../shared/hooks/useCards';
import { CardList } from './CardList';
import { AddCardModal } from './AddCardModal';
import { EmptyState } from './EmptyState';
import { CardsScreenStyles as styles } from '../styles/CardsScreen.styles';

interface CardsScreenProps {
  navigation: any;
}

export const CardsScreen: React.FC<CardsScreenProps> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { cards, loading } = useCards();
  
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Determine user role
  const isDriver = user?.role === 'driver';
  
  const getScreenTitle = () => {
    return isDriver ? t('cards.titleForDriver') : t('cards.title');
  };
  
  const getEmptyStateText = () => {
    return isDriver ? t('cards.emptyDescriptionForDriver') : t('cards.emptyDescription');
  };
  
  const getAddCardButtonText = () => {
    return isDriver ? t('cards.addForDriver') : t('cards.add');
  };

  const handleAddCard = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      {cards.length === 0 ? (
        <EmptyState
          title={t('cards.empty')}
          description={getEmptyStateText()}
          buttonText={getAddCardButtonText()}
          onAddCard={handleAddCard}
        />
      ) : (
        <CardList
          cards={cards}
          onAddCard={handleAddCard}
          isDriver={isDriver}
        />
      )}
      
      <AddCardModal
        visible={showAddModal}
        onClose={handleCloseModal}
        isDriver={isDriver}
      />
    </View>
  );
};
