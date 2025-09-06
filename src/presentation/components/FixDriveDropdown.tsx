import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { FixDriveDropdownStyles as styles, getFixDriveDropdownColors } from '../styles/components/FixDriveDropdown.styles';

interface DropdownOption {
  key: string;
  label: string;
  value: string;
}

interface FixDriveDropdownProps {
  label: string;
  placeholder: string;
  options: DropdownOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
}

const FixDriveDropdown: React.FC<FixDriveDropdownProps> = ({
  label,
  placeholder,
  options,
  selectedValue,
  onSelect,
}) => {
  const { isDark } = useTheme();
  const dynamicStyles = getFixDriveDropdownColors(isDark);
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === selectedValue);

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <View style={styles.dropdownContainer}>
      <Text style={[styles.dropdownLabel, dynamicStyles.dropdownLabel]}>
        {label}
      </Text>
      
      <TouchableOpacity
        style={[styles.dropdownButton, dynamicStyles.dropdownButton]}
        onPress={toggleDropdown}
      >
        <Text style={[
          selectedOption 
            ? styles.dropdownButtonText 
            : styles.dropdownButtonPlaceholder,
          selectedOption 
            ? dynamicStyles.dropdownButtonText 
            : dynamicStyles.dropdownButtonPlaceholder
        ]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Ionicons 
          name={isOpen ? "chevron-up" : "chevron-down"} 
          size={16} 
          color={isDark ? '#9CA3AF' : '#666666'} 
        />
      </TouchableOpacity>
      
      {isOpen && (
        <View style={[styles.dropdownList, dynamicStyles.dropdownList]}>
          <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.dropdownOption, 
                  dynamicStyles.dropdownOption,
                  selectedValue === option.value && styles.dropdownOptionSelected,
                  selectedValue === option.value && dynamicStyles.dropdownOptionSelected,
                  index === options.length - 1 && styles.dropdownOptionLast
                ]}
                onPress={() => handleSelect(option.value)}
              >
                <Text style={[
                  styles.dropdownOptionText, 
                  dynamicStyles.dropdownOptionText,
                  selectedValue === option.value && styles.dropdownOptionTextSelected,
                  selectedValue === option.value && dynamicStyles.dropdownOptionTextSelected
                ]}>
                  {option.label}
                </Text>
                {selectedValue === option.value && (
                  <Ionicons 
                    name="checkmark" 
                    size={16} 
                    color={isDark ? '#3B82F6' : '#083198'} 
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default FixDriveDropdown;
