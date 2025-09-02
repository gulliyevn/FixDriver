import React from 'react';
import { Modal, View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { createDatePickerModalStyles } from './DatePickerModal.styles';
import { Appearance } from 'react-native';
import { useI18n } from '../../../shared/i18n';

interface Props {
  visible: boolean;
  title: string;
  mode: 'date' | 'year';
  onClose: () => void;
  onConfirm: (value: string) => void;
  isDark?: boolean;
}

const DatePickerModal: React.FC<Props> = ({ visible, title, mode, onClose, onConfirm, isDark }) => {
  const [value, setValue] = React.useState(new Date());
  const effectiveIsDark = typeof isDark === 'boolean' ? isDark : Appearance.getColorScheme() === 'dark';
  const S = React.useMemo(() => createDatePickerModalStyles(effectiveIsDark), [effectiveIsDark]);
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
              <Ionicons name="close" size={20} color={effectiveIsDark ? '#fff' : '#000'} />
            </TouchableOpacity>
          </View>
          <DateTimePicker
            value={value}
            mode={'date'}
            display={Platform.OS === 'ios' ? 'inline' : 'spinner'}
            onChange={(e, d) => d && setValue(d)}
          />
          <TouchableOpacity onPress={() => onConfirm(mode === 'year' ? String(value.getFullYear()) : formatDate(value))} style={S.okWrap}>
            <Text style={S.okText}>{t('common.buttons.confirm')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DatePickerModal;


