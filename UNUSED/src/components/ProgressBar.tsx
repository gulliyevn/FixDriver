import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { ProgressBarStyles } from '../styles/components/ProgressBar.styles';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  label = 'Прогресс', 
  showPercentage = true 
}) => {
  const { isDark } = useTheme();
  
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <View style={ProgressBarStyles.container}>
      <View style={ProgressBarStyles.header}>
        <Text style={[ProgressBarStyles.label, { color: isDark ? '#fff' : '#000' }]}>
          {label}
        </Text>
        {showPercentage && (
          <Text style={[ProgressBarStyles.percentage, { color: isDark ? '#fff' : '#000' }]}>
            {clampedProgress}%
          </Text>
        )}
      </View>
      
      <View style={[ProgressBarStyles.progressContainer, { backgroundColor: isDark ? '#555' : '#f0f0f0' }]}>
        <View 
          style={[
            ProgressBarStyles.progressBar, 
            { 
              width: `${clampedProgress}%`,
              backgroundColor: getProgressColor(clampedProgress)
            }
          ]} 
        />
      </View>
    </View>
  );
};

const getProgressColor = (progress: number): string => {
  if (progress >= 80) return '#34C759'; // Зеленый
  if (progress >= 60) return '#FF9500'; // Оранжевый
  if (progress >= 40) return '#FF9F0A'; // Желтый
  return '#FF3B30'; // Красный
};

export default ProgressBar; 