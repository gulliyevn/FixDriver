import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { FamilySectionStyles as styles, getFamilySectionColors } from '../../styles/components/profile/FamilySection.styles';

interface FamilyMember {
  id: string;
  name: string;
  type: string;
  age: number;
}

interface FamilySectionProps {
  familyMembers: FamilyMember[];
  expandedFamilyMember: string | null;
  onToggleFamilyMember: (memberId: string) => void;
  onOpenAddFamilyModal: () => void;
}

const FamilySection: React.FC<FamilySectionProps> = ({
  familyMembers,
  expandedFamilyMember,
  onToggleFamilyMember,
  onOpenAddFamilyModal,
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const dynamicStyles = getFamilySectionColors(isDark);

  return (
    <View style={styles.familySection}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
          {t('profile.familyInfo')}
        </Text>
        <TouchableOpacity 
          style={[styles.addIconButton, dynamicStyles.addIconButton]}
          onPress={onOpenAddFamilyModal}
        >
          <Ionicons name="add" size={20} color={isDark ? '#3B82F6' : '#083198'} />
        </TouchableOpacity>
      </View>
      
      {familyMembers.map((member) => (
        <View key={member.id}>
          <TouchableOpacity 
            style={[styles.familyItem, dynamicStyles.familyItem]}
            onPress={() => onToggleFamilyMember(member.id)}
            activeOpacity={0.7}
          >
            <View style={styles.familyInfo}>
              <Text style={[styles.familyName, dynamicStyles.familyName]}>
                {member.name}
              </Text>
              <Text style={[styles.familyType, dynamicStyles.familyType]}>
                {t(`profile.familyTypes.${member.type}`)} • {member.age} {t('profile.years')}
              </Text>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={dynamicStyles.familyType.color}
              style={[
                styles.familyIcon,
                expandedFamilyMember === member.id && styles.familyIconExpanded
              ]}
            />
          </TouchableOpacity>
          
          {expandedFamilyMember === member.id && (
            <View style={[styles.familyExpandedContent, dynamicStyles.familyExpandedContent]}>
              <Text style={[styles.familyExpandedText, dynamicStyles.familyExpandedText]}>
                {t('profile.familyDetails')}: {member.name} - {t(`profile.familyTypes.${member.type}`)}, {member.age} {t('profile.years')}
              </Text>
              <TouchableOpacity style={[styles.editFamilyButton, dynamicStyles.editFamilyButton]}>
                <Text style={[styles.editFamilyButtonText, dynamicStyles.editFamilyButtonText]}>
                  {t('profile.editFamilyMember')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
      
      <TouchableOpacity style={[styles.addFamilyButton, dynamicStyles.addFamilyButton]}>
        <Text style={[styles.addFamilyText, dynamicStyles.addFamilyText]}>
          {t('profile.addFamilyMember')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FamilySection; 