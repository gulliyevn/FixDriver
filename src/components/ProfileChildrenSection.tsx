import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppAvatar from './AppAvatar';
import AppCard from './AppCard';
import { useTheme } from '../context/ThemeContext';

interface Child {
  id: string;
  name: string;
  age: number;
  school?: string;
  avatar?: string;
}

interface ProfileChildrenSectionProps {
  children: Child[];
  onAddChild: () => void;
  onEditChild: (child: Child) => void;
}

const ProfileChildrenSection: React.FC<ProfileChildrenSectionProps> = ({
  children,
  onAddChild,
  onEditChild,
}) => {
  const { isDark } = useTheme();

  return (
    <AppCard style={{
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      margin: 16,
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
      }}>
        <Text style={{
          fontSize: 18,
          fontWeight: '600',
          color: isDark ? '#F9FAFB' : '#1F2937',
        }}>
          Дети под опекой
        </Text>
        <TouchableOpacity onPress={onAddChild}>
          <Ionicons name="add-circle" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
      
      {children.map((child) => (
        <View key={child.id} style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? '#374151' : '#F3F4F6',
        }}>
          <AppAvatar name={child.name} size={40} />
          <View style={{
            flex: 1,
            marginLeft: 12,
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '500',
              color: isDark ? '#F9FAFB' : '#1F2937',
              marginBottom: 2,
            }}>
              {child.name}
            </Text>
            <Text style={{
              fontSize: 14,
              color: isDark ? '#9CA3AF' : '#6B7280',
            }}>
              {child.age} лет • {child.school}
            </Text>
          </View>
          <TouchableOpacity onPress={() => onEditChild(child)}>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
        </View>
      ))}
    </AppCard>
  );
};

export default ProfileChildrenSection; 