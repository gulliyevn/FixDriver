import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  TextInputProps,
  ViewStyle,
  TextStyle 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { InputFieldStyles } from '../styles/components/InputField.styles';

interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  required?: boolean;
}

export default function InputField({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  required,
  ...textInputProps
}: InputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    textInputProps.onFocus?.(null);
  };

  const handleBlur = () => {
    setIsFocused(false);
    textInputProps.onBlur?.(null);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getContainerStyle = () => {
    const baseStyle = InputFieldStyles.container;
    
    if (error) {
      return [baseStyle, InputFieldStyles.containerError];
    }
    
    if (isFocused) {
      return [baseStyle, InputFieldStyles.containerFocused];
    }
    
    return baseStyle;
  };

  const getInputStyle = () => {
    const baseStyle = InputFieldStyles.input;
    
    if (error) {
      return [baseStyle, InputFieldStyles.inputError];
    }
    
    if (isFocused) {
      return [baseStyle, InputFieldStyles.inputFocused];
    }
    
    return baseStyle;
  };

  return (
    <View style={[getContainerStyle(), containerStyle]}>
      {label && (
        <View style={InputFieldStyles.labelContainer}>
          <Text style={InputFieldStyles.label}>
            {label}
            {required && <Text style={InputFieldStyles.required}> *</Text>}
          </Text>
        </View>
      )}
      
      <View style={InputFieldStyles.inputContainer}>
        {leftIcon && (
          <View style={InputFieldStyles.leftIcon}>
            <Ionicons 
              name={leftIcon} 
              size={20} 
              color={error ? '#EF4444' : (isFocused ? '#3B82F6' : '#6B7280')} 
            />
          </View>
        )}
        
        <TextInput
          {...textInputProps}
          style={[getInputStyle(), inputStyle]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={textInputProps.secureTextEntry && !isPasswordVisible}
        />
        
        {textInputProps.secureTextEntry && (
          <TouchableOpacity
            style={InputFieldStyles.rightIcon}
            onPress={togglePasswordVisibility}
          >
            <Ionicons 
              name={isPasswordVisible ? 'eye-off' : 'eye'} 
              size={20} 
              color="#6B7280" 
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !textInputProps.secureTextEntry && (
          <TouchableOpacity
            style={InputFieldStyles.rightIcon}
            onPress={onRightIconPress}
          >
            <Ionicons 
              name={rightIcon} 
              size={20} 
              color="#6B7280" 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <View style={InputFieldStyles.errorContainer}>
          <Ionicons name="alert-circle" size={16} color="#EF4444" />
          <Text style={InputFieldStyles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}
