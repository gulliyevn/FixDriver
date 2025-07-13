import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppAvatar from './AppAvatar';
import AppCard from './AppCard';
import { useTheme } from '../context/ThemeContext';
import { ProfileChildrenSectionStyles } from '../styles/components/ProfileChildrenSection.styles';

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
      ...ProfileChildrenSectionStyles.card,
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
    }}>
      <View style={ProfileChildrenSectionStyles.header}>
        <Text style={{
          ...ProfileChildrenSectionStyles.title,
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
          ...ProfileChildrenSectionStyles.childItem,
          borderBottomColor: isDark ? '#374151' : '#F3F4F6',
        }}>
          <AppAvatar name={child.name} size={40} />
          <View style={ProfileChildrenSectionStyles.childInfo}>
            <Text style={{
              ...ProfileChildrenSectionStyles.childName,
              color: isDark ? '#F9FAFB' : '#1F2937',
            }}>
              {child.name}
            </Text>
            <Text style={{
              ...ProfileChildrenSectionStyles.childDetails,
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