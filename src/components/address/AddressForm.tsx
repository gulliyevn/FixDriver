import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Select from '../Select';
import AddressValidationIndicator from './AddressValidationIndicator';
import { AddressModalStyles, getAddressModalStyles } from '../../styles/components/AddressModal.styles';
import { getCurrentColors } from '../../constants/colors';

export interface AddressCategoryOption {
  value: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

interface AddressFormProps {
  title: string;
  address: string;
  category: string;
  categories: AddressCategoryOption[];
  isDefault: boolean;
  onTitleChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onAddressBlur: () => void;
  onCategorySelect: (value: string) => void;
  onToggleDefault: () => void;
  onMapPress: () => void;
  validationStatus: 'idle' | 'checking' | 'valid' | 'invalid';
  onRetryValidation: () => void;
  labels: {
    nameLabel: string;
    namePlaceholder: string;
    categoryLabel: string;
    categoryPlaceholder: string;
    addressLabel: string;
    addressPlaceholder: string;
    defaultLabel: string;
    validation: {
      checking: string;
      valid: string;
      invalid: string;
      retry: string;
    };
  };
  styles: typeof AddressModalStyles;
  dynamicStyles: ReturnType<typeof getAddressModalStyles> & {
    placeholderColor?: string;
  };
  isDark: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({
  title,
  address,
  category,
  categories,
  isDefault,
  onTitleChange,
  onAddressChange,
  onAddressBlur,
  onCategorySelect,
  onToggleDefault,
  onMapPress,
  validationStatus,
  onRetryValidation,
  labels,
  styles,
  dynamicStyles,
  isDark,
}) => {
  const placeholderColor = dynamicStyles.placeholderColor ?? getCurrentColors(isDark).textSecondary;

  return (
    <View style={[styles.formContainer, dynamicStyles.formContainer]}>
      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>{labels.nameLabel}</Text>
        <TextInput
          style={[styles.textInput, dynamicStyles.textInput]}
          placeholder={labels.namePlaceholder}
          placeholderTextColor={placeholderColor}
          value={title}
          onChangeText={onTitleChange}
          maxLength={50}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>{labels.categoryLabel}</Text>
        <Select
          options={categories}
          value={category}
          onSelect={(option) => onCategorySelect(option.value as string)}
          placeholder={labels.categoryPlaceholder}
          compact
          searchable
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>{labels.addressLabel}</Text>
        <View style={[styles.addressInputContainer, dynamicStyles.addressInputContainer]}>
          <TextInput
            style={[styles.addressInput, dynamicStyles.addressInput]}
            placeholder={labels.addressPlaceholder}
            placeholderTextColor={placeholderColor}
            value={address}
            onChangeText={onAddressChange}
            onBlur={onAddressBlur}
            multiline
            maxLength={200}
          />
          <TouchableOpacity style={[styles.mapButton, dynamicStyles.mapButton]} onPress={onMapPress}>
            <Ionicons name="map-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <AddressValidationIndicator
          status={validationStatus}
          onRetry={onRetryValidation}
          messages={labels.validation}
          styles={{
            container: styles.validationContainer,
            item: styles.validationItem,
            text: [styles.validationText, dynamicStyles.validationText],
            textValid: styles.validationTextValid,
            textInvalid: styles.validationTextInvalid,
            retryButton: styles.verifyButton,
            retryButtonText: styles.verifyButtonText,
          }}
        />
      </View>

      <TouchableOpacity style={styles.checkboxContainer} onPress={onToggleDefault}>
        <Ionicons name={isDefault ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={isDefault ? '#4caf50' : '#ccc'} />
        <Text style={[styles.checkboxText, dynamicStyles.checkboxText]}>{labels.defaultLabel}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddressForm;
