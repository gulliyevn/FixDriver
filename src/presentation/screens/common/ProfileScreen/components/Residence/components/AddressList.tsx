import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../../../../../context/ThemeContext';
import { useI18n } from '../../../../../../../../shared/hooks/useI18n';
import { Address } from '../../../../../../../../shared/types/profile';
import { AddressItem } from './AddressItem';
import { styles } from '../styles/ResidenceScreen.styles';

/**
 * Address List Component
 * 
 * Renders list of user addresses with action buttons
 * Handles address management operations
 */

interface AddressListProps {
  addresses: Address[];
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
  onSetDefault: (address: Address) => void;
  getCategoryLabel: (categoryKey: string) => string;
}

export const AddressList: React.FC<AddressListProps> = ({
  addresses,
  onEdit,
  onDelete,
  onSetDefault,
  getCategoryLabel,
}) => {
  const { isDark } = useTheme();
  const { t } = useI18n();

  return (
    <>
      {addresses.map((address) => (
        <AddressItem
          key={address.id}
          address={address}
          isDark={isDark}
          onEdit={onEdit}
          onDelete={onDelete}
          onSetDefault={onSetDefault}
          getCategoryLabel={getCategoryLabel}
        />
      ))}
    </>
  );
};
