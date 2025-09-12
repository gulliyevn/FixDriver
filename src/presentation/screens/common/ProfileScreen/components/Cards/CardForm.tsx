/**
 * CardForm component
 * Form for adding new cards with validation
 */

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import { useCards } from '../../../../../shared/hooks/useCards';
import { useCardValidation } from '../hooks/useCardValidation';
import { useCardFormatting } from '../hooks/useCardFormatting';
import { CardsScreenStyles as styles } from '../styles/CardsScreen.styles';
import { lightColors, darkColors } from '../../../../../shared/constants/colors';

interface CardFormProps {
  isDriver: boolean;
  onSave: () => void;
  onCancel: () => void;
}

interface CardData {
  holderName: string;
  number: string;
  expiry: string;
  cvv: string;
  type: 'visa' | 'mastercard';
}

export const CardForm: React.FC<CardFormProps> = ({ isDriver, onSave, onCancel }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { addCard } = useCards();
  const currentColors = isDark ? darkColors : lightColors;
  
  const [cardData, setCardData] = useState<CardData>({
    holderName: '',
    number: '',
    expiry: '',
    cvv: '',
    type: 'visa'
  });
  
  const [errors, setErrors] = useState({
    holderName: '',
    number: '',
    expiry: '',
    cvv: ''
  });
  
  const { validateCard } = useCardValidation();
  const { formatCardNumber, formatExpiry } = useCardFormatting();

  const handleCardNumberChange = (text: string) => {
    const formatted = formatCardNumber(text);
    const cardType = getCardType(formatted);
    
    setCardData(prev => ({ 
      ...prev, 
      number: formatted, 
      type: cardType 
    }));
  };

  const handleExpiryChange = (text: string) => {
    const formatted = formatExpiry(text);
    setCardData(prev => ({ ...prev, expiry: formatted }));
  };

  const handleCvvChange = (text: string) => {
    const digitsOnly = text.replace(/[^0-9]/g, '');
    setCardData(prev => ({ ...prev, cvv: digitsOnly }));
  };

  const getCardType = (number: string): 'visa' | 'mastercard' => {
    const digits = number.replace(/\D/g, '');
    if (digits.startsWith('4')) return 'visa';
    if (digits.startsWith('5')) return 'mastercard';
    if (digits.startsWith('34') || digits.startsWith('37')) return 'visa';
    if (digits.startsWith('6')) return 'mastercard';
    return 'visa';
  };

  const handleScanCard = () => {
    Alert.alert(
      t('cards.scanner'),
      t('cards.scannerDescription'),
      [{ text: 'OK' }]
    );
  };

  const handleSave = async () => {
    const validationErrors = validateCard(cardData);
    setErrors(validationErrors);
    
    if (Object.values(validationErrors).some(error => error)) {
      return;
    }
    
    try {
      const newCard = {
        id: Date.now().toString(),
        name: cardData.holderName,
        holderName: cardData.holderName,
        lastFour: cardData.number.slice(-4),
        type: cardData.type,
        expiry: cardData.expiry,
        isDefault: false
      };
      
      await addCard(newCard);
      onSave();
    } catch (error) {
      Alert.alert(t('cards.error'), t('cards.addError'));
    }
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: currentColors.text }]}>
          {t('cards.holderName')}
        </Text>
        <TextInput
          placeholder={t('cards.holderPlaceholder')}
          placeholderTextColor={currentColors.textSecondary}
          value={cardData.holderName}
          onChangeText={(text) => setCardData(prev => ({ ...prev, holderName: text }))}
          style={[styles.input, { 
            backgroundColor: currentColors.surface,
            color: currentColors.text,
            borderColor: errors.holderName ? currentColors.error : currentColors.border
          }]}
        />
        {errors.holderName ? (
          <Text style={[styles.errorText, { color: currentColors.error }]}>
            {errors.holderName}
          </Text>
        ) : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: currentColors.text }]}>
          {t('cards.cardNumber')}
        </Text>
        <View style={styles.inputWithIcon}>
          <TextInput
            placeholder={t('cards.numberPlaceholder')}
            placeholderTextColor={currentColors.textSecondary}
            value={cardData.number}
            onChangeText={handleCardNumberChange}
            style={[styles.input, { 
              backgroundColor: currentColors.surface,
              color: currentColors.text,
              borderColor: errors.number ? currentColors.error : currentColors.border
            }]}
            keyboardType="numeric"
            maxLength={19}
          />
          <TouchableOpacity onPress={handleScanCard} style={styles.scanButton}>
            <Ionicons name="scan-outline" size={20} color={currentColors.primary} />
          </TouchableOpacity>
        </View>
        {errors.number ? (
          <Text style={[styles.errorText, { color: currentColors.error }]}>
            {errors.number}
          </Text>
        ) : null}
      </View>

      <View style={styles.inputRow}>
        <View style={[styles.inputGroup, styles.inputFlex]}>
          <Text style={[styles.inputLabel, { color: currentColors.text }]}>
            {t('cards.expiry')}
          </Text>
          <TextInput
            placeholder={t('cards.expiryPlaceholder')}
            placeholderTextColor={currentColors.textSecondary}
            value={cardData.expiry}
            onChangeText={handleExpiryChange}
            style={[styles.input, { 
              backgroundColor: currentColors.surface,
              color: currentColors.text,
              borderColor: errors.expiry ? currentColors.error : currentColors.border
            }]}
            keyboardType="numeric"
            maxLength={5}
          />
          {errors.expiry ? (
            <Text style={[styles.errorText, { color: currentColors.error }]}>
              {errors.expiry}
            </Text>
          ) : null}
        </View>

        <View style={[styles.inputGroup, styles.inputFlex]}>
          <Text style={[styles.inputLabel, { color: currentColors.text }]}>
            {t('cards.cvv')}
          </Text>
          <TextInput
            placeholder={t('cards.cvvPlaceholder')}
            placeholderTextColor={currentColors.textSecondary}
            value={cardData.cvv}
            onChangeText={handleCvvChange}
            style={[styles.input, { 
              backgroundColor: currentColors.surface,
              color: currentColors.text,
              borderColor: errors.cvv ? currentColors.error : currentColors.border
            }]}
            maxLength={4}
            keyboardType="number-pad"
            secureTextEntry
          />
          {errors.cvv ? (
            <Text style={[styles.errorText, { color: currentColors.error }]}>
              {errors.cvv}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.formFooter}>
        <TouchableOpacity 
          onPress={onCancel} 
          style={[styles.cancelButton, { backgroundColor: currentColors.surface }]}
        >
          <Text style={[styles.cancelButtonText, { color: currentColors.text }]}>
            {t('cards.cancel')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={handleSave}
          style={[styles.saveButton, { backgroundColor: currentColors.primary }]}
        >
          <Text style={styles.saveButtonText}>
            {t('cards.save')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
