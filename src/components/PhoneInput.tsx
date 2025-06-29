import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  FlatList,
  ViewStyle,
  TextStyle 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
  format?: string;
}

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

const COUNTRIES: Country[] = [
  { code: 'AZ', name: 'Азербайджан', flag: '🇦🇿', dialCode: '+994', format: '(##) ###-##-##' },
  { code: 'RU', name: 'Россия', flag: '🇷🇺', dialCode: '+7', format: '(###) ###-##-##' },
  { code: 'TR', name: 'Турция', flag: '🇹🇷', dialCode: '+90', format: '(###) ###-##-##' },
  { code: 'GE', name: 'Грузия', flag: '🇬🇪', dialCode: '+995', format: '(###) ###-###' },
  { code: 'KZ', name: 'Казахстан', flag: '🇰🇿', dialCode: '+7', format: '(###) ###-##-##' },
  { code: 'UZ', name: 'Узбекистан', flag: '🇺🇿', dialCode: '+998', format: '(##) ###-##-##' },
  { code: 'KG', name: 'Кыргызстан', flag: '🇰🇬', dialCode: '+996', format: '(###) ###-###' },
  { code: 'TJ', name: 'Таджикистан', flag: '🇹🇯', dialCode: '+992', format: '(##) ###-##-##' },
  { code: 'TM', name: 'Туркменистан', flag: '🇹🇲', dialCode: '+993', format: '(##) ##-##-##' },
  { code: 'BY', name: 'Беларусь', flag: '🇧🇾', dialCode: '+375', format: '(##) ###-##-##' },
  { code: 'UA', name: 'Украина', flag: '🇺🇦', dialCode: '+380', format: '(##) ###-##-##' },
  { code: 'MD', name: 'Молдова', flag: '🇲🇩', dialCode: '+373', format: '(##) ###-###' },
  { code: 'US', name: 'США', flag: '🇺🇸', dialCode: '+1', format: '(###) ###-####' },
  { code: 'CA', name: 'Канада', flag: '🇨🇦', dialCode: '+1', format: '(###) ###-####' },
  { code: 'GB', name: 'Великобритания', flag: '🇬🇧', dialCode: '+44', format: '#### ######' },
  { code: 'DE', name: 'Германия', flag: '🇩🇪', dialCode: '+49', format: '### #######' },
  { code: 'FR', name: 'Франция', flag: '🇫🇷', dialCode: '+33', format: '# ## ## ## ##' },
  { code: 'IT', name: 'Италия', flag: '🇮🇹', dialCode: '+39', format: '### ### ####' },
  { code: 'ES', name: 'Испания', flag: '🇪🇸', dialCode: '+34', format: '### ### ###' },
  { code: 'NL', name: 'Нидерланды', flag: '🇳🇱', dialCode: '+31', format: '# ########' },
  { code: 'AE', name: 'ОАЭ', flag: '🇦🇪', dialCode: '+971', format: '# ### ####' },
  { code: 'SA', name: 'Саудовская Аравия', flag: '🇸🇦', dialCode: '+966', format: '# #### ####' },
  { code: 'IL', name: 'Израиль', flag: '🇮🇱', dialCode: '+972', format: '#-###-####' },
  { code: 'CN', name: 'Китай', flag: '🇨🇳', dialCode: '+86', format: '### #### ####' },
  { code: 'JP', name: 'Япония', flag: '🇯🇵', dialCode: '+81', format: '##-####-####' },
  { code: 'KR', name: 'Южная Корея', flag: '🇰🇷', dialCode: '+82', format: '##-###-####' },
  { code: 'IN', name: 'Индия', flag: '🇮🇳', dialCode: '+91', format: '##### #####' },
  { code: 'AU', name: 'Австралия', flag: '🇦🇺', dialCode: '+61', format: '# #### ####' },
  { code: 'BR', name: 'Бразилия', flag: '🇧🇷', dialCode: '+55', format: '(##) #####-####' },
];

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
    ...styles.container,
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
    ...styles.input,
    color: isDark ? '#F9FAFB' : '#1F2937',
  });

  const renderCountryItem = ({ item }: { item: Country }) => {
    const isSelected = selectedCountry.code === item.code;
    return (
      <TouchableOpacity
        style={[
          styles.countryItem,
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
        <Text style={[styles.flag, { fontSize: 24 }]}>{item.flag}</Text>
        <View style={styles.countryInfo}>
          <Text style={[
            styles.countryName,
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
            styles.dialCode,
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
          <View style={styles.selectedIndicator}>
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
          styles.label,
          { color: error ? '#DC2626' : isDark ? '#F9FAFB' : '#374151' }
        ]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      
      <View style={getContainerStyle()}>
        <TouchableOpacity
          style={styles.countrySelector}
          onPress={() => !disabled && setIsCountryModalOpen(true)}
          disabled={disabled}
        >
          <Text style={styles.flag}>{selectedCountry.flag}</Text>
          <Text style={[
            styles.dialCode,
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
        
        <View style={styles.separator} />
        
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
          <View style={styles.validationIcon}>
            <Ionicons
              name={isValid ? 'checkmark-circle' : 'close-circle'}
              size={20}
              color={isValid ? '#059669' : '#DC2626'}
            />
          </View>
        )}
      </View>

      {error && (
        <Text style={styles.error}>{error}</Text>
      )}

      <Modal
        visible={isCountryModalOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsCountryModalOpen(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsCountryModalOpen(false)}
        >
          <View
            style={[
              styles.modalContent,
              { 
                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
              }
            ]}
          >
            {/* Индикатор тянущей полоски */}
            <TouchableOpacity style={styles.modalHandle} activeOpacity={0.7}>
              <View style={[
                styles.handleBar,
                { backgroundColor: isDark ? '#4B5563' : '#D1D5DB' }
              ]} />
            </TouchableOpacity>

            <View style={[
              styles.modalHeader,
              { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }
            ]}>
              <Text style={[
                styles.modalTitle,
                { color: isDark ? '#F9FAFB' : '#1F2937' }
              ]}>
                Выберите страну
              </Text>
              <TouchableOpacity
                onPress={() => setIsCountryModalOpen(false)}
                style={[
                  styles.closeButton,
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
                styles.countriesList,
                { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }
              ]}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.84,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  required: {
    color: '#DC2626',
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  flag: {
    fontSize: 20,
    marginRight: 8,
  },
  dialCode: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 4,
  },
  separator: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    paddingRight: 12,
  },
  validationIcon: {
    paddingHorizontal: 12,
  },
  error: {
    fontSize: 12,
    color: '#DC2626',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '90%',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 10,
  },
  modalHandle: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 231, 235, 0.2)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
    borderRadius: 16,
  },
  countriesList: {
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 3,
    borderRadius: 14,
    borderBottomWidth: 0,
  },
  countryInfo: {
    flex: 1,
    marginLeft: 12,
  },
  countryName: {
    fontSize: 16,
    fontWeight: '500',
  },
  selectedIndicator: {
    marginLeft: 'auto',
  },
});

export default PhoneInput;
