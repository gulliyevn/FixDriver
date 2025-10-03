import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import MapViewComponent from "../MapView";
import {
  AddressModalStyles,
  getAddressModalStyles,
} from "../../styles/components/AddressModal.styles";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface AddressMapModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (coordinates: Coordinates) => void;
  styles: typeof AddressModalStyles;
  dynamicStyles: ReturnType<typeof getAddressModalStyles>;
  isDark: boolean;
  title: string;
  confirmText: string;
  instructionsText: string;
  selectedCoordinates: Coordinates | null;
}

const AddressMapModal: React.FC<AddressMapModalProps> = ({
  visible,
  onClose,
  onSelect,
  styles,
  dynamicStyles,
  isDark,
  title,
  confirmText,
  instructionsText,
  selectedCoordinates,
}) => (
  <Modal
    visible={visible}
    animationType="slide"
    presentationStyle="pageSheet"
    onRequestClose={onClose}
  >
    <View style={[styles.mapModalContainer, dynamicStyles.mapModalContainer]}>
      <View style={[styles.mapModalHeader, dynamicStyles.mapModalHeader]}>
        <TouchableOpacity onPress={onClose} style={styles.mapCloseButton}>
          <Ionicons name="close" size={24} color={isDark ? "#fff" : "#000"} />
        </TouchableOpacity>
        <Text style={[styles.mapModalTitle, dynamicStyles.mapModalTitle]}>
          {title}
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.mapConfirmButton}>
          <Text style={styles.mapConfirmButtonText}>{confirmText}</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.mapContainer, dynamicStyles.mapContainer]}>
        <MapViewComponent
          onLocationSelect={onSelect}
          showNearbyDrivers={false}
          markers={
            selectedCoordinates
              ? [
                  {
                    id: "selected",
                    coordinate: selectedCoordinates,
                    title,
                    description: instructionsText,
                    type: "destination",
                  },
                ]
              : []
          }
        />
        <Text style={[styles.mapInstructions, dynamicStyles.mapInstructions]}>
          {instructionsText}
        </Text>
      </View>
    </View>
  </Modal>
);

export default AddressMapModal;
