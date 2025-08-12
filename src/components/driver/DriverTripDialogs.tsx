import React from 'react';
import { Modal, TouchableOpacity, Text, View } from 'react-native';
import { t } from '../../i18n';

export type DriverTripDialogsProps = {
  styles: any;
  clientName: string;
  // Start trip
  showStart: boolean;
  onStartCancel: () => void;
  onStartOk: () => void;
  // Waiting
  showWaiting: boolean;
  onWaitingCancel: () => void;
  onWaitingOk: () => void;
  // End trip
  showEnd: boolean;
  onEndCancel: () => void;
  onEndOk: () => void;
  // Emergency long press
  showEmergency: boolean;
  onEmergencyStop: () => void;
  onEmergencyEnd: () => void;
  onEmergencyClose: () => void;
  // Stop dialog
  showStop: boolean;
  onStopCancel: () => void;
  onStopOk: () => void;
  // Force end dialog
  showForceEnd: boolean;
  onForceEndCancel: () => void;
  onForceEndOk: () => void;
  // Continue dialog
  showContinue: boolean;
  onContinueCancel: () => void;
  onContinueOk: () => void;
};

const DriverTripDialogs: React.FC<DriverTripDialogsProps> = ({
  styles,
  clientName,
  showStart,
  onStartCancel,
  onStartOk,
  showWaiting,
  onWaitingCancel,
  onWaitingOk,
  showEnd,
  onEndCancel,
  onEndOk,
  showEmergency,
  onEmergencyStop,
  onEmergencyEnd,
  onEmergencyClose,
  showStop,
  onStopCancel,
  onStopOk,
  showForceEnd,
  onForceEndCancel,
  onForceEndOk,
  showContinue,
  onContinueCancel,
  onContinueOk,
}) => {
  return (
    <>
      {/* Start trip */}
      <Modal visible={showStart} transparent animationType="fade">
        <TouchableOpacity style={styles.dialogOverlay} activeOpacity={1} onPress={onStartCancel}>
          <TouchableOpacity style={styles.dialogContainer} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.dialogTitle}>{t('driver.tripDialogs.startTrip.title')}</Text>
            <Text style={styles.dialogText}>{t('driver.tripDialogs.startTrip.message', { clientName })}</Text>
            <View style={styles.dialogButtonsContainer}>
              <TouchableOpacity style={styles.dialogCancelButton} onPress={onStartCancel}>
                <Text style={styles.dialogCancelButtonText}>{t('driver.tripDialogs.buttons.cancelAction')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dialogOkButton} onPress={onStartOk}>
                <Text style={styles.dialogOkButtonText}>{t('driver.tripDialogs.buttons.okAction')}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Waiting */}
      <Modal visible={showWaiting} transparent animationType="fade">
        <TouchableOpacity style={styles.dialogOverlay} activeOpacity={1} onPress={onWaitingCancel}>
          <TouchableOpacity style={styles.dialogContainer} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.dialogTitle}>{t('driver.tripDialogs.waiting.title')}</Text>
            <Text style={styles.dialogText}>{t('driver.tripDialogs.waiting.message', { clientName })}</Text>
            <View style={styles.dialogButtonsContainer}>
              <TouchableOpacity style={styles.dialogCancelButton} onPress={onWaitingCancel}>
                <Text style={styles.dialogCancelButtonText}>{t('driver.tripDialogs.buttons.cancelAction')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dialogOkButton} onPress={onWaitingOk}>
                <Text style={styles.dialogOkButtonText}>{t('driver.tripDialogs.buttons.okAction')}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* End trip */}
      <Modal visible={showEnd} transparent animationType="fade">
        <TouchableOpacity style={styles.dialogOverlay} activeOpacity={1} onPress={onEndCancel}>
          <TouchableOpacity style={styles.dialogContainer} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.dialogTitle}>{t('driver.tripDialogs.endTrip.title')}</Text>
            <Text style={styles.dialogText}>{t('driver.tripDialogs.endTrip.message', { clientName })}</Text>
            <View style={styles.dialogButtonsContainer}>
              <TouchableOpacity style={styles.dialogCancelButton} onPress={onEndCancel}>
                <Text style={styles.dialogCancelButtonText}>{t('driver.tripDialogs.buttons.cancelAction')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dialogOkButton} onPress={onEndOk}>
                <Text style={styles.dialogOkButtonText}>{t('driver.tripDialogs.buttons.okAction')}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Emergency long press */}
      <Modal visible={showEmergency} transparent animationType="fade">
        <TouchableOpacity style={styles.dialogOverlay} activeOpacity={1} onPress={onEmergencyClose}>
          <TouchableOpacity style={styles.dialogContainer} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.dialogTitle}>{t('driver.tripDialogs.emergency.title')}</Text>
            <Text style={styles.dialogText}>{t('driver.tripDialogs.emergency.message')}</Text>
            <View style={styles.dialogButtonsContainer}>
              <TouchableOpacity style={styles.emergencyStopButton} onPress={onEmergencyStop}>
                <Text style={styles.emergencyButtonText}>{t('driver.tripDialogs.emergency.stop')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.emergencyEndButton} onPress={onEmergencyEnd}>
                <Text style={styles.emergencyButtonText}>{t('driver.tripDialogs.emergency.end')}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Stop dialog */}
      <Modal visible={showStop} transparent animationType="fade">
        <TouchableOpacity style={styles.dialogOverlay} activeOpacity={1} onPress={onStopCancel}>
          <TouchableOpacity style={styles.dialogContainer} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.dialogTitle}>{t('driver.tripDialogs.stopTrip.title')}</Text>
            <Text style={styles.dialogText}>{t('driver.tripDialogs.stopTrip.message')}</Text>
            <View style={styles.dialogButtonsContainer}>
              <TouchableOpacity style={styles.dialogCancelButton} onPress={onStopCancel}>
                <Text style={styles.dialogCancelButtonText}>{t('driver.tripDialogs.buttons.cancelAction')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dialogOkButton} onPress={onStopOk}>
                <Text style={styles.dialogOkButtonText}>{t('driver.tripDialogs.buttons.okAction')}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Force end dialog */}
      <Modal visible={showForceEnd} transparent animationType="fade">
        <TouchableOpacity style={styles.dialogOverlay} activeOpacity={1} onPress={onForceEndCancel}>
          <TouchableOpacity style={styles.dialogContainer} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.dialogTitle}>{t('driver.tripDialogs.forceEndTrip.title')}</Text>
            <Text style={styles.dialogText}>{t('driver.tripDialogs.forceEndTrip.message')}</Text>
            <View style={styles.dialogButtonsContainer}>
              <TouchableOpacity style={styles.dialogCancelButton} onPress={onForceEndCancel}>
                <Text style={styles.dialogCancelButtonText}>{t('driver.tripDialogs.buttons.cancelAction')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dialogOkButton} onPress={onForceEndOk}>
                <Text style={styles.dialogOkButtonText}>{t('driver.tripDialogs.buttons.okAction')}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Continue dialog */}
      <Modal visible={showContinue} transparent animationType="fade">
        <TouchableOpacity style={styles.dialogOverlay} activeOpacity={1} onPress={onContinueCancel}>
          <TouchableOpacity style={styles.dialogContainer} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.dialogTitle}>{t('driver.tripDialogs.continueTrip.title')}</Text>
            <Text style={styles.dialogText}>{t('driver.tripDialogs.continueTrip.message')}</Text>
            <View style={styles.dialogButtonsContainer}>
              <TouchableOpacity style={styles.dialogCancelButton} onPress={onContinueCancel}>
                <Text style={styles.dialogCancelButtonText}>{t('driver.tripDialogs.buttons.cancelAction')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dialogOkButton} onPress={onContinueOk}>
                <Text style={styles.dialogOkButtonText}>{t('driver.tripDialogs.buttons.okAction')}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default React.memo(DriverTripDialogs);


