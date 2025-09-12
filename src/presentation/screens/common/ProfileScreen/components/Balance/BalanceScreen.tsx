/**
 * BalanceScreen component
 * Main balance screen with card and actions
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { useAuth } from '../../../../context/AuthContext';
import { usePackage } from '../../../../context/PackageContext';
import { lightColors, darkColors } from '../../../../../shared/constants/colors';
import { BalanceCard } from './BalanceCard';
import { BalanceActions } from './BalanceActions';
import { TopUpModal } from './TopUpModal';
import { QuickTopUpModal } from './QuickTopUpModal';
import { BalanceHistory } from './BalanceHistory';
import { BalanceScreenStyles as styles } from '../../styles/BalanceScreen.styles';

interface BalanceScreenProps {
  navigation: {
    goBack: () => void;
  };
}

export const BalanceScreen: React.FC<BalanceScreenProps> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { currentPackage } = usePackage();
  const currentColors = isDark ? darkColors : lightColors;
  
  const isDriver = user?.role === 'driver';
  const screenWidth = Dimensions.get('window').width;
  
  const [topUpModalVisible, setTopUpModalVisible] = useState(false);
  const [quickTopUpModalVisible, setQuickTopUpModalVisible] = useState(false);
  
  const handleTopUp = () => {
    setTopUpModalVisible(true);
  };
  
  const handleQuickTopUp = () => {
    setQuickTopUpModalVisible(true);
  };
  
  const getScreenTitle = () => {
    return t('balance.title');
  };
  
  const getPackageIcon = () => {
    // TODO: Implement package icon logic
    return 'star';
  };
  
  const getPackageColor = () => {
    // TODO: Implement package color logic
    return currentColors.primary;
  };

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <View style={[styles.header, { backgroundColor: currentColors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={currentColors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: currentColors.text }]}>
          {getScreenTitle()}
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleQuickTopUp}>
            <Ionicons 
              name="flash" 
              size={24} 
              color={currentColors.primary}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
          <Ionicons 
            name={getPackageIcon() as any}
            size={24} 
            color={getPackageColor()}
          />
        </View>
      </View>
      
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <BalanceCard 
          isDriver={isDriver}
          screenWidth={screenWidth}
          currentPackage={currentPackage}
        />
        
        <BalanceActions 
          isDriver={isDriver}
          onTopUp={handleTopUp}
        />
        
        <BalanceHistory maxItems={5} />
      </ScrollView>
      
      <TopUpModal
        visible={topUpModalVisible}
        onClose={() => setTopUpModalVisible(false)}
        isDriver={isDriver}
      />
      
      <QuickTopUpModal
        visible={quickTopUpModalVisible}
        onClose={() => setQuickTopUpModalVisible(false)}
        onSelectAmount={(amount) => {
          setQuickTopUpModalVisible(false);
          setTopUpModalVisible(true);
        }}
      />
    </View>
  );
};
