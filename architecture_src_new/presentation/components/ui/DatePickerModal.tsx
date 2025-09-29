import React from 'react';
import { Modal, View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { createDatePickerModalStyles } from './DatePickerModal.styles';
import { getColors } from '../../../shared/constants/adaptiveConstants';
import { Appearance } from 'react-native';
import { useI18n } from '../../../shared/i18n';

interface Props {
  visible: boolean;
  title: string;
  mode: 'date' | 'year';
  onClose: () => void;
  onConfirm: (value: string) => void;
  isDark?: boolean;
  minDate?: Date;
  maxDate?: Date;
  defaultValue?: Date;
}

const DatePickerModal: React.FC<Props> = ({ visible, title, mode, onClose, onConfirm, isDark, minDate, maxDate, defaultValue }) => {
  const [value, setValue] = React.useState(defaultValue || new Date());
  const effectiveIsDark = typeof isDark === 'boolean' ? isDark : Appearance.getColorScheme() === 'dark';
  const colors = getColors(effectiveIsDark);
  const S = React.useMemo(() => createDatePickerModalStyles(effectiveIsDark, colors), [effectiveIsDark]);
  const { t } = useI18n();

  const formatDate = (d: Date) => {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={S.overlay}>
        <View style={S.content}>
          <View style={S.header}>
            <Text style={S.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
          <View style={S.pickerContainer}>
            <DateTimePicker
              value={value}
              mode={'date'}
              display={Platform.OS === 'ios' ? 'inline' : 'spinner'}
              minimumDate={minDate}
              maximumDate={maxDate}
              onChange={(e, d) => d && setValue(d)}
            />
          </View>
          <TouchableOpacity onPress={() => onConfirm(mode === 'year' ? String(value.getFullYear()) : formatDate(value))} style={S.okWrap}>
            <Text style={S.okText}>{t('common.buttons.confirm')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DatePickerModal;


