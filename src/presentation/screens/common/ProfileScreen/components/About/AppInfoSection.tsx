/**
 * AppInfoSection component
 * Application information display section
 */

import React from 'react';
import { View, Text, Image } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { lightColors, darkColors } from '../../../../../shared/constants/colors';
import { AboutScreenStyles as styles } from '../styles/AboutScreen.styles';

export const AppInfoSection: React.FC = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : lightColors;
  
  const appInfo = {
    name: 'FixDrive',
    version: '1.0.0',
    build: '2025.07.01',
    developer: t('about.developer')
  };

  return (
    <>
      <View style={styles.appInfo}>
        <View style={[styles.appIcon, { backgroundColor: currentColors.surface }]}>
          <Image 
            source={require('../../../../../assets/icon.png')} 
            style={styles.appLogo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.appTextContainer}>
          <Text style={[styles.appName, { color: currentColors.text }]}>
            {appInfo.name}
          </Text>
          <Text style={[styles.appVersion, { color: currentColors.textSecondary }]}>
            {t('about.byCompany')}
          </Text>
        </View>
      </View>
      
      <View style={styles.infoSection}>
        <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
          {t('about.information')}
        </Text>
        <View style={[styles.infoItem, { backgroundColor: currentColors.surface }]}>
          <Text style={[styles.infoLabel, { color: currentColors.textSecondary }]}>
            {t('about.version')}
          </Text>
          <Text style={[styles.infoValue, { color: currentColors.text }]}>
            {appInfo.version}
          </Text>
        </View>
        <View style={[styles.infoItem, { backgroundColor: currentColors.surface }]}>
          <Text style={[styles.infoLabel, { color: currentColors.textSecondary }]}>
            {t('about.build')}
          </Text>
          <Text style={[styles.infoValue, { color: currentColors.text }]}>
            {appInfo.build}
          </Text>
        </View>
        <View style={[styles.infoItem, { backgroundColor: currentColors.surface }]}>
          <Text style={[styles.infoLabel, { color: currentColors.textSecondary }]}>
            {t('about.developer')}
          </Text>
          <Text style={[styles.infoValue, { color: currentColors.text }]}>
            {appInfo.developer}
          </Text>
        </View>
      </View>
    </>
  );
};