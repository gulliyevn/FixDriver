import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../../../../shared/hooks/useI18n';
import { EditProfileScreenStyles as styles } from '../styles/EditProfileScreen.styles';
import { VehicleForm } from './VehicleForm';
import { useAddVehicle } from '../hooks/useAddVehicle';

/**
 * Add Vehicle Modal Component
 * 
 * Modal for adding new vehicles (driver only)
 */

interface AddVehicleModalProps {
  visible: boolean;
  onClose: () => void;
  onVehicleAdded: () => void;
  isDark: boolean;
}

export const AddVehicleModal: React.FC<AddVehicleModalProps> = ({
  visible,
  onClose,
  onVehicleAdded,
  isDark
}) => {
  const { t } = useI18n();
  
  const {
    vehicleForm,
    vehicleErrors,
    brandOptions,
    modelOptions,
    vehiclePhoto,
    uploadingPhoto,
    isLoading,
    handleVehicleChange,
    handleBrandChange,
    handleModelChange,
    handleTariffChange,
    handleYearChange,
    handleSaveVehicle,
    handleClose,
    handlePhotoChange,
    handlePhotoError,
    handleUploadingChange,
  } = useAddVehicle(visible, onVehicleAdded, onClose);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={[styles.modalContainer, isDark && styles.modalContainerDark]}>
        <View style={[styles.modalHeader, isDark && styles.modalHeaderDark]}>
          <Text style={[styles.modalTitle, isDark && styles.modalTitleDark]}>
            {t('profile.vehicles.addVehicle')}
          </Text>
          <TouchableOpacity onPress={handleClose} disabled={isLoading}>
            <Ionicons name="close" size={24} color={isDark ? '#F9FAFB' : '#111827'} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          <VehicleForm
            vehicleForm={vehicleForm}
            vehicleErrors={vehicleErrors}
            brandOptions={brandOptions}
            modelOptions={modelOptions}
            vehiclePhoto={vehiclePhoto}
            uploadingPhoto={uploadingPhoto}
            isDark={isDark}
            isLoading={isLoading}
            onVehicleChange={handleVehicleChange}
            onBrandChange={handleBrandChange}
            onModelChange={handleModelChange}
            onTariffChange={handleTariffChange}
            onYearChange={handleYearChange}
            onPhotoChange={handlePhotoChange}
            onPhotoError={handlePhotoError}
            onUploadingChange={handleUploadingChange}
          />
        </ScrollView>

        <View style={[styles.modalActions, isDark && styles.modalActionsDark]}>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={handleClose}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.modalButton, styles.saveButton, isLoading && { opacity: 0.6 }]}
            onPress={handleSaveVehicle}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? t('common.saving') : t('profile.vehicles.saveVehicle')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
