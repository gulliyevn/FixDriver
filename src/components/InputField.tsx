import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  TouchableOpacity,
  TextInputProps 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  required?: boolean;
  showCharacterCount?: boolean;
  maxLength?: number;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  labelStyle,
  required = false,
  showCharacterCount = false,
  maxLength,
  value,
  secureTextEntry,
  ...props
}) => {
  const { isDark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const handleRightIconPress = () => {
    if (secureTextEntry) {
      setIsSecure(!isSecure);
    } else if (onRightIconPress) {
      onRightIconPress();
    }
  };

  const getRightIcon = () => {
    if (secureTextEntry) {
      return isSecure ? 'eye-off' : 'eye';
    }
    return rightIcon;
  };

  const getContainerStyle = (): ViewStyle => ({
    ...styles.container,
    borderColor: error 
      ? '#DC2626' 
      : isFocused 
        ? '#1E3A8A' 
        : isDark 
          ? '#374151' 
          : '#D1D5DB',
    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
  });

  const getInputStyle = (): TextStyle => ({
    ...styles.input,
    color: isDark ? '#F9FAFB' : '#1F2937',
    paddingLeft: leftIcon ? 40 : 16,
    paddingRight: (rightIcon || secureTextEntry) ? 40 : 16,
  });

  const getLabelStyle = (): TextStyle => ({
    ...styles.label,
    color: error 
      ? '#DC2626' 
      : isDark 
        ? '#F9FAFB' 
        : '#374151',
  });

  return (
    <View style={containerStyle}>
      {label && (
        <Text style={[getLabelStyle(), labelStyle]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      
      <View style={getContainerStyle()}>
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={isDark ? '#9CA3AF' : '#6B7280'}
            style={styles.leftIcon}
          />
        )}
        
        <TextInput
          style={[getInputStyle(), inputStyle]}
          value={value}
          secureTextEntry={isSecure}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
          maxLength={maxLength}
          {...props}
        />
        
        {(rightIcon || secureTextEntry) && (
          <TouchableOpacity
            onPress={handleRightIconPress}
            style={styles.rightIcon}
          >
            <Ionicons
              name={getRightIcon() as any}
              size={20}
              color={isDark ? '#9CA3AF' : '#6B7280'}
            />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.footer}>
        {error && (
          <Text style={styles.error}>{error}</Text>
        )}
        
        {showCharacterCount && maxLength && (
          <Text style={[styles.characterCount, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            {value?.length || 0} / {maxLength}
          </Text>
        )}
      </View>
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
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  required: {
    color: '#DC2626',
  },
  leftIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    right: 12,
    zIndex: 1,
    padding: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  error: {
    fontSize: 12,
    color: '#DC2626',
    marginTop: 2,
  },
  characterCount: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default InputField;
