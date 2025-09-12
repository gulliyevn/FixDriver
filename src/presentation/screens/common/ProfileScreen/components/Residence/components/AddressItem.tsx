import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../../../../../../shared/hooks/useI18n';
import { Address } from '../../../../../../../../shared/types/profile';
import { styles } from '../styles/ResidenceScreen.styles';

/**
 * Address Item Component
 * 
 * Individual address card with action buttons
 * Displays address information and management options
 */

interface AddressItemProps {
  address: Address;
  isDark: boolean;
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
  onSetDefault: (address: Address) => void;
  getCategoryLabel: (categoryKey: string) => string;
}

export const AddressItem: React.FC<AddressItemProps> = ({
  address,
  isDark,
  onEdit,
  onDelete,
  onSetDefault,
  getCategoryLabel,
}) => {
  const { t } = useI18n();

  return (
    <View style={[styles.addressItem, { backgroundColor: isDark ? '#2a2a2a' : '#fff' }]}>
      <View style={styles.addressHeader}>
        <View style={styles.addressInfo}>
          <Text style={[styles.addressTitle, { color: isDark ? '#fff' : '#000' }]}>
            {address.title}
          </Text>
          <Text style={[styles.addressText, { color: isDark ? '#ccc' : '#666' }]}>
            {address.address}
          </Text>
          {address.category && (
            <Text style={[styles.addressDescription, { color: isDark ? '#999' : '#888' }]}>
              {getCategoryLabel(address.category)}
            </Text>
          )}
        </View>
        <View style={styles.actionButtons}>
          {!address.isDefault && (
            <TouchableOpacity 
              style={[styles.defaultButton, { backgroundColor: isDark ? '#333' : '#f0f0f0' }]}
              onPress={() => onSetDefault(address)}
            >
              <Ionicons name="star-outline" size={18} color={isDark ? '#fff' : '#ffc107'} />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={[styles.editButton, { backgroundColor: isDark ? '#333' : '#f0f0f0' }]}
            onPress={() => onEdit(address)}
          >
            <Ionicons name="pencil" size={18} color={isDark ? '#fff' : '#2196f3'} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.deleteButton, { backgroundColor: isDark ? '#333' : '#f0f0f0' }]}
            onPress={() => onDelete(address)}
          >
            <Ionicons name="trash" size={18} color="#f44336" />
          </TouchableOpacity>
        </View>
      </View>
      {address.isDefault && (
        <View style={styles.defaultBadge}>
          <Text style={styles.defaultText}>{t('residence.defaultBadge')}</Text>
        </View>
      )}
    </View>
  );
};
