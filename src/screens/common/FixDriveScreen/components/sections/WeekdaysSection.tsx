import React from 'react';
import { View } from 'react-native';
import TimePicker from '../../../../../components/TimePicker';
import ReturnTripCheckbox from '../../../../../components/ReturnTripCheckbox';
import { styles } from './WeekdaysSection.styles';
import { TIME_PICKER_COLORS } from '../constants';

interface Props {
  t: (key: string) => string;
  selectedDays: string[];
  selectedTime?: string;
  onTimeChange?: (time: string) => void;
  returnTime?: string;
  onReturnTimeChange?: (time: string) => void;
  isReturnTrip: boolean;
  onReturnTripChange?: (v: boolean) => void;
  returnTripTime?: string;
  onReturnTripTimeChange?: (time: string) => void;
  returnWeekdaysTime?: string;
  onReturnWeekdaysTimeChange?: (time: string) => void;
}

export const WeekdaysSection: React.FC<Props> = ({
  t,

  selectedDays,
  selectedTime,
  onTimeChange,
  returnTime,
  onReturnTimeChange,
  isReturnTrip,
  onReturnTripChange,
  returnTripTime,
  onReturnTripTimeChange,
  returnWeekdaysTime,
  onReturnWeekdaysTimeChange,
}) => {
  const hasWeekdays = selectedDays.some(d => ['mon','tue','wed','thu','fri'].includes(d));
  const hasWeekend = selectedDays.some(d => ['sat','sun'].includes(d));

  return (
    <View style={styles.container}>
      {hasWeekdays && (
        <TimePicker
          value={selectedTime}
          onChange={onTimeChange}
          placeholder={t('common.selectTime')}
          indicatorColor={TIME_PICKER_COLORS.THERE}
          title={t('common.weekdaysOnly')}
        />
      )}

      {hasWeekend && (
        <View style={[styles.spacerTop16, !hasWeekdays && { marginTop: 0 }]}>
          <TimePicker
            value={returnTime}
            onChange={onReturnTimeChange}
            placeholder={t('common.selectTime')}
            indicatorColor={TIME_PICKER_COLORS.BACK}
            title={t('common.weekend')}
          />
        </View>
      )}

      {(hasWeekdays || hasWeekend) && (
        <View style={styles.spacerTop16Bottom16}>
          <ReturnTripCheckbox
            checked={isReturnTrip}
            onCheckedChange={v => onReturnTripChange?.(v)}
            label={t('common.thereAndBack')}
          />
        </View>
      )}

      {isReturnTrip && hasWeekdays && (
        <TimePicker
          value={returnTripTime}
          onChange={onReturnTripTimeChange}
          placeholder={t('common.selectTime')}
          indicatorColor={TIME_PICKER_COLORS.THERE}
          title={t('common.weekdaysOnly')}
        />
      )}

      {isReturnTrip && hasWeekend && (
        <View style={styles.spacerTop16}>
          <TimePicker
            value={returnWeekdaysTime}
            onChange={onReturnWeekdaysTimeChange}
            placeholder={t('common.selectTime')}
            indicatorColor={TIME_PICKER_COLORS.BACK}
            title={t('common.back')}
          />
        </View>
      )}
    </View>
  );
};
