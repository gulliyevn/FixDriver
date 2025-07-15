import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Address, addressCategoryOptions } from '../mocks/residenceMock';
import { AddressModalStyles as styles } from '../styles/components/AddressModal.styles';
import Select from './Select';

interface AddressModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (address: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>) => void;
  address?: Address | null;
  mode: 'add' | 'edit';
}

const AddressModal: React.FC<AddressModalProps> = ({ 
  visible = false, 
  onClose, 
  onSave, 
  address = null, 
  mode = 'add' 
}) => {
  const [title, setTitle] = useState('');
  const [addressText, setAddressText] = useState('');
  const [category, setCategory] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    if (address && mode === 'edit') {
      setTitle(address.title);
      setAddressText(address.address);
      setCategory(address.category || '');
      setIsDefault(address.isDefault);
    } else {
      setTitle('');
      setAddressText('');
      setCategory('');
      setIsDefault(false);
    }
  }, [address, mode, visible]);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Ошибка', 'Введите название адреса');
      return;
    }
    if (!addressText.trim()) {
      Alert.alert('Ошибка', 'Введите адрес');
      return;
    }

    try {
      onSave({
        title: title.trim(),
        address: addressText.trim(),
        category: category.trim(),
        isDefault
      });
      onClose();
    } catch (error) {
      console.error('Error in handleSave:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить адрес');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        style={{ flex: 1, backgroundColor: '#fff' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#003366" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {mode === 'add' ? 'Добавить адрес' : 'Редактировать адрес'}
          </Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>
              Сохранить
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Название
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Например: Дом, Работа"
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
              maxLength={50}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Категория
            </Text>
            <Select
              options={addressCategoryOptions}
              value={category}
              onSelect={(option) => setCategory(option.value as string)}
              placeholder="Выберите категорию"
              compact={true}
              searchable={true}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Адрес
            </Text>
            <TextInput
              style={styles.multilineInput}
              placeholder="Введите полный адрес"
              placeholderTextColor="#999"
              value={addressText}
              onChangeText={setAddressText}
              multiline
              maxLength={200}
            />
          </View>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setIsDefault(!isDefault)}
          >
            <Ionicons 
              name={isDefault ? 'checkmark-circle' : 'ellipse-outline'} 
              size={24} 
              color={isDefault ? '#4caf50' : '#ccc'} 
            />
            <Text style={styles.checkboxText}>
              Установить как адрес по умолчанию
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddressModal; 