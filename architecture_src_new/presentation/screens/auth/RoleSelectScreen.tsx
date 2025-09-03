import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Animated, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../shared/i18n';
import { Button, LanguageSelector, LanguageButton } from '../../components';
import { RoleSelectScreenStyles } from './RoleSelectScreen.styles';

type Role = 'client' | 'driver';

interface RoleSelectScreenProps {
  navigation?: any;
}

const RoleSelectScreen: React.FC<RoleSelectScreenProps> = ({ navigation: propNavigation }) => {
  const navigation = propNavigation || useNavigation();
  const [langModal, setLangModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('client');
  const { t } = useI18n();
  
  // Используем простые стили
  const styles = RoleSelectScreenStyles;

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    navigation.navigate('Register' as never, { role: selectedRole } as never);
  };

  const handleLogin = () => {
    navigation.navigate('Login' as never);
  };

  const getRoleFeatures = (role: Role) => {
    if (role === 'client') {
      return [
        { icon: 'shield-checkmark', text: t('auth.roleSelect.clientSafe'), color: '#10B981' },
        { icon: 'location', text: t('auth.roleSelect.clientTracking'), color: '#10B981' },
        { icon: 'card', text: t('auth.roleSelect.clientPayment'), color: '#10B981' },
      ];
    } else {
      return [
        { icon: 'time', text: t('auth.roleSelect.driverFlexible'), color: '#3B82F6' },
        { icon: 'cash', text: t('auth.roleSelect.driverIncome'), color: '#3B82F6' },
        { icon: 'call', text: t('auth.roleSelect.driverSupport'), color: '#3B82F6' },
      ];
    }
  };

  const getRoleInfo = (role: Role) => {
    if (role === 'client') {
      return {
        title: t('auth.roleSelect.clientTitle'),
        subtitle: t('auth.roleSelect.clientSubtitle'),
        icon: 'person',
        color: '#10B981',
        gradient: ['#10B981', '#059669'],
      };
    } else {
      return {
        title: t('auth.roleSelect.driverTitle'),
        subtitle: t('auth.roleSelect.driverSubtitle'),
        icon: 'car',
        color: '#3B82F6',
        gradient: ['#3B82F6', '#2563EB'],
      };
    }
  };

  const currentRoleInfo = getRoleInfo(selectedRole);
  const currentFeatures = getRoleFeatures(selectedRole);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Top spacer */}
        <View style={styles.spacerTop} />

        {/* Logo in center */}
        <View style={styles.headerLogo}>
          <View style={styles.logoContainer}>
            <Image source={require('../../../../assets/icon.png')} style={styles.logoIcon} />
            <View style={styles.logoTextContainer}>
              <Text style={styles.logoText}>FixDrive</Text>
              <Text style={styles.logoSubtext}>by Axivion LLC</Text>
            </View>
          </View>
        </View>

        {/* Spacer under logo */}
        <View style={styles.spacerLogoBottom} />

        {/* Role Selector Card */}
        <View style={styles.card}>
          {/* Role Toggle */}
          <View style={styles.roleToggle}>
            <TouchableOpacity
              style={[
                styles.roleToggleButton,
                selectedRole === 'client' && styles.roleToggleButtonActive,
                selectedRole === 'client' && { backgroundColor: '#10B981' }
              ]}
              onPress={() => handleRoleSelect('client')}
            >
              <Ionicons 
                name="person" 
                size={20} 
                color={selectedRole === 'client' ? '#FFFFFF' : '#64748B'} 
              />
              <Text style={[
                styles.roleToggleText,
                selectedRole === 'client' && styles.roleToggleTextActive
              ]}>
                {t('auth.roleSelect.clientTitle')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.roleToggleButton,
                selectedRole === 'driver' && styles.roleToggleButtonActive,
                selectedRole === 'driver' && { backgroundColor: '#3B82F6' }
              ]}
              onPress={() => handleRoleSelect('driver')}
            >
              <Ionicons 
                name="car" 
                size={20} 
                color={selectedRole === 'driver' ? '#FFFFFF' : '#64748B'} 
              />
              <Text style={[
                styles.roleToggleText,
                selectedRole === 'driver' && styles.roleToggleTextActive
              ]}>
                {t('auth.roleSelect.driverTitle')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Selected Role Content */}
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              {currentRoleInfo.title}
            </Text>
            <Text style={styles.cardSubtitle}>
              {currentRoleInfo.subtitle}
            </Text>
          </View>
          
          <View style={styles.cardContent}>
            {currentFeatures.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: `${feature.color}15` }]}>
                  <Ionicons name={feature.icon as any} size={16} color={feature.color} />
                </View>
                <Text style={styles.featureText}>
                  {feature.text}
                </Text>
              </View>
            ))}
          </View>

          <Button
            title={t('auth.roleSelect.choose')}
            onPress={handleContinue}
            style={StyleSheet.flatten([
              styles.chooseBtn, 
              { backgroundColor: currentRoleInfo.color }
            ])}
            textStyle={styles.chooseBtnText}
            icon="arrow-forward"
            iconPosition="right"
          />
        </View>

        {/* Login Link */}
        <View style={styles.loginRow}> 
          <Text style={styles.loginText}>
            {t('auth.roleSelect.alreadyAccount')}
          </Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.loginLink}>
              {t('auth.roleSelect.login')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Spacer between login and language button */}
        <View style={styles.spacerLoginLang} />

        {/* Language Button */}
        <View style={styles.langWrap}>
          <LanguageButton 
            onPress={() => setLangModal(true)}
            size="small"
          />
        </View>

        {/* Bottom spacer */}
        <View style={styles.spacerBottom} />

      {/* Language Selector Modal */}
      <LanguageSelector 
        visible={langModal} 
        onClose={() => setLangModal(false)} 
      />
    </SafeAreaView>
  );
};

export default RoleSelectScreen;
