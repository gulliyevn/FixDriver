import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProfileOptionStyles } from '../styles/components/ProfileOption.styles';

interface ProfileOptionProps {
  icon?: React.ReactNode;
  label: string;
  value?: string;
  color?: string;
  onPress?: () => void;
  logout?: boolean;
}

const ProfileOption: React.FC<ProfileOptionProps> = ({ icon, label, value, color = '#222', onPress, logout }) => {
  if (logout) {
    return (
      <TouchableOpacity style={ProfileOptionStyles.logout} onPress={onPress} activeOpacity={0.7}>
        <Text style={ProfileOptionStyles.logoutText}>{label}</Text>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity style={ProfileOptionStyles.option} onPress={onPress} activeOpacity={0.7} disabled={!onPress}>
      {icon && <View style={ProfileOptionStyles.iconWrap}>{icon}</View>}
      <Text style={[ProfileOptionStyles.label, { color }]}>{label}</Text>
      {value && <Text style={ProfileOptionStyles.value}>{value}</Text>}
      <Ionicons name="chevron-forward" size={20} color="#bbb" style={ProfileOptionStyles.arrow} />
    </TouchableOpacity>
  );
};

export default ProfileOption; 