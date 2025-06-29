import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TravelPackage, ActivePackage } from '../types/package';
import { useTheme } from '../context/ThemeContext';

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
        styles.container,
        {
          backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
          borderColor: isActive ? getPackageColor(pkg.type) : (isDark ? '#374151' : '#E5E7EB'),
          borderWidth: isActive ? 2 : 1,
        },
        disabled && styles.disabled
      ]}
      onPress={() => !disabled && onSelect?.(pkg.id)}
      disabled={disabled}
    >
      {/* Заголовок пакета */}
      <View style={styles.header}>
        <Text style={styles.icon}>{getPackageIcon(pkg.type)}</Text>
        <View style={styles.titleContainer}>
          <Text style={[
            styles.title,
            { color: isDark ? '#FFFFFF' : '#1F2937' }
          ]}>
            {pkg.name}
          </Text>
          {isActive && (
            <Text style={[styles.activeLabel, { backgroundColor: getPackageColor(pkg.type) }]}>
              АКТИВЕН
            </Text>
          )}
        </View>
        <Text style={[
          styles.price,
          { color: getPackageColor(pkg.type) }
        ]}>
          {pkg.price} ₼
        </Text>
      </View>

      {/* Описание */}
      <Text style={[
        styles.description,
        { color: isDark ? '#9CA3AF' : '#6B7280' }
      ]}>
        {pkg.description}
      </Text>

      {/* Детали пакета */}
      {pkg.type !== 'single' && (
        <View style={styles.details}>
          {pkg.tripsIncluded && (
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                🎫 Поездки:
              </Text>
              <Text style={[styles.detailValue, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
                {isActivePackage(pkg) ? `${pkg.tripsRemaining}/${pkg.tripsIncluded}` : pkg.tripsIncluded}
              </Text>
            </View>
          )}
          
          {pkg.kmLimit && (
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                🛣️ Километры:
              </Text>
              <Text style={[styles.detailValue, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
                {isActivePackage(pkg) ? `${(pkg.kmLimit - pkg.kmUsed)}/${pkg.kmLimit} км` : `${pkg.kmLimit} км`}
              </Text>
            </View>
          )}

          {pkg.timeLimit && (
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                ⏱️ Время:
              </Text>
              <Text style={[styles.detailValue, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
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
        <View style={styles.expiry}>
          <Text style={[styles.expiryText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            Действует до: {new Date(pkg.expiresAt).toLocaleDateString('ru-RU')}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabled: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  activeLabel: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    marginRight: 4,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  expiry: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
    marginTop: 8,
  },
  expiryText: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default PackageCard; 