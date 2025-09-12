import React from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';
import { useAuth } from '../../../../context/AuthContext';
import { createOrdersMapScreenStyles } from '../../../../styles/screens/OrdersMapScreen.styles';

interface MapControlsProps {
  isDark: boolean;
  isSettingsExpanded: boolean;
  isRefreshing: boolean;
  isClientLocationActive: boolean;
  settingsRotate: Animated.AnimatedInterpolation<string | number>;
  settingsPanelWidth: Animated.AnimatedInterpolation<string | number>;
  settingsPanelOpacity: Animated.AnimatedInterpolation<string | number>;
  onSettingsPress: () => void;
  onRefreshMap: () => void;
  onClientLocationToggle: () => void;
  onReportPress: () => void;
  onLocatePress: () => void;
  onLayersPress: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onSimpleDialogOpen: () => void;
  onChevronPress: () => void;
  onSharePress: () => void;
  canShare?: boolean;
}

const MapControls: React.FC<MapControlsProps> = ({
  isDark,
  isSettingsExpanded,
  isRefreshing,
  isClientLocationActive,
  settingsRotate,
  settingsPanelWidth,
  settingsPanelOpacity,
  onSettingsPress,
  onRefreshMap,
  onClientLocationToggle,
  onReportPress,
  onLocatePress,
  onLayersPress,
  onZoomIn,
  onZoomOut,
  onSimpleDialogOpen,
  onChevronPress,
  onSharePress,
  canShare = true,
}) => {
  const { user } = useAuth();
  const styles = createOrdersMapScreenStyles(isDark);

  return (
    <>
      {/* Кнопка сверху слева */}
      <TouchableOpacity
        style={styles.topLeftButton}
        onPress={onSimpleDialogOpen}
        accessibilityLabel="Simple dialog"
      >
        <View style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: '#DC2626',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Ionicons
            name="shield"
            size={16}
            color="#FFFFFF"
            style={{ marginTop: -1 }}
          />
        </View>
      </TouchableOpacity>

      {/* Кнопка сверху справа - поделиться */}
      <TouchableOpacity
        style={[styles.topRightButton, !canShare && { opacity: 0.5 }]}
        onPress={onSharePress}
        accessibilityLabel="Share"
        disabled={!canShare}
      >
        <Ionicons
          name="share-outline"
          size={20}
          color={isDark ? '#F9FAFB' : '#111827'}
        />
      </TouchableOpacity>
      
      {/* Кнопки управления вертикально внизу справа */}
      <View style={styles.bottomButtonsContainer}>
        {/* Кнопка настроек */}
        <View style={{ position: 'relative' }}>
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={onSettingsPress}
            accessibilityLabel="Settings"
          >
            <Animated.View style={{ transform: [{ rotate: settingsRotate }] }}>
              <Ionicons
                name="settings-outline"
                size={22}
                color={isDark ? '#F9FAFB' : '#111827'}
              />
            </Animated.View>
          </TouchableOpacity>
          
          {/* Выпадающая панель настроек */}
          <Animated.View
            style={[
              styles.settingsPanel,
              {
                width: settingsPanelWidth,
                opacity: settingsPanelOpacity,
                right: 0,
                bottom: 60,
              }
            ]}
          >
            <TouchableOpacity 
              style={[styles.settingsButton, isRefreshing && { opacity: 0.5 }]}
              onPress={onRefreshMap}
              disabled={isRefreshing}
            >
              <Ionicons 
                name="refresh-outline" 
                size={18} 
                color={isDark ? '#F9FAFB' : '#111827'} 
              />
            </TouchableOpacity>
            
            {user?.role === 'client' ? (
              <TouchableOpacity 
                style={[
                  styles.settingsButton, 
                  isClientLocationActive && { backgroundColor: isDark ? '#10B981' : '#10B981' }
                ]}
                onPress={onClientLocationToggle}
              >
                <Ionicons 
                  name="location-sharp" 
                  size={18} 
                  color={
                    isClientLocationActive 
                      ? '#FFFFFF' 
                      : (isDark ? '#F9FAFB' : '#111827')
                  } 
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.settingsButton}
                onPress={onReportPress}
              >
                <Ionicons 
                  name="warning" 
                  size={18} 
                  color={isDark ? '#F9FAFB' : '#111827'}
                />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={onLocatePress}
            >
              <Ionicons name="locate-outline" size={18} color={isDark ? '#F9FAFB' : '#111827'} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={onLayersPress}
            >
              <Ionicons name="layers-outline" size={18} color={isDark ? '#F9FAFB' : '#111827'} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={onZoomIn}
            >
              <Ionicons name="add-outline" size={18} color={isDark ? '#F9FAFB' : '#111827'} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={onZoomOut}
            >
              <Ionicons name="remove-outline" size={18} color={isDark ? '#F9FAFB' : '#111827'} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
      
      {/* Кнопка меню слева */}
      <TouchableOpacity
        style={styles.leftButton}
        onPress={onChevronPress}
        accessibilityLabel="Menu"
      >
        <Ionicons
          name="chevron-up"
          size={22}
          color={isDark ? '#F9FAFB' : '#111827'}
        />
      </TouchableOpacity>
    </>
  );
};

export default MapControls;
