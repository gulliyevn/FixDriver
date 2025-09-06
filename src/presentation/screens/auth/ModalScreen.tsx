import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TERMS_CONTENT } from '../../../shared/constants/terms';
import { PRIVACY_CONTENT } from '../../../shared/constants/privacy';
import { getColors } from '../../../shared/constants/adaptiveConstants';
import { ModalScreenStyles } from './ModalScreen.styles';

interface ModalScreenProps {
  navigation?: any;
  route?: {
    params?: {
      type: 'terms' | 'privacy';
      role?: 'client' | 'driver';
    };
  };
}

const ModalScreen: React.FC<ModalScreenProps> = ({ navigation, route }) => {
  const styles = ModalScreenStyles;
  const colors = getColors(false); // Light theme for now
  const type = route?.params?.type || 'terms';

  const handleBack = () => {
    const role = route?.params?.role;
    if (role && !(navigation as any)?.canGoBack?.()) {
      navigation.navigate('Register', { role });
    } else if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  const getContent = () => {
    switch (type) {
      case 'terms':
        return TERMS_CONTENT;
      case 'privacy':
        return PRIVACY_CONTENT;
      default:
        return TERMS_CONTENT;
    }
  };

  const content = getContent();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={28} color="#64748B" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.title}>{content.title}</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          {content.sections.map((section, index) => (
            <View key={index}>
              <Text style={styles.sectionTitle}>
                {section.title}
              </Text>
              <Text style={styles.text}>
                {section.content}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default ModalScreen;
