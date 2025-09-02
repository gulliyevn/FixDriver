import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  t: (k: string) => string;
  styles: any;
  onBack: () => void;
}

const Header: React.FC<HeaderProps> = ({ t, styles, onBack }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="chevron-back" size={24} color="#1E293B" />
      </TouchableOpacity>

      <View style={styles.headerContent}>
        <Text style={styles.title}>{t('auth.register.title')}</Text>
      </View>
    </View>
  );
};

export default Header;


