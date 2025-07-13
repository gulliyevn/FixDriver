import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RulesModalStyles as styles } from '../styles/components/RulesModal.styles';
import { useI18n } from '../hooks/useI18n';

interface RulesModalProps {
  visible: boolean;
  onClose: () => void;
}

const sectionCount = 10; // Максимальное количество разделов (поддержи нужное число)

const RulesModal: React.FC<RulesModalProps> = ({ visible, onClose }) => {
  const { t } = useI18n();

  // Собираем разделы динамически
  const sections = [];
  for (let i = 1; i <= sectionCount; i++) {
    const title = t(`rules.sections.${i}.title`);
    const text = t(`rules.sections.${i}.text`);
    if (!title || title === `rules.sections.${i}.title`) break;
    sections.push({ title, text });
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity 
            onPress={onClose} 
            style={styles.modalCloseButton}
          >
            <Ionicons name="close" size={24} color="#003366" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{t('rules.title')}</Text>
          <View style={styles.placeholder} />
        </View>
        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {sections.map((section, idx) => (
            <View style={styles.rulesSection} key={idx}>
              <Text style={styles.rulesTitle}>{section.title}</Text>
              <Text style={styles.rulesText}>{section.text}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default RulesModal;