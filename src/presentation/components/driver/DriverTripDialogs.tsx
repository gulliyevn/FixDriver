import React, { useState } from 'react';
import { Modal, TouchableOpacity, Text, View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  // Empty dialog
  showEmpty: boolean;
  onEmptyCancel: () => void;
  onEmptyOk: () => void;
  // Cancel dialog
  showCancel: boolean;
  onCancelCancel: () => void;
  onCancelOk: () => void;
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
  // Rating dialog
  showRating: boolean;
  onRatingCancel: () => void;
  onRatingSubmit: (rating: number, comment: string) => void;
  emergencyActionsUsed?: boolean;
  emergencyActionType?: 'stop' | 'end' | null;
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
  showEmpty,
  onEmptyCancel,
  onEmptyOk,
  showCancel,
  onCancelCancel,
  onCancelOk,
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
  showRating,
  onRatingCancel,
  onRatingSubmit,
  emergencyActionsUsed = false,
  emergencyActionType = null,
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

      {/* Begin trip dialog */}
      <Modal visible={showEmpty} transparent animationType="fade">
        <TouchableOpacity style={styles.dialogOverlay} activeOpacity={1} onPress={onEmptyCancel}>
          <TouchableOpacity style={styles.dialogContainer} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.dialogTitle}>{t('driver.tripDialogs.beginTrip.title')}</Text>
            <Text style={styles.dialogText}>{t('driver.tripDialogs.beginTrip.message', { clientName })}</Text>
            <View style={styles.dialogButtonsContainer}>
              <TouchableOpacity style={styles.dialogCancelButton} onPress={onEmptyCancel}>
                <Text style={styles.dialogCancelButtonText}>{t('driver.tripDialogs.buttons.cancelAction')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dialogOkButton} onPress={onEmptyOk}>
                <Text style={styles.dialogOkButtonText}>{t('driver.tripDialogs.buttons.okAction')}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Cancel trip dialog */}
      <Modal visible={showCancel} transparent animationType="fade">
        <TouchableOpacity style={styles.dialogOverlay} activeOpacity={1} onPress={onCancelCancel}>
          <TouchableOpacity style={styles.dialogContainer} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.dialogTitle}>{t('driver.tripDialogs.cancelTrip.title')}</Text>
            <Text style={styles.dialogText}>{t('driver.tripDialogs.cancelTrip.message', { clientName })}</Text>
            <View style={styles.dialogButtonsContainer}>
              <TouchableOpacity style={styles.dialogCancelButton} onPress={onCancelCancel}>
                <Text style={styles.dialogCancelButtonText}>{t('driver.tripDialogs.buttons.cancelAction')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dialogOkButton} onPress={onCancelOk}>
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

      {/* Rating dialog */}
      <RatingDialog
        visible={showRating}
        onCancel={onRatingCancel}
        onSubmit={onRatingSubmit}
        styles={styles}
        emergencyActionsUsed={emergencyActionsUsed}
        emergencyActionType={emergencyActionType}
      />
    </>
  );
};

// Rating Dialog Component
const RatingDialog: React.FC<{
  visible: boolean;
  onCancel: () => void;
  onSubmit: (rating: number, comment: string) => void;
  styles: any;
  emergencyActionsUsed?: boolean;
  emergencyActionType?: 'stop' | 'end' | null;
}> = ({ visible, onCancel, onSubmit, styles, emergencyActionsUsed = false, emergencyActionType = null }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    // Если были использованы экстренные действия, комментарий обязателен
    if (emergencyActionsUsed && !comment.trim()) {
      return; // Не отправляем, если комментарий пустой
    }
    onSubmit(rating, comment);
    setRating(5);
    setComment('');
  };

  const handleCancel = () => {
    onCancel();
    setRating(5);
    setComment('');
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={styles.dialogOverlay} activeOpacity={1} onPress={() => {}}>
        <View style={styles.ratingDialogContainer}>
          <Text style={styles.dialogTitle}>{t('common.rating.title')}</Text>
          <Text style={styles.dialogText}>{t('common.rating.message')}</Text>
          
          {/* Rating Stars */}
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                style={styles.starButton}
                onPress={() => setRating(star)}
              >
                <Ionicons
                  name={star <= rating ? "star" : "star-outline"}
                  size={28}
                  color={star <= rating ? "#FFD700" : "#D1D5DB"}
                />
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Comment Input */}
          <View style={styles.commentContainer}>
            <Text style={styles.commentLabel}>
              {emergencyActionsUsed ? t('common.rating.commentRequired') : t('common.rating.commentLabel')}
            </Text>
            <TextInput
              style={styles.commentInput}
              value={comment}
              onChangeText={setComment}
              placeholder={
                emergencyActionsUsed 
                  ? (emergencyActionType === 'stop' 
                      ? t('common.rating.commentStopPlaceholder')
                      : t('common.rating.commentEndPlaceholder'))
                  : t('common.rating.commentPlaceholder')
              }
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.dialogButtonsContainer}>
            <TouchableOpacity style={styles.dialogCancelButton} onPress={handleCancel}>
              <Text style={styles.dialogCancelButtonText}>{t('driver.tripDialogs.buttons.cancelAction')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.dialogOkButton,
                emergencyActionsUsed && !comment.trim() && { opacity: 0.5 }
              ]} 
              onPress={handleSubmit}
              disabled={emergencyActionsUsed && !comment.trim()}
            >
              <Text style={styles.dialogOkButtonText}>{t('common.rating.submit')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default React.memo(DriverTripDialogs);


