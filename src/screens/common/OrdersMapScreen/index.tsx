import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import { createOrdersMapScreenStyles } from '../../../styles/screens/OrdersMapScreen.styles';
import MapViewComponent from '../../../components/MapView';

// Импорты из новой структуры
import { useOrdersMapState } from './hooks/useOrdersMapState';
import { useMapControls } from './hooks/useMapControls';
import { useMapSettings } from './hooks/useMapSettings';
import MapControlsComponent from './components/MapControls';
import ReportModal from './components/ReportModal';
import SimpleDialog from './components/SimpleDialog';

const OrdersMapScreen: React.FC = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { t } = useLanguage();
  const styles = useMemo(() => createOrdersMapScreenStyles(isDark), [isDark]);

  // Используем созданные хуки
  const [state, actions] = useOrdersMapState();
  const { mapRef, ...handlers } = useMapControls(state, actions);
  const settings = useMapSettings(actions);

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapViewComponent 
          ref={mapRef}
          key={state.mapRefreshKey}
          initialLocation={state.currentLocation}
          onDriverVisibilityToggle={handlers.handleDriverVisibilityToggle}
          role={user?.role === 'driver' ? 'driver' : 'client'}
          clientLocationActive={state.isClientLocationActive}
          isDriverModalVisible={state.isDriverModalVisible}
          onDriverModalClose={handlers.handleDriverModalClose}
          mapType={state.mapType}
        />

        <MapControlsComponent
          isDark={isDark}
          isSettingsExpanded={state.isSettingsExpanded}
          isRefreshing={state.isRefreshing}
          isClientLocationActive={state.isClientLocationActive}
          settingsRotate={settings.settingsRotate}
          settingsPanelWidth={settings.settingsPanelWidth}
          settingsPanelOpacity={settings.settingsPanelOpacity}
          onSettingsPress={settings.handleSettingsPress}
          onRefreshMap={handlers.handleRefreshMap}
          onClientLocationToggle={handlers.handleClientLocationToggle}
          onReportPress={handlers.handleReportPress}
          onLocatePress={handlers.handleLocatePress}
          onLayersPress={handlers.handleLayersPress}
          onZoomIn={handlers.handleZoomIn}
          onZoomOut={handlers.handleZoomOut}
          onSimpleDialogOpen={() => actions.setIsSimpleDialogVisible(true)}
          onChevronPress={handlers.handleChevronPress}
        />
      </View>

      {/* Модалка репорта */}
      <ReportModal
        isVisible={state.isReportModalVisible}
        reportComment={state.reportComment}
        onCommentChange={actions.setReportComment}
        onSubmit={handlers.handleReportSubmit}
        onCancel={handlers.handleReportCancel}
      />

      {/* Простой диалог Да/Нет */}
      <SimpleDialog
        isVisible={state.isSimpleDialogVisible}
        title={t('common.emergency.title')}
        message={t('common.emergency.message')}
        onYes={handlers.handleSimpleDialogYes}
        onNo={handlers.handleSimpleDialogNo}
      />
    </View>
  );
};

export default OrdersMapScreen;
