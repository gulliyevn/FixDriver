import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TravelPackage, ActivePackage } from '../types/package';
import { useTheme } from '../context/ThemeContext';
import { PackageCardStyles } from '../styles/components/PackageCard.styles';

interface PackageCardProps {
  package: TravelPackage | ActivePackage;
  isActive?: boolean;
  onSelect?: (packageId: string) => void;
  disabled?: boolean;
}

const PackageCard: React.FC<PackageCardProps> = ({ 
  package: pkg, 
  isActive = false, 
  onSelect,
  disabled = false 
}) => {
  const { isDark } = useTheme();

  const getPackageIcon = (type: string) => {
    switch (type) {
      case 'single': return '🎫';
      case 'weekly': return '📅';
      case 'monthly': return '📆';
      case 'yearly': return '🗓️';
      default: return '📦';
    }
  };

  const getPackageColor = (type: string) => {
    switch (type) {
      case 'single': return '#FF6B6B';
      case 'weekly': return '#4ECDC4';
      case 'monthly': return '#45B7D1';
      case 'yearly': return '#96CEB4';
      default: return '#95A5A6';
    }
  };

  const isActivePackage = (pkg: TravelPackage | ActivePackage): pkg is ActivePackage => {
    return 'tripsUsed' in pkg;
  };

  return (
    <TouchableOpacity 
      style={[
        PackageCardStyles.container,
        {
          backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
          borderColor: isActive ? getPackageColor(pkg.type) : (isDark ? '#374151' : '#E5E7EB'),
          borderWidth: isActive ? 2 : 1,
        },
        disabled && PackageCardStyles.disabled
      ]}
      onPress={() => !disabled && onSelect?.(pkg.id)}
      disabled={disabled}
    >
      {/* Заголовок пакета */}
      <View style={PackageCardStyles.header}>
        <Text style={PackageCardStyles.icon}>{getPackageIcon(pkg.type)}</Text>
        <View style={PackageCardStyles.titleContainer}>
          <Text style={[
            PackageCardStyles.title,
            { color: isDark ? '#FFFFFF' : '#1F2937' }
          ]}>
            {pkg.name}
          </Text>
          {isActive && (
            <Text style={[PackageCardStyles.activeLabel, { backgroundColor: getPackageColor(pkg.type) }]}>
              АКТИВЕН
            </Text>
          )}
        </View>
        <Text style={[
          PackageCardStyles.price,
          { color: getPackageColor(pkg.type) }
        ]}>
          {pkg.price} ₼
        </Text>
      </View>

      {/* Описание */}
      <Text style={[
        PackageCardStyles.description,
        { color: isDark ? '#9CA3AF' : '#6B7280' }
      ]}>
        {pkg.description}
      </Text>

      {/* Детали пакета */}
      {pkg.type !== 'single' && (
        <View style={PackageCardStyles.details}>
          {pkg.tripsIncluded && (
            <View style={PackageCardStyles.detailItem}>
              <Text style={[PackageCardStyles.detailLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                🎫 Поездки:
              </Text>
              <Text style={[PackageCardStyles.detailValue, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
                {isActivePackage(pkg) ? `${pkg.tripsRemaining}/${pkg.tripsIncluded}` : pkg.tripsIncluded}
              </Text>
            </View>
          )}
          
          {pkg.kmLimit && (
            <View style={PackageCardStyles.detailItem}>
              <Text style={[PackageCardStyles.detailLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                🛣️ Километры:
              </Text>
              <Text style={[PackageCardStyles.detailValue, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
                {isActivePackage(pkg) ? `${(pkg.kmLimit - pkg.kmUsed)}/${pkg.kmLimit} км` : `${pkg.kmLimit} км`}
              </Text>
            </View>
          )}

          {pkg.timeLimit && (
            <View style={PackageCardStyles.detailItem}>
              <Text style={[PackageCardStyles.detailLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                ⏱️ Время:
              </Text>
              <Text style={[PackageCardStyles.detailValue, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
                {isActivePackage(pkg) ? 
                  `${Math.round((pkg.timeLimit - pkg.timeUsed)/60)}/${Math.round(pkg.timeLimit/60)} ч`
                  : `${Math.round(pkg.timeLimit/60)} ч`
                }
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Дата окончания для активного пакета */}
      {isActivePackage(pkg) && pkg.expiresAt && (
        <View style={PackageCardStyles.expiry}>
          <Text style={[PackageCardStyles.expiryText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            Действует до: {new Date(pkg.expiresAt).toLocaleDateString('ru-RU')}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default PackageCard; 