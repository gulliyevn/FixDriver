import React from 'react';
import { View, Text, TouchableOpacity, Modal, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface TimePickerModalProps {
  visible: boolean;
  title: string;
  value: Date;
  onChange: (date: Date) => void;
  onCancel: () => void;
  onConfirm: () => void;
  colors: any;
  t: (key: string) => string;
}

export const TimePickerModal: React.FC<TimePickerModalProps> = ({
  visible,
  title,
  value,
  onChange,
  onCancel,
  onConfirm,
  colors,
  t,
}) => {
  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: '85%', borderRadius: 12, padding: 16, backgroundColor: colors.surface }}>
          <Text style={{ color: colors.text, fontWeight: '600', fontSize: 16, textAlign: 'center', marginBottom: 8 }}>
            {title}
          </Text>
          <DateTimePicker
            value={value}
            mode="time"
            is24Hour
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_e, d) => d && onChange(d)}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
            <TouchableOpacity onPress={onCancel}>
              <Text style={{ color: colors.primary, fontSize: 16 }}>{t('common.cancel') || 'Отмена'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm}>
              <Text style={{ color: colors.primary, fontSize: 16 }}>{t('common.done') || 'Готово'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
