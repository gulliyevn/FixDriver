import React from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../../../shared/hooks/useI18n';
import { styles } from '../styles/ChatScreen.styles';

/**
 * Profile Sheet Component
 * 
 * Bottom sheet showing driver profile information
 * Displays driver details, rating, and route information
 */

interface ProfileSheetProps {
  visible: boolean;
  onClose: () => void;
  chatName: string;
  driverCar?: string;
  driverNumber?: string;
  driverRating: string;
  driverStatus: 'online' | 'offline';
  isDark: boolean;
}

export const ProfileSheet: React.FC<ProfileSheetProps> = ({
  visible,
  onClose,
  chatName,
  driverCar,
  driverNumber,
  driverRating,
  driverStatus,
  isDark,
}) => {
  const { t } = useI18n();

  if (!visible) return null;

  const headerDetails = [driverCar, driverNumber].filter(Boolean).join(' · ');

  return (
    <View style={styles.callSheetOverlay}>
      <Pressable style={styles.callSheetBackdrop} onPress={onClose} />
      <View style={[styles.callSheetContainer, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
        <TouchableOpacity 
          style={styles.callSheetClose} 
          onPress={onClose} 
          accessibilityLabel={t('common.close')}
        >
          <Ionicons name="close" size={22} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
        <View style={[styles.callSheetHandle, { backgroundColor: isDark ? '#333' : '#ccc' }]} />
        
        <View style={styles.profileHeaderRow}>
          <View style={[styles.profileAvatarLarge, { backgroundColor: isDark ? '#333' : '#e0e0e0' }]}>
            <Ionicons name="person" size={28} color={isDark ? '#fff' : '#666'} />
            <View style={driverStatus === 'online' ? styles.headerOnlineIndicator : styles.headerOfflineIndicator} />
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.profileNameRow}>
              <Text style={[styles.profileName, { color: isDark ? '#fff' : '#000' }]}>
                {chatName}
              </Text>
              <View style={[styles.profileRating, { backgroundColor: isDark ? '#333' : '#e0e0e0' }]}>
                <Text style={[styles.profileRatingText, { color: isDark ? '#fff' : '#000' }]}>
                  {driverRating}
                </Text>
              </View>
            </View>
            <Text style={[styles.profileSubline, { color: isDark ? '#ccc' : '#666' }]}>
              {headerDetails}
            </Text>
          </View>
        </View>
        
        <View style={[styles.profileDivider, { backgroundColor: isDark ? '#333' : '#e0e0e0' }]} />
        
        <View style={styles.routeList}>
          <View style={styles.routeItem}>
            <View style={styles.routeLeft}>
              <View style={[styles.dotGreen, { backgroundColor: '#4caf50' }]} />
              <Text style={[styles.routeText, { color: isDark ? '#fff' : '#000' }]}>
                {t('chat.routeStart')}
              </Text>
            </View>
            <Text style={[styles.routeTime, { color: isDark ? '#ccc' : '#666' }]}>08:00</Text>
          </View>
          
          <View style={styles.routeItem}>
            <View style={styles.routeLeft}>
              <View style={[styles.dotBlue, { backgroundColor: '#2196f3' }]} />
              <Text style={[styles.routeText, { color: isDark ? '#fff' : '#000' }]}>
                {t('chat.routeOffice')}
              </Text>
            </View>
            <Text style={[styles.routeTime, { color: isDark ? '#ccc' : '#666' }]}>09:15</Text>
          </View>
          
          <View style={styles.routeItem}>
            <View style={styles.routeLeft}>
              <Ionicons name="location" size={18} color={isDark ? '#fff' : '#000'} />
              <Text style={[styles.routeText, { color: isDark ? '#fff' : '#000' }]}>
                {t('chat.routeEnd')}
              </Text>
            </View>
            <Text style={[styles.routeTime, { color: isDark ? '#ccc' : '#666' }]}>18:30</Text>
          </View>
        </View>
        
        <View style={styles.bottomInfoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar" size={18} color={isDark ? '#9CA3AF' : '#6B7280'} />
            <Text style={[styles.infoText, { color: isDark ? '#ccc' : '#666' }]}>
              {t('chat.schedule')}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="diamond" size={18} color={isDark ? '#9CA3AF' : '#6B7280'} />
            <Text style={[styles.infoText, { color: isDark ? '#ccc' : '#666' }]}>
              {t('chat.premium')}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={[styles.infoText, { color: isDark ? '#ccc' : '#666' }]}>
              {t('chat.stops')}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
