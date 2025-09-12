/**
 * TripsScreen component
 * Main component for displaying trip history
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';
import { useAuth } from '../../../../context/AuthContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { TripsList } from './TripsList';
import { EmptyState } from './EmptyState';
import { useTrips } from '../../hooks/useTrips';
import { useTripsFilter } from '../../hooks/useTripsFilter';
import { TripsScreenStyles as styles } from '../../styles/TripsScreen.styles';
import { lightColors, darkColors } from '../../../../../../shared/constants/colors';

interface TripsScreenProps {
  navigation: any;
}

export const TripsScreen: React.FC<TripsScreenProps> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : lightColors;
  
  const [filterVisible, setFilterVisible] = useState(false);
  
  const { trips, loading, error } = useTrips();
  const { 
    filteredTrips, 
    currentFilter, 
    setCurrentFilter 
  } = useTripsFilter(trips);
  
  // Determine user role
  const isDriver = user?.role === 'driver';
  
  const getScreenTitle = () => {
    return isDriver ? t('trips.titleForDriver') : t('trips.title');
  };

  const renderContent = () => {
    if (loading) {
      return <EmptyState type="loading" />;
    }
    
    if (error) {
      return <EmptyState type="error" onRetry={() => {}} />;
    }
    
    if (filteredTrips.length === 0) {
      return (
        <EmptyState 
          type="empty" 
          isDriver={isDriver}
        />
      );
    }
    
    return (
      <TripsList 
        trips={filteredTrips}
        isDriver={isDriver}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: currentColors.surface }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={currentColors.primary} />
        </TouchableOpacity>
        
        <Text style={[styles.title, { color: currentColors.text }]}>
          {getScreenTitle()}
        </Text>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setFilterVisible(true)}
        >
          <Ionicons name="filter" size={24} color={currentColors.primary} />
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      {renderContent()}
    </View>
  );
};
