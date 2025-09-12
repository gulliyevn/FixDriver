/**
 * SettingsScreen component
 * Main settings screen for profile management
 */

import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { useAuth } from '../../../../context/AuthContext';
import { NotificationSettings } from './NotificationSettings';
import { LanguageSettings } from './LanguageSettings';
import { AppearanceSettings } from './AppearanceSettings';
import { LocationSettings } from './LocationSettings';
import { SecuritySettings } from './SecuritySettings';
import { DataSettings } from './DataSettings';
import { SettingsScreenStyles as styles } from '../styles/SettingsScreen.styles';

interface SettingsScreenProps {
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();
  
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  
  const isDriver = user?.role === 'driver';

  const getScreenTitle = () => {
    return isDriver ? t('settings.titleForDriver') : t('settings.title');
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <NotificationSettings />
        
        <LanguageSettings 
          onLanguageChange={() => setLanguageModalVisible(true)}
        />
        
        <AppearanceSettings />
        
        <LocationSettings />
        
        <SecuritySettings navigation={navigation} />
        
        <DataSettings navigation={navigation} isDriver={isDriver} />
      </ScrollView>
    </View>
  );
};
