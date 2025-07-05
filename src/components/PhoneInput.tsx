import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Modal, 
  FlatList,
  ViewStyle,
  TextStyle 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { PhoneInputStyles } from '../styles/components/PhoneInput.styles';
import { Country, COUNTRIES } from '../utils/countries';

interface PhoneInputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  onChangeCountry?: (country: Country) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  defaultCountry?: string;
  autoFormat?: boolean;
}



const PhoneInput: React.FC<PhoneInputProps> = ({
  value = '',
  onChangeText,
  onChangeCountry,
  placeholder = 'Введите номер телефона',
  label,
  error,
  disabled = false,
  required = false,
  containerStyle,
  inputStyle,
  defaultCountry = 'AZ',
  autoFormat = true,
}) => {
  const { isDark } = useTheme();
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    COUNTRIES.find(c => c.code === defaultCountry) || COUNTRIES[0]
  );
  const [isFocused, setIsFocused] = useState(false);

  const formatPhoneNumber = (text: string, format?: string): string => {
    if (!autoFormat || !format) return text;
    
    const digits = text.replace(/\D/g, '');
    let formatted = '';
    let digitIndex = 0;
    
    for (let i = 0; i < format.length && digitIndex < digits.length; i++) {
      if (format[i] === '#') {
        formatted += digits[digitIndex];
        digitIndex++;
      } else {
        formatted += format[i];
      }
    }
    
    return formatted;
  };

  const handleTextChange = (text: string) => {
    const cleanText = text.replace(/\D/g, '');
    const formattedText = formatPhoneNumber(cleanText, selectedCountry.format);
    onChangeText?.(formattedText);
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsCountryModalOpen(false);
    onChangeCountry?.(country);
    
    // Если номер уже введен, переформатируем его под новую страну
    if (value) {
      const cleanText = value.replace(/\D/g, '');
      const formattedText = formatPhoneNumber(cleanText, country.format);
      onChangeText?.(formattedText);
    }
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const digits = phone.replace(/\D/g, '');
    // Базовая валидация - от 7 до 15 цифр
    return digits.length >= 7 && digits.length <= 15;
  };

  const isValid = validatePhoneNumber(value);

  const getContainerStyle = (): ViewStyle => ({
    ...PhoneInputStyles.container,
    borderColor: error 
      ? '#DC2626' 
      : isFocused 
        ? '#1E3A8A' 
        : isDark 
          ? '#374151' 
          : '#D1D5DB',
    backgroundColor: disabled 
      ? isDark ? '#111827' : '#F9FAFB'
      : isDark ? '#1F2937' : '#FFFFFF',
    opacity: disabled ? 0.6 : 1,
  });

  const getInputStyle = (): TextStyle => ({
    ...PhoneInputStyles.input,
    color: isDark ? '#F9FAFB' : '#1F2937',
  });

  const renderCountryItem = ({ item }: { item: Country }) => {
    const isSelected = selectedCountry.code === item.code;
    return (
      <TouchableOpacity
        style={[
          PhoneInputStyles.countryItem,
          { 
            backgroundColor: isSelected 
              ? '#1E3A8A' 
              : isDark 
                ? 'rgba(55, 65, 81, 0.3)' 
                : 'rgba(249, 250, 251, 0.8)',
          }
        ]}
        onPress={() => handleCountrySelect(item)}
      >
        <Text style={[PhoneInputStyles.flag, { fontSize: 24 }]}>{item.flag}</Text>
        <View style={PhoneInputStyles.countryInfo}>
          <Text style={[
            PhoneInputStyles.countryName,
            { 
              color: isSelected 
                ? '#FFFFFF' 
                : isDark 
                  ? '#F9FAFB' 
                  : '#1F2937',
              fontWeight: isSelected ? '600' : '500'
            }
          ]}>
            {item.name}
          </Text>
          <Text style={[
            PhoneInputStyles.dialCode,
            { 
              color: isSelected 
                ? 'rgba(255, 255, 255, 0.8)' 
                : isDark 
                  ? '#9CA3AF' 
                  : '#6B7280' 
            }
          ]}>
            {item.dialCode}
          </Text>
        </View>
        {isSelected && (
          <View style={PhoneInputStyles.selectedIndicator}>
            <Ionicons name="checkmark-circle-outline" size={22} color="#FFFFFF" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={containerStyle}>
      {label && (
        <Text style={[
          PhoneInputStyles.label,
          { color: error ? '#DC2626' : isDark ? '#F9FAFB' : '#374151' }
        ]}>
          {label}
          {required && <Text style={PhoneInputStyles.required}> *</Text>}
        </Text>
      )}
      
      <View style={getContainerStyle()}>
        <TouchableOpacity
          style={PhoneInputStyles.countrySelector}
          onPress={() => !disabled && setIsCountryModalOpen(true)}
          disabled={disabled}
        >
          <Text style={PhoneInputStyles.flag}>{selectedCountry.flag}</Text>
          <Text style={[
            PhoneInputStyles.dialCode,
            { color: isDark ? '#F9FAFB' : '#1F2937' }
          ]}>
            {selectedCountry.dialCode}
          </Text>
          <Ionicons 
            name="chevron-down" 
            size={16} 
            color={isDark ? '#9CA3AF' : '#6B7280'} 
          />
        </TouchableOpacity>
        
        <View style={PhoneInputStyles.separator} />
        
        <TextInput
          style={[getInputStyle(), inputStyle]}
          value={value}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
          keyboardType="phone-pad"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!disabled}
          maxLength={20}
        />
        
        {value && (
          <View style={PhoneInputStyles.validationIcon}>
            <Ionicons
              name={isValid ? 'checkmark-circle' : 'close-circle'}
              size={20}
              color={isValid ? '#059669' : '#DC2626'}
            />
          </View>
        )}
      </View>

      {error && (
        <Text style={PhoneInputStyles.error}>{error}</Text>
      )}

      <Modal
        visible={isCountryModalOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsCountryModalOpen(false)}
      >
        <TouchableOpacity 
          style={PhoneInputStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsCountryModalOpen(false)}
        >
          <View
            style={[
              PhoneInputStyles.modalContent,
              { 
                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
              }
            ]}
          >
            {/* Индикатор тянущей полоски */}
            <TouchableOpacity style={PhoneInputStyles.modalHandle} activeOpacity={0.7}>
              <View style={[
                PhoneInputStyles.handleBar,
                { backgroundColor: isDark ? '#4B5563' : '#D1D5DB' }
              ]} />
            </TouchableOpacity>

            <View style={[
              PhoneInputStyles.modalHeader,
              { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }
            ]}>
              <Text style={[
                PhoneInputStyles.modalTitle,
                { color: isDark ? '#F9FAFB' : '#1F2937' }
              ]}>
                Выберите страну
              </Text>
              <TouchableOpacity
                onPress={() => setIsCountryModalOpen(false)}
                style={[
                  PhoneInputStyles.closeButton,
                  { backgroundColor: isDark ? '#374151' : '#F3F4F6' }
                ]}
              >
                <Ionicons 
                  name="close" 
                  size={20} 
                  color={isDark ? '#F9FAFB' : '#1F2937'} 
                />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={COUNTRIES}
              renderItem={renderCountryItem}
              keyExtractor={(item) => item.code}
              showsVerticalScrollIndicator={false}
              style={[
                PhoneInputStyles.countriesList,
                { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }
              ]}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default PhoneInput;
