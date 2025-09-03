import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../../core/context/ThemeContext';
import { useI18n } from '../../../../shared/i18n';

// Импорт стилей
import { createMapScreenStyles } from './styles/MapScreen.styles';

const MapScreen: React.FC = () => {
  const { isDark } = useTheme();
  const { t } = useI18n();

  const styles = useMemo(() => createMapScreenStyles(isDark), [isDark]);

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        {/* Простая заглушка карты для тестирования */}
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapPlaceholderText}>🗺️ Карта</Text>
          <Text style={styles.mapPlaceholderSubtext}>
            Координаты: 55.7558, 37.6176 (Москва)
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MapScreen;
