import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  FlatList, 
  TextInput,
  ViewStyle,
  TextStyle 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { SelectStyles } from '../styles/components/Select.styles';

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
    ...SelectStyles.select,
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
    ...SelectStyles.selectText,
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
          SelectStyles.option,
          compact && SelectStyles.optionCompact,
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
        <View style={SelectStyles.optionContent}>
          {item.icon && (
            <Ionicons
              name={item.icon}
              size={compact ? 24 : 20}
              color={isSelected ? '#FFFFFF' : isDark ? '#F9FAFB' : '#1F2937'}
              style={[SelectStyles.optionIcon, compact && SelectStyles.optionIconCompact]}
            />
          )}
          <Text style={[
            SelectStyles.optionText,
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
          SelectStyles.label,
          { color: error ? '#DC2626' : isDark ? '#F9FAFB' : '#374151' }
        ]}>
          {label}
          {required && <Text style={SelectStyles.required}> *</Text>}
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
        <Text style={SelectStyles.error}>{error}</Text>
      )}

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        presentationStyle="overFullScreen"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={SelectStyles.overlay}
          onPress={() => setIsOpen(false)}
        >
          <View style={[
            SelectStyles.dropdown,
            compact || options.length <= 5 ? SelectStyles.dropdownCompact : {},
            { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }
          ]}>
            {searchable && (
              <View style={SelectStyles.searchContainer}>
                <TextInput
                  style={[
                    SelectStyles.searchInput,
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
                SelectStyles.optionsList,
                compact || options.length <= 5 ? SelectStyles.optionsListCompact : {}
              ]}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Select;
