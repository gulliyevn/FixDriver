import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  FlatList, 
  TextInput,
  ViewStyle,
  TextStyle 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
}

interface SelectProps {
  options: SelectOption[];
  value?: string | number;
  onSelect: (option: SelectOption) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  searchable?: boolean;
  multiSelect?: boolean;
  containerStyle?: ViewStyle;
  selectStyle?: ViewStyle;
  optionStyle?: ViewStyle;
  textStyle?: TextStyle;
  required?: boolean;
  compact?: boolean; // Для маленьких списков
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onSelect,
  placeholder = 'Выберите опцию',
  label,
  error,
  disabled = false,
  searchable = false,
  multiSelect = false,
  containerStyle,
  selectStyle,
  optionStyle,
  textStyle,
  required = false,
  compact = false,
}) => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedValues, setSelectedValues] = useState<(string | number)[]>(
    multiSelect ? (Array.isArray(value) ? value : []) : []
  );

  const selectedOption = options.find(option => option.value === value);
  
  const filteredOptions = searchable 
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;

    if (multiSelect) {
      const newSelected = selectedValues.includes(option.value)
        ? selectedValues.filter(val => val !== option.value)
        : [...selectedValues, option.value];
      
      setSelectedValues(newSelected);
      onSelect(option);
    } else {
      onSelect(option);
      setIsOpen(false);
    }
  };

  const getDisplayText = () => {
    if (multiSelect) {
      if (selectedValues.length === 0) return placeholder;
      if (selectedValues.length === 1) {
        const option = options.find(opt => opt.value === selectedValues[0]);
        return option?.label || placeholder;
      }
      return `Выбрано: ${selectedValues.length}`;
    }
    
    return selectedOption?.label || placeholder;
  };

  const getSelectStyle = (): ViewStyle => ({
    ...styles.select,
    borderColor: error 
      ? '#DC2626' 
      : isOpen 
        ? '#1E3A8A' 
        : isDark 
          ? '#374151' 
          : '#D1D5DB',
    backgroundColor: disabled 
      ? isDark ? '#111827' : '#F9FAFB'
      : isDark ? '#1F2937' : '#FFFFFF',
    opacity: disabled ? 0.6 : 1,
  });

  const getTextStyle = (): TextStyle => ({
    ...styles.selectText,
    color: selectedOption || selectedValues.length > 0
      ? isDark ? '#F9FAFB' : '#1F2937'
      : isDark ? '#9CA3AF' : '#6B7280',
  });

  const renderOption = ({ item }: { item: SelectOption }) => {
    const isSelected = multiSelect 
      ? selectedValues.includes(item.value)
      : item.value === value;

    return (
      <TouchableOpacity
        style={[
          styles.option,
          compact && styles.optionCompact,
          optionStyle,
          { 
            backgroundColor: isSelected 
              ? '#1E3A8A' 
              : (compact && item.icon) 
                ? isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(249, 250, 251, 0.8)'
                : isDark ? '#1F2937' : '#FFFFFF',
            opacity: item.disabled ? 0.5 : 1,
          }
        ]}
        onPress={() => handleSelect(item)}
        disabled={item.disabled}
      >
        <View style={styles.optionContent}>
          {item.icon && (
            <Ionicons
              name={item.icon}
              size={compact ? 24 : 20}
              color={isSelected ? '#FFFFFF' : isDark ? '#F9FAFB' : '#1F2937'}
              style={[styles.optionIcon, compact && styles.optionIconCompact]}
            />
          )}
          <Text style={[
            styles.optionText,
            { 
              color: isSelected 
                ? '#FFFFFF' 
                : isDark ? '#F9FAFB' : '#1F2937' 
            }
          ]}>
            {item.label}
          </Text>
        </View>
        
        {multiSelect && isSelected && (
          <Ionicons name="checkmark" size={20} color="#FFFFFF" />
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
      
      <TouchableOpacity
        style={[getSelectStyle(), selectStyle]}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
      >
        <Text style={[getTextStyle(), textStyle]}>
          {getDisplayText()}
        </Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={isDark ? '#9CA3AF' : '#6B7280'}
        />
      </TouchableOpacity>

      {error && (
        <Text style={styles.error}>{error}</Text>
      )}

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        presentationStyle="overFullScreen"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setIsOpen(false)}
        >
          <View style={[
            styles.dropdown,
            compact || options.length <= 5 ? styles.dropdownCompact : {},
            { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }
          ]}>
            {searchable && (
              <View style={styles.searchContainer}>
                <TextInput
                  style={[
                    styles.searchInput,
                    { 
                      backgroundColor: isDark ? '#111827' : '#F9FAFB',
                      color: isDark ? '#F9FAFB' : '#1F2937',
                    }
                  ]}
                  placeholder="Поиск..."
                  placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            )}
            
            <FlatList
              data={filteredOptions}
              renderItem={renderOption}
              keyExtractor={(item) => item.value.toString()}
              style={[
                styles.optionsList,
                compact || options.length <= 5 ? styles.optionsListCompact : {}
              ]}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  select: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  selectText: {
    fontSize: 16,
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  required: {
    color: '#DC2626',
  },
  error: {
    fontSize: 12,
    color: '#DC2626',
    marginTop: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 80,
    zIndex: 3000,
    elevation: 3000,
  },
  dropdown: {
    width: '100%',
    height: '90%',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 3005,
    zIndex: 3001,
  },
  dropdownCompact: {
    height: 'auto',
    maxHeight: 300,
    borderRadius: 16,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 231, 235, 0.3)',
  },
  searchInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(229, 231, 235, 0.5)',
  },
  optionsList: {
    flex: 1,
    paddingHorizontal: 8,
  },
  optionsListCompact: {
    flex: 0,
    paddingVertical: 8,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: 12,
    borderBottomWidth: 0,
  },
  optionCompact: {
    paddingVertical: 18,
    marginVertical: 4,
    marginHorizontal: 12,
    borderRadius: 16,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    marginRight: 12,
  },
  optionIconCompact: {
    marginRight: 16,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
});

export default Select;
