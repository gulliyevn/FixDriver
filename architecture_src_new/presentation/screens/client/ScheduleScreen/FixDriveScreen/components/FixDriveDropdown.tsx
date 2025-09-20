import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../../../core/context/ThemeContext';
import { getCurrentColors } from '../../../../../../shared/constants/colors';
import { createFixDriveDropdownStyles } from '../styles/FixDriveDropdown.styles';

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
  const colors = getCurrentColors(isDark);
  const styles = createFixDriveDropdownStyles(isDark);
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
      <Text style={styles.dropdownLabel}>
        {label}
      </Text>
      
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={toggleDropdown}
      >
        <Text style={[
          selectedOption 
            ? styles.dropdownButtonText 
            : styles.dropdownButtonPlaceholder
        ]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Ionicons 
          name={isOpen ? "chevron-up" : "chevron-down"} 
          size={16} 
          color={colors.textSecondary} 
        />
      </TouchableOpacity>
      
      {isOpen && (
        <View style={styles.dropdownList}>
          <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.dropdownOption,
                  selectedValue === option.value && styles.dropdownOptionSelected,
                  index === options.length - 1 && styles.dropdownOptionLast
                ]}
                onPress={() => handleSelect(option.value)}
              >
                <Text style={[
                  styles.dropdownOptionText,
                  selectedValue === option.value && styles.dropdownOptionTextSelected
                ]}>
                  {option.label}
                </Text>
                {selectedValue === option.value && (
                  <Ionicons 
                    name="checkmark" 
                    size={16} 
                    color={colors.primary} 
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
