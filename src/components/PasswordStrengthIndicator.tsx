import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { PasswordStrength, Validators } from '../utils/validators';
import { PasswordStrengthIndicatorStyles } from '../styles/components/PasswordStrengthIndicator.styles';

interface PasswordStrengthIndicatorProps {
  value?: string;
  strength?: PasswordStrength;
  showFeedback?: boolean;
  containerStyle?: ViewStyle;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  value,
  strength,
  showFeedback = true,
  containerStyle
}) => {
  // If no strength is provided, calculate it from the value
  const defaultStrength = { level: 'weak', score: 0, feedback: [] };
  const calculatedStrength = strength || (value ? Validators.getPasswordStrength(value) : defaultStrength);
  const finalStrength = calculatedStrength || defaultStrength;
  const { isDark } = useTheme();

  const getStrengthColor = (level: string) => {
    switch (level) {
      case 'weak': return '#DC2626';
      case 'medium': return '#F59E0B';
      case 'strong': return '#10B981';
      case 'very-strong': return '#059669';
      default: return '#6B7280';
    }
  };

  const getStrengthText = (level: string) => {
    switch (level) {
      case 'weak': return 'Слабый';
      case 'medium': return 'Средний';
      case 'strong': return 'Сильный';
      case 'very-strong': return 'Очень сильный';
      default: return 'Неизвестно';
    }
  };

  const getStrengthIcon = (level: string) => {
    switch (level) {
      case 'weak': return 'close-circle';
      case 'medium': return 'alert-circle';
      case 'strong': return 'checkmark-circle';
      case 'very-strong': return 'shield-checkmark';
      default: return 'help-circle';
    }
  };

  const getProgressBars = () => {
    const bars = [];
    const maxBars = 4;
    const filledBars = Math.ceil((finalStrength.score / 10) * maxBars);

    for (let i = 0; i < maxBars; i++) {
      const isFilled = i < filledBars;
      bars.push(
        <View
          key={i}
          style={[
            PasswordStrengthIndicatorStyles.progressBar,
            {
              backgroundColor: isFilled ? getStrengthColor(finalStrength.level) : isDark ? '#374151' : '#E5E7EB',
            }
          ]}
        />
      );
    }
    return bars;
  };

  return (
    <View style={[PasswordStrengthIndicatorStyles.container, containerStyle]}>
      <View style={PasswordStrengthIndicatorStyles.strengthRow}>
        <View style={PasswordStrengthIndicatorStyles.progressContainer}>
          {getProgressBars()}
        </View>
        <View style={PasswordStrengthIndicatorStyles.strengthInfo}>
          <Ionicons
            name={getStrengthIcon(finalStrength.level) as keyof typeof Ionicons.glyphMap}
            size={16}
            color={getStrengthColor(finalStrength.level)}
          />
          <Text style={[
            PasswordStrengthIndicatorStyles.strengthText,
            { color: getStrengthColor(finalStrength.level) }
          ]}>
            {getStrengthText(finalStrength.level)}
          </Text>
        </View>
      </View>

      {showFeedback && finalStrength.feedback.length > 0 && (
        <View style={PasswordStrengthIndicatorStyles.feedbackContainer}>
          {finalStrength.feedback.slice(0, 3).map((feedback, index) => (
            <View key={index} style={PasswordStrengthIndicatorStyles.feedbackItem}>
              <Ionicons
                name="information-circle-outline"
                size={14}
                color={isDark ? '#9CA3AF' : '#6B7280'}
              />
              <Text style={[
                PasswordStrengthIndicatorStyles.feedbackText,
                { color: isDark ? '#9CA3AF' : '#6B7280' }
              ]}>
                {String(feedback)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default PasswordStrengthIndicator; 