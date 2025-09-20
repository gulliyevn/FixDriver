import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../../../core/context/ThemeContext';
import { getCurrentColors } from '../../../../../../shared/constants/colors';
import { ProgressStep, FixDrivePage } from '../types/fix-drive.types';
import { getProgressSteps } from '../utils/progressUtils';

interface ProgressBarProps {
  currentPage: string;
  onStepPress?: (page: FixDrivePage) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentPage, onStepPress }) => {
  const { isDark } = useTheme();
  const colors = getCurrentColors(isDark);
  const steps = getProgressSteps(currentPage as any);

  const handleStepPress = (step: ProgressStep) => {
    // Можно кликать только на завершенные шаги (зеленые)
    if (step.isCompleted && onStepPress) {
      onStepPress(step.id);
    }
  };

  return (
    <View style={{ 
      flexDirection: 'row', 
      justifyContent: 'space-around', 
      alignItems: 'center',
      paddingTop: 0,
      paddingBottom: 8
    }}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          {/* Круг с иконкой */}
          <TouchableOpacity 
            style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 20,
              backgroundColor: step.isCompleted ? colors.success : 
                             step.isActive ? colors.primary : colors.textSecondary,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
            onPress={() => handleStepPress(step)}
            disabled={!step.isCompleted}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={step.icon as any} 
              size={18} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>
          
          {/* Прогресс бар между кругами */}
          {index < steps.length - 1 && (
            <View style={{ 
              flex: 1, 
              height: 2, 
              backgroundColor: '#E0E0E0', 
              borderRadius: 1,
              marginHorizontal: 10,
              overflow: 'hidden'
            }}>
              <View style={{ 
                height: '100%', 
                width: steps[index].isCompleted ? '100%' : '0%', 
                backgroundColor: colors.success,
                borderRadius: 1
              }} />
            </View>
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

export default ProgressBar;
