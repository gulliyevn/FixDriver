import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getCurrentColors } from '../constants/colors';

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({
  visible,
  onClose,
}) => {
  const { isDark } = useTheme();
  const colors = getCurrentColors(isDark);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: 20, 
          borderBottomWidth: 1, 
          borderBottomColor: colors.border 
        }}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>
            Уведомления
          </Text>
          <TouchableOpacity>
            <Ionicons name="checkmark-circle-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons 
            name="notifications-outline" 
            size={64} 
            color={colors.textSecondary} 
            style={{ marginBottom: 16 }}
          />
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 8 }}>
            Нет новых уведомлений
          </Text>
          <Text style={{ fontSize: 16, color: colors.textSecondary, textAlign: 'center' }}>
            Здесь будут отображаться ваши уведомления
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default NotificationsModal;
