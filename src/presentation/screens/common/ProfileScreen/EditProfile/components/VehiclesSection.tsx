import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../../../../shared/hooks/useI18n';
import { EditProfileScreenStyles as styles } from '../styles/EditProfileScreen.styles';
import { AddVehicleModal } from './AddVehicleModal';

/**
 * Vehicles Section Component
 * 
 * Section for managing vehicles (driver only)
 */

interface VehiclesSectionProps {
  vehicles: any[];
  swipeRefs: React.MutableRefObject<Record<string, any>>;
  openSwipeRef: React.MutableRefObject<any>;
  onDeleteVehicle: (id: string) => void;
  onVehicleAdded: () => void;
  renderRightActions: (progress: any, dragX: any, vehicleId: string) => React.ReactNode;
  isDark: boolean;
}

export const VehiclesSection: React.FC<VehiclesSectionProps> = ({
  vehicles,
  swipeRefs,
  openSwipeRef,
  onDeleteVehicle,
  onVehicleAdded,
  renderRightActions,
  isDark
}) => {
  const { t } = useI18n();
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);

  return (
    <View style={[styles.section, isDark && styles.sectionDark]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
          {t('profile.vehicles.title')} ({vehicles.length})
        </Text>
        {vehicles.length < 2 && (
          <TouchableOpacity
            style={[styles.addButton, isDark && styles.addButtonDark]}
            onPress={() => setShowAddVehicleModal(true)}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      {vehicles.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons 
            name="car-outline" 
            size={48} 
            color={isDark ? '#6B7280' : '#9CA3AF'} 
          />
          <Text style={[styles.emptyStateText, isDark && styles.emptyStateTextDark]}>
            {t('profile.vehicles.noVehicles')}
          </Text>
          <Text style={[styles.emptyStateSubtext, isDark && styles.emptyStateSubtextDark]}>
            {t('profile.vehicles.addFirstVehicle')}
          </Text>
        </View>
      ) : (
        vehicles.map((vehicle) => (
          <Swipeable
            key={vehicle.id}
            ref={(ref) => { swipeRefs.current[vehicle.id] = ref; }}
            renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, vehicle.id)}
            rightThreshold={60}
            friction={2}
            overshootRight={false}
            onSwipeableWillOpen={() => {
              if (openSwipeRef.current && openSwipeRef.current !== swipeRefs.current[vehicle.id]) {
                try { openSwipeRef.current.close(); } catch {}
              }
              openSwipeRef.current = swipeRefs.current[vehicle.id] ?? null;
            }}
            onSwipeableClose={() => {
              if (openSwipeRef.current === swipeRefs.current[vehicle.id]) {
                openSwipeRef.current = null;
              }
            }}
          >
            <View style={[styles.vehicleCard, isDark && styles.vehicleCardDark]}>
              <View style={styles.vehicleInfo}>
                <Text style={[styles.vehicleNumber, isDark && styles.vehicleNumberDark]}>
                  {vehicle.vehicleNumber}
                </Text>
                <Text style={[styles.vehicleDetails, isDark && styles.vehicleDetailsDark]}>
                  {vehicle.carBrand} {vehicle.carModel} ({vehicle.carYear})
                </Text>
                <Text style={[styles.vehicleMileage, isDark && styles.vehicleMileageDark]}>
                  {vehicle.carMileage} km
                </Text>
              </View>
              
              <View style={styles.vehicleStatus}>
                <View style={[
                  styles.verificationBadge,
                  vehicle.isVerified ? styles.verifiedBadge : styles.pendingBadge
                ]}>
                  <Ionicons
                    name={vehicle.isVerified ? "checkmark-circle" : "time"}
                    size={16}
                    color={vehicle.isVerified ? "#10B981" : "#F59E0B"}
                  />
                  <Text style={[
                    styles.verificationText,
                    vehicle.isVerified ? styles.verifiedText : styles.pendingText
                  ]}>
                    {vehicle.isVerified ? t('profile.vehicles.verified') : t('profile.vehicles.pending')}
                  </Text>
                </View>
              </View>
            </View>
          </Swipeable>
        ))
      )}

      {/* Add Vehicle Modal */}
      <AddVehicleModal
        visible={showAddVehicleModal}
        onClose={() => setShowAddVehicleModal(false)}
        onVehicleAdded={onVehicleAdded}
        isDark={isDark}
      />
    </View>
  );
};
