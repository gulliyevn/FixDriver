import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProfileHeaderStyles } from '../styles/components/ProfileHeader.styles';

interface ProfileHeaderProps {
  name: string;
  phone: string;
  color?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, phone, color = '#27ae60' }) => (
  <View style={ProfileHeaderStyles.header}>
    <View style={[ProfileHeaderStyles.avatar, { backgroundColor: color }]}> 
      <Ionicons name="person" size={40} color="#fff" />
    </View>
    <View style={ProfileHeaderStyles.info}>
      <Text style={ProfileHeaderStyles.name}>{name}</Text>
      <Text style={ProfileHeaderStyles.phone}>{phone}</Text>
    </View>
  </View>
);

export default ProfileHeader; 