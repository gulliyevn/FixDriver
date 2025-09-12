/**
 * PasswordStrengthIndicator component
 * Shows password strength with visual feedback
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { SettingsScreenStyles as styles } from '../styles/SettingsScreen.styles';
import { lightColors, darkColors } from '../../../../../../shared/constants/colors';

interface PasswordStrengthIndicatorProps {
  value: string;
  showFeedback?: boolean;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ 
  value, 
  showFeedback = false 
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : lightColors;

  const getPasswordStrength = (password: string) => {
    let score = 0;
    const feedback: string[] = [];

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push(t('password.feedback.length'));
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push(t('password.feedback.lowercase'));
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push(t('password.feedback.uppercase'));
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push(t('password.feedback.number'));
    }

    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      score += 1;
    } else {
      feedback.push(t('password.feedback.special'));
    }

    return { score, feedback };
  };

  const { score, feedback } = getPasswordStrength(value);

  const getStrengthLevel = (score: number) => {
    if (score <= 2) return { level: 'weak', color: currentColors.error, text: t('password.strength.weak') };
    if (score <= 3) return { level: 'medium', color: '#f59e0b', text: t('password.strength.medium') };
    if (score <= 4) return { level: 'good', color: '#10b981', text: t('password.strength.good') };
    return { level: 'strong', color: currentColors.success || '#059669', text: t('password.strength.strong') };
  };

  const { level, color, text } = getStrengthLevel(score);

  if (!value) return null;

  return (
    <View style={styles.passwordStrengthContainer}>
      {/* Strength Bar */}
      <View style={[styles.strengthBar, { backgroundColor: currentColors.border }]}>
        <View 
          style={[
            styles.strengthBarFill, 
            { 
              width: `${(score / 5) * 100}%`, 
              backgroundColor: color 
            }
          ]} 
        />
      </View>

      {/* Strength Text */}
      <Text style={[styles.strengthText, { color }]}>
        {text}
      </Text>

      {/* Feedback */}
      {showFeedback && feedback.length > 0 && (
        <View style={styles.feedbackContainer}>
          {feedback.map((item, index) => (
            <Text key={index} style={[styles.feedbackText, { color: currentColors.textSecondary }]}>
              • {item}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};
