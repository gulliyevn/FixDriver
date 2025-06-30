import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProfileHeaderProps {
  name: string;
  phone: string;
  color?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, phone, color = '#27ae60' }) => (
  <View style={styles.header}>
    <View style={[styles.avatar, { backgroundColor: color }]}> 
      <Ionicons name="person" size={40} color="#fff" />
    </View>
    <View style={styles.info}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.phone}>{phone}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  avatar: {
    width: 64, height: 64, borderRadius: 32,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 16,
  },
  info: { flex: 1 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  phone: { fontSize: 15, color: '#888', marginTop: 2 },
});
export default ProfileHeader; 