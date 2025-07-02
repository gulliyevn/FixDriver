import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { PasswordStrength } from '../utils/validators';

interface PasswordStrengthIndicatorProps {
  strength: PasswordStrength;
  showFeedback?: boolean;
  containerStyle?: any;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  strength,
  showFeedback = true,
  containerStyle
}) => {
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
    const filledBars = Math.ceil((strength.score / 10) * maxBars);

    for (let i = 0; i < maxBars; i++) {
      const isFilled = i < filledBars;
      bars.push(
        <View
          key={i}
          style={[
            styles.progressBar,
            {
              backgroundColor: isFilled ? getStrengthColor(strength.level) : isDark ? '#374151' : '#E5E7EB',
            }
          ]}
        />
      );
    }
    return bars;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.strengthRow}>
        <View style={styles.progressContainer}>
          {getProgressBars()}
        </View>
        <View style={styles.strengthInfo}>
          <Ionicons
            name={getStrengthIcon(strength.level) as any}
            size={16}
            color={getStrengthColor(strength.level)}
          />
          <Text style={[
            styles.strengthText,
            { color: getStrengthColor(strength.level) }
          ]}>
            {getStrengthText(strength.level)}
          </Text>
        </View>
      </View>

      {showFeedback && strength.feedback.length > 0 && (
        <View style={styles.feedbackContainer}>
          {strength.feedback.slice(0, 3).map((feedback, index) => (
            <View key={index} style={styles.feedbackItem}>
              <Ionicons
                name="information-circle-outline"
                size={14}
                color={isDark ? '#9CA3AF' : '#6B7280'}
              />
              <Text style={[
                styles.feedbackText,
                { color: isDark ? '#9CA3AF' : '#6B7280' }
              ]}>
                {feedback}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressContainer: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 12,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginRight: 4,
  },
  strengthInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  feedbackContainer: {
    marginTop: 8,
  },
  feedbackItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  feedbackText: {
    fontSize: 12,
    marginLeft: 6,
    flex: 1,
    lineHeight: 16,
  },
});

export default PasswordStrengthIndicator; 