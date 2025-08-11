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
      ...(isDark ? ProfileChildrenSectionStyles.cardDark : ProfileChildrenSectionStyles.cardLight),
    }}>
      <View style={ProfileChildrenSectionStyles.header}>
        <Text style={{
          ...ProfileChildrenSectionStyles.title,
          ...(isDark ? ProfileChildrenSectionStyles.titleDark : ProfileChildrenSectionStyles.titleLight),
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
          ...(isDark ? ProfileChildrenSectionStyles.childItemDark : ProfileChildrenSectionStyles.childItemLight),
        }}>
          <AppAvatar name={child.name} size={40} />
          <View style={ProfileChildrenSectionStyles.childInfo}>
            <Text style={{
              ...ProfileChildrenSectionStyles.childName,
              ...(isDark ? ProfileChildrenSectionStyles.childNameDark : ProfileChildrenSectionStyles.childNameLight),
            }}>
              {child.name}
            </Text>
            <Text style={{
              ...ProfileChildrenSectionStyles.childDetails,
              ...(isDark ? ProfileChildrenSectionStyles.childDetailsDark : ProfileChildrenSectionStyles.childDetailsLight),
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