import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { TIME_PICKER_COLORS } from "../screens/common/FixDriveScreen/components/constants";

interface CustomizationModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => void;
}

const CustomizationModal: React.FC<CustomizationModalProps> = ({
  visible,
  onClose,
}) => {
  const { isDark } = useTheme();

  const styles = createStyles(isDark);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Customization</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
      borderRadius: 10,
      padding: 20,
      width: "80%",
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDark ? "#FFFFFF" : "#000000",
      marginBottom: 20,
    },
    closeButton: {
      backgroundColor: TIME_PICKER_COLORS.THERE,
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
    },
    closeButtonText: {
      color: "#FFFFFF",
      fontWeight: "bold",
    },
  });

export { CustomizationModal };
