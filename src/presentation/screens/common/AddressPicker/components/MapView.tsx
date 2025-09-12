/**
 * MapView component
 * Interactive map for address selection
 */

import React, { forwardRef, useImperativeHandle } from 'react';
import { View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { AddressPickerStyles as styles } from '../styles/AddressPicker.styles';

interface MapViewProps {
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  onPress: (event: any) => void;
  selectedLocation: {
    latitude: number;
    longitude: number;
  } | null;
  address: string;
}

export const MapView = forwardRef<any, MapViewProps>(({
  initialRegion,
  onPress,
  selectedLocation,
  address
}, ref) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  
  useImperativeHandle(ref, () => ({
    animateToRegion: (region: any) => {
      // TODO: Implement map animation
    }
  }));

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        onPress={onPress}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        showsTraffic={false}
        showsBuildings={true}
        showsIndoors={true}
      >
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title={t('addressPicker.selectedAddress')}
            description={address}
            pinColor="#003366"
          />
        )}
      </MapView>
    </View>
  );
});
