import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../../../context/ThemeContext';
import { useI18n } from '../../../../../../shared/hooks/useI18n';
import { useAuth } from '../../../../../../context/AuthContext';
import { useResidenceActions } from '../../hooks/useResidenceActions';
import { useResidenceState } from '../../hooks/useResidenceState';
import { AddressList } from './components/AddressList';
import { EmptyState } from './components/EmptyState';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { AddressModal } from './components/AddressModal';
import { styles } from './styles/ResidenceScreen.styles';

/**
 * Residence Screen Component
 * 
 * Manages user addresses with CRUD operations
 * Supports both client and driver roles
 * Integrates with gRPC services for backend communication
 */

type ResidenceScreenProps = {
  navigation: any;
  route?: any;
};

export const ResidenceScreen: React.FC<ResidenceScreenProps> = ({ navigation, route }) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const { user } = useAuth();
  
  const isDriver = user?.role === 'driver';
  
  const {
    showModal,
    modalMode,
    selectedAddress,
    setShowModal,
    setModalMode,
    setSelectedAddress,
    handleAddAddress,
    handleEditAddress,
    handleDeleteAddress,
    handleSetDefault,
    handleSaveAddress,
  } = useResidenceActions();

  const {
    addresses,
    loading,
    error,
    refreshAddresses,
  } = useResidenceState();

  const getScreenTitle = () => {
    return isDriver ? t('residence.titleForDriver') : t('residence.title');
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingState />;
    }

    if (error) {
      return <ErrorState error={error} onRetry={refreshAddresses} />;
    }

    if (addresses.length === 0) {
      return <EmptyState />;
    }

    return (
      <AddressList
        addresses={addresses}
        onEdit={handleEditAddress}
        onDelete={handleDeleteAddress}
        onSetDefault={handleSetDefault}
        getCategoryLabel={(categoryKey: string) => {
          // This will be implemented in the component
          return categoryKey;
        }}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' }]}>
      <View style={[styles.header, { backgroundColor: isDark ? '#2a2a2a' : '#fff' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#003366'} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
          {getScreenTitle()}
        </Text>
        <View style={styles.headerSpacer} />
      </View>
      
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={[styles.contentContainer, { paddingTop: 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>

      <TouchableOpacity style={styles.floatingAddButton} onPress={handleAddAddress}>
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      <AddressModal
        visible={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedAddress(null);
        }}
        onSave={handleSaveAddress}
        address={selectedAddress}
        mode={modalMode}
        addresses={addresses}
      />
    </View>
  );
};
