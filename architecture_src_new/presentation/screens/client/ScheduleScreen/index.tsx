import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../../core/context/ThemeContext';
import { useAuth } from '../../../../core/context/AuthContext';
import { useI18n } from '../../../../shared/i18n';
import { createScheduleScreenStyles } from './styles/ScheduleScreen.styles';
import FixDriveScreen from './FixDriveScreen';

export type ScheduleType = 'fixdrive' | 'fixwave';

const ScheduleScreen: React.FC = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { t } = useI18n();
  const styles = createScheduleScreenStyles(isDark);
  
  const [scheduleType, setScheduleType] = useState<ScheduleType>('fixdrive');

  const handleScheduleTypeChange = (type: ScheduleType) => {
    setScheduleType(type);
  };

  const renderScheduleTypeSelector = () => (
    <View style={styles.typeSelector}>
      <TouchableOpacity
        style={[
          styles.typeButton,
          scheduleType === 'fixdrive' && styles.typeButtonActive
        ]}
        onPress={() => handleScheduleTypeChange('fixdrive')}
      >
        <Text style={[
          styles.typeButtonText,
          scheduleType === 'fixdrive' && styles.typeButtonTextActive
        ]}>
          {t('schedule.fixdrive.title') || 'FixDrive'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.typeButton,
          scheduleType === 'fixwave' && styles.typeButtonActive
        ]}
        onPress={() => handleScheduleTypeChange('fixwave')}
      >
        <Text style={[
          styles.typeButtonText,
          scheduleType === 'fixwave' && styles.typeButtonTextActive
        ]}>
          {t('schedule.fixwave.title') || 'FixWave'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderScheduleContent = () => {
    return <FixDriveScreen isFixWave={scheduleType === 'fixwave'} />;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {t('schedule.title') || 'Расписание'}
        </Text>
        {renderScheduleTypeSelector()}
      </View>
      
      <View style={styles.content}>
        {renderScheduleContent()}
      </View>
    </SafeAreaView>
  );
};

export default ScheduleScreen;
