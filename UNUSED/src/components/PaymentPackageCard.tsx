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
        isDark ? PaymentPackageCardStyles.containerDark : PaymentPackageCardStyles.containerLight,
        selected ? PaymentPackageCardStyles.selected : (isDark ? PaymentPackageCardStyles.borderDark : PaymentPackageCardStyles.borderLight),
        selected && PaymentPackageCardStyles.selected,
        disabled && PaymentPackageCardStyles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={PaymentPackageCardStyles.header}>
        <Text style={[
          PaymentPackageCardStyles.title,
          isDark ? PaymentPackageCardStyles.titleDark : PaymentPackageCardStyles.titleLight
        ]}>
          {title}
        </Text>
        <Text style={[
          PaymentPackageCardStyles.price,
          selected ? PaymentPackageCardStyles.priceSelected : (isDark ? PaymentPackageCardStyles.priceDark : PaymentPackageCardStyles.priceLight)
        ]}>
          {price}
        </Text>
      </View>
      
      {description && (
        <Text style={[
          PaymentPackageCardStyles.description,
          isDark ? PaymentPackageCardStyles.descriptionDark : PaymentPackageCardStyles.descriptionLight
        ]}>
          {description}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default PaymentPackageCard;
