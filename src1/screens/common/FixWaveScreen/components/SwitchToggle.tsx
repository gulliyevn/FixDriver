import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { styles } from './SwitchToggle.styles';

interface SwitchToggleProps {
  isActive: boolean;
  onToggle: () => void;
  colors: any;
}

export const SwitchToggle: React.FC<SwitchToggleProps> = ({ isActive, onToggle, colors }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.switchContainer,
        {
          backgroundColor: isActive ? colors.success : colors.surface,
          borderColor: isActive ? colors.success : colors.border,
        }
      ]}
      onPress={onToggle}
    >
      <View style={[
        styles.switchThumb,
        {
          backgroundColor: isActive ? '#FFFFFF' : colors.primary,
          left: isActive ? 46 : 2,
        }
      ]} />
    </TouchableOpacity>
  );
};
