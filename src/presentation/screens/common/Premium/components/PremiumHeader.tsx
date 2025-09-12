import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';
import { colors } from '../../../../../shared/constants/colors';
import { PremiumHeaderStyles as styles } from '../styles/PremiumHeader.styles';

/**
 * Premium Header Component
 * 
 * Header with back button, title and animated auto-renew switch
 */

interface PremiumHeaderProps {
  title: string;
  onBackPress: () => void;
  switchAnimation: Animated.Value;
  isSwitchVisible: boolean;
  onSwitchToggle: () => void;
  isDark: boolean;
}

export const PremiumHeader: React.FC<PremiumHeaderProps> = ({
  title,
  onBackPress,
  switchAnimation,
  isSwitchVisible,
  onSwitchToggle,
  isDark
}) => {
  const currentColors = isDark ? colors.dark : colors.light;

  return (
    <View style={[styles.header, isDark && styles.headerDark]}>
      <TouchableOpacity 
        onPress={onBackPress}
        style={styles.backButton}
      >
        <Ionicons 
          name="arrow-back" 
          size={24} 
          color={currentColors.primary} 
        />
      </TouchableOpacity>
      
      <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
        {title}
      </Text>

      {/* Auto-renew switch */}
      {isSwitchVisible ? (
        <TouchableOpacity
          style={[styles.autoRenewSwitch, isDark && styles.autoRenewSwitchDark]}
          onPress={onSwitchToggle}
          activeOpacity={0.8}
        >
          {/* Animated background */}
          <Animated.View
            style={[
              styles.autoRenewBackground,
              { opacity: switchAnimation }
            ]}
          />
          
          {/* Animated indicator */}
          <Animated.View
            style={[
              styles.autoRenewIndicator,
              {
                left: switchAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [4, 22],
                }),
              }
            ]}
          >
            <Animated.View
              style={[
                styles.autoRenewIcon,
                {
                  opacity: switchAnimation.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 0, 0],
                  }),
                }
              ]}
            >
              <Ionicons name="close" size={16} color="#EF4444" />
            </Animated.View>
            <Animated.View
              style={[
                styles.autoRenewIcon,
                {
                  opacity: switchAnimation.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 0, 1],
                  }),
                }
              ]}
            >
              <Ionicons name="refresh" size={16} color="#10B981" />
            </Animated.View>
          </Animated.View>
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
};
