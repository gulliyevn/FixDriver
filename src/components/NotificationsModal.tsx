import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({
  visible,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: 20, 
          borderBottomWidth: 1, 
          borderBottomColor: '#E5E7EB' 
        }}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827' }}>
            Уведомления
          </Text>
          <TouchableOpacity>
            <Ionicons name="checkmark-circle-outline" size={24} color="#111827" />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: '#6B7280' }}>
            Содержимое уведомлений будет здесь
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default NotificationsModal;
