import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { generateLevelModalContent } from '../utils/levelUtils';

interface LevelModalProps {
  visible: boolean;
  styles: any;
  levelTranslations: any;
  t: (key: string) => string;
  onClose: () => void;
}

const LevelModal: React.FC<LevelModalProps> = ({
  visible,
  styles,
  levelTranslations,
  t,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { maxHeight: '80%', width: '90%', minHeight: 500 }]}>
          <Text style={[styles.modalTitle, { textAlign: 'left' }]}>{levelTranslations.title}</Text>
          <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'left', marginBottom: 15 }}>
            {levelTranslations.description}
          </Text>
          <ScrollView style={{ flex: 1, marginVertical: 10 }}>
            <Text style={[styles.modalMessage, { textAlign: 'left' }]}>
              {generateLevelModalContent(t, levelTranslations)}
            </Text>
          </ScrollView>
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.modalButtonCancel} 
              onPress={onClose}
            >
              <Text style={styles.modalButtonCancelText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LevelModal;
