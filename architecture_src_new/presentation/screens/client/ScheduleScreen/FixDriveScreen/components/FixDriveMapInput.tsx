import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../../../core/context/ThemeContext';
import { useI18n } from '../../../../../../shared/i18n';
import { getCurrentColors } from '../../../../../../shared/constants/colors';

interface AddressPoint {
  id: string;
  type: 'from' | 'to' | 'stop';
  address: string;
  coordinate?: { latitude: number; longitude: number };
  placeholder: string;
}

interface FixDriveMapInputProps {
  onAddressesChange: (addresses: AddressPoint[]) => void;
  initialAddresses?: AddressPoint[];
}

const FixDriveMapInput: React.FC<FixDriveMapInputProps> = ({
  onAddressesChange,
  initialAddresses,
}) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const colors = getCurrentColors(isDark);

  const [addresses, setAddresses] = useState<AddressPoint[]>(() => {
    if (initialAddresses && initialAddresses.length > 0) {
      return initialAddresses;
    }
    
    return [
      {
        id: 'from',
        type: 'from',
        address: '',
        placeholder: t('common.fixDrive.address.fromPlaceholder') || 'Откуда'
      },
      {
        id: 'to',
        type: 'to',
        address: '',
        placeholder: t('common.fixDrive.address.toPlaceholder') || 'Куда'
      }
    ];
  });

  const [isMapMode, setIsMapMode] = useState(true);

  const handleAddressChange = (id: string, text: string) => {
    const updatedAddresses = addresses.map(addr => 
      addr.id === id ? { ...addr, address: text } : addr
    );
    setAddresses(updatedAddresses);
    onAddressesChange(updatedAddresses);
  };

  const toggleMapMode = () => {
    setIsMapMode(!isMapMode);
  };

  const getPointColor = (type: string) => {
    switch (type) {
      case 'from': return colors.success;
      case 'to': return colors.primary;
      case 'stop': return colors.textSecondary;
      default: return colors.textSecondary;
    }
  };

  const getStatusIcon = (address: AddressPoint) => {
    if (address.address) {
      return 'checkmark-circle';
    }
    return address.type === 'from' ? 'location' : 'flag';
  };

  return (
    <View style={{ marginTop: 10 }}>
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: 12 
      }}>
        <Text style={{ 
          fontSize: 16, 
          fontWeight: '500', 
          color: colors.text
        }}>
          {t('common.fixDrive.address.selectFromMap') || 'Выберите адреса'}
        </Text>
        
        <TouchableOpacity 
          style={{ 
            backgroundColor: colors.primary,
            borderRadius: 20,
            padding: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3
          }}
          onPress={toggleMapMode}
        >
          <Ionicons 
            name={isMapMode ? "text" : "map"} 
            size={16} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>
      </View>

      {/* Карта (заглушка) */}
      {isMapMode && (
        <View style={{ 
          height: 200, 
          borderRadius: 8, 
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: colors.border,
          marginBottom: 12,
          backgroundColor: colors.surface,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Ionicons name="map" size={48} color={colors.textSecondary} />
          <Text style={{ 
            color: colors.textSecondary, 
            marginTop: 8,
            fontSize: 14
          }}>
            Карта будет здесь
          </Text>
        </View>
      )}

      {/* Список адресов */}
      <View style={{ marginBottom: 12 }}>
        {addresses.map((address) => {
          const pointColor = getPointColor(address.type);
          const statusIcon = getStatusIcon(address);

          return (
            <View key={address.id} style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              paddingVertical: 12,
              paddingHorizontal: 16,
              backgroundColor: colors.surface,
              borderRadius: 8,
              marginBottom: 8,
              borderWidth: 1,
              borderColor: address.address ? pointColor : colors.border
            }}>
              <View style={{ marginRight: 12 }}>
                <Ionicons 
                  name={statusIcon as any} 
                  size={20} 
                  color={address.address ? pointColor : colors.textSecondary} 
                />
              </View>
              
              <View style={{ flex: 1 }}>
                <Text style={{ 
                  fontSize: 14, 
                  fontWeight: '500', 
                  color: colors.text 
                }}>
                  {address.type === 'from' ? (t('common.fixDrive.address.from') || 'Откуда') :
                   address.type === 'to' ? (t('common.fixDrive.address.to') || 'Куда') :
                   (t('common.fixDrive.address.stopPlaceholder') || 'Остановка')}
                </Text>
                
                {!isMapMode ? (
                  <Text style={{ 
                    fontSize: 12, 
                    color: address.address ? colors.text : colors.textSecondary 
                  }}>
                    {address.address || address.placeholder}
                  </Text>
                ) : (
                  <Text style={{ 
                    fontSize: 12, 
                    color: colors.textSecondary 
                  }}>
                    {address.placeholder}
                  </Text>
                )}
              </View>

              {/* Кнопка очистки */}
              {address.address && (
                <TouchableOpacity 
                  style={{ padding: 8 }}
                  onPress={() => {
                    const updatedAddresses = addresses.map(addr => 
                      addr.id === address.id 
                        ? { ...addr, address: '', coordinate: undefined }
                        : addr
                    );
                    setAddresses(updatedAddresses);
                    onAddressesChange(updatedAddresses);
                  }}
                >
                  <Ionicons name="close-circle" size={16} color={colors.error} />
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default FixDriveMapInput;
