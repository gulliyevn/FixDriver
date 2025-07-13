import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { PaymentPackageCardStyles } from '../styles/components/PaymentPackageCard.styles';

interface PaymentPackageCardProps {
  title: string;
  price: string;
  description?: string;
  onPress?: () => void;
  selected?: boolean;
  disabled?: boolean;
}

const PaymentPackageCard: React.FC<PaymentPackageCardProps> = ({
  title,
  price,
  description,
  onPress,
  selected = false,
  disabled = false,
}) => {
  const { isDark } = useTheme();

  return (
    <TouchableOpacity
      style={[
        PaymentPackageCardStyles.container,
        {
          backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
          borderColor: selected ? '#3B82F6' : isDark ? '#374151' : '#E5E7EB',
        },
        selected && PaymentPackageCardStyles.selected,
        disabled && PaymentPackageCardStyles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={PaymentPackageCardStyles.header}>
        <Text style={[
          PaymentPackageCardStyles.title,
          { color: isDark ? '#F9FAFB' : '#1F2937' }
        ]}>
          {title}
        </Text>
        <Text style={[
          PaymentPackageCardStyles.price,
          { color: selected ? '#3B82F6' : isDark ? '#9CA3AF' : '#6B7280' }
        ]}>
          {price}
        </Text>
      </View>
      
      {description && (
        <Text style={[
          PaymentPackageCardStyles.description,
          { color: isDark ? '#9CA3AF' : '#6B7280' }
        ]}>
          {description}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default PaymentPackageCard;
