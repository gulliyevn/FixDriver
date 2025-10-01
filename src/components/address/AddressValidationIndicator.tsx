import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AddressValidationIndicatorProps {
  status: 'idle' | 'checking' | 'valid' | 'invalid';
  onRetry?: () => void;
  messages: {
    checking: string;
    valid: string;
    invalid: string;
    retry: string;
  };
  styles: {
    container: any;
    item: any;
    text: any;
    textValid: any;
    textInvalid: any;
    retryButton: any;
    retryButtonText: any;
  };
}

const AddressValidationIndicator: React.FC<AddressValidationIndicatorProps> = ({
  status,
  onRetry,
  messages,
  styles,
}) => {
  if (status === 'idle') {
    return null;
  }

  return (
    <View style={styles.container}>
      {status === 'checking' && (
        <View style={styles.item}>
          <ActivityIndicator size="small" color="#2196f3" />
          <Text style={styles.text}>{messages.checking}</Text>
        </View>
      )}
      {status === 'valid' && (
        <View style={styles.item}>
          <Ionicons name="checkmark-circle" size={16} color="#4caf50" />
          <Text style={[styles.text, styles.textValid]}>{messages.valid}</Text>
        </View>
      )}
      {status === 'invalid' && (
        <>
          <View style={styles.item}>
            <Ionicons name="close-circle" size={16} color="#f44336" />
            <Text style={[styles.text, styles.textInvalid]}>{messages.invalid}</Text>
          </View>
          {onRetry && (
            <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
              <Text style={styles.retryButtonText}>{messages.retry}</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

export default AddressValidationIndicator;
