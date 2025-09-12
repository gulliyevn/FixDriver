/**
 * AddressPickerScreen component
 * Screen for selecting address on map
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import { lightColors, darkColors } from '../../../../shared/constants/colors';
import { MapView } from './components/MapView';
import { AddressDisplay } from './components/AddressDisplay';
import { LocationControls } from './components/LocationControls';
import { ErrorDisplay } from './components/ErrorDisplay';
import { useLocation } from './hooks/useLocation';
import { useGeocoding } from './hooks/useGeocoding';
import { AddressPickerStyles as styles } from './styles/AddressPicker.styles';

interface AddressPickerScreenProps {
  navigation: {
    goBack: () => void;
  };
  route: {
    params: {
      onAddressSelected: (address: string, latitude: number, longitude: number) => void;
    };
  };
}

export const AddressPickerScreen: React.FC<AddressPickerScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : lightColors;
  const { width, height } = Dimensions.get('window');
  
  const { onAddressSelected } = route.params;
  
  const {
    location,
    selectedLocation,
    loading: locationLoading,
    error: locationError,
    getCurrentLocation,
    setSelectedLocation
  } = useLocation();
  
  const {
    address,
    loading: geocodingLoading,
    getAddressFromCoordinates
  } = useGeocoding();
  
  const mapRef = useRef<any>(null);
  const loading = locationLoading || geocodingLoading;
  
  useEffect(() => {
    getCurrentLocation();
  }, []);
  
  const handleMapPress = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    
    setSelectedLocation({ latitude, longitude });
    await getAddressFromCoordinates(latitude, longitude);
  };
  
  const handleConfirmAddress = () => {
    if (selectedLocation && address) {
      onAddressSelected(address, selectedLocation.latitude, selectedLocation.longitude);
      navigation.goBack();
    } else {
      Alert.alert(t('addressPicker.error'), t('addressPicker.selectLocation'));
    }
  };
  
  const handleRetryLocation = () => {
    getCurrentLocation();
  };
  
  const getInitialRegion = () => {
    if (selectedLocation) {
      return {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }
    
    // Default region for Azerbaijan
    return {
      latitude: 40.3777,
      longitude: 49.8920,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  };

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <View style={[styles.header, { backgroundColor: currentColors.surface }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={currentColors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: currentColors.text }]}>
          {t('addressPicker.title')}
        </Text>
        <TouchableOpacity 
          onPress={handleConfirmAddress} 
          style={[styles.confirmButton, { backgroundColor: currentColors.primary }]}
        >
          <Text style={styles.confirmButtonText}>
            {t('addressPicker.confirm')}
          </Text>
        </TouchableOpacity>
      </View>

      <MapView
        ref={mapRef}
        initialRegion={getInitialRegion()}
        onPress={handleMapPress}
        selectedLocation={selectedLocation}
        address={address}
      />

      {locationError && (
        <ErrorDisplay
          error={locationError}
          onRetry={handleRetryLocation}
        />
      )}

      <AddressDisplay
        address={address}
        loading={loading}
      />

      <LocationControls
        onRetryLocation={handleRetryLocation}
        onGetCurrentLocation={getCurrentLocation}
      />
    </View>
  );
};
