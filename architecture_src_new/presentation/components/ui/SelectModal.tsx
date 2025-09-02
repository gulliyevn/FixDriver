import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { countryCodeToFlag } from '../../../shared/utils/emojiFlag';
import { useI18n } from '../../../shared/i18n';
import { SelectModalStyles as S } from './SelectModal.styles';

export type SelectOption = { label: string; value: string; icon?: keyof typeof Ionicons.glyphMap };

interface SelectModalProps {
  visible: boolean;
  title: string;
  options: SelectOption[];
  selected?: string;
  onSelect: (value: string) => void;
  onClose: () => void;
  showSearch?: boolean;
}

const SelectModal: React.FC<SelectModalProps> = ({ visible, title, options, selected, onSelect, onClose, showSearch = true }) => {
  const [query, setQuery] = useState('');
  const { t } = useI18n();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(o => o.label.toLowerCase().includes(q));
  }, [options, query]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity activeOpacity={1} style={S.overlay} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={S.content}>
          <View style={S.header}>
            <Text style={S.title}>{title}</Text>
            <TouchableOpacity style={S.closeButton} onPress={onClose}>
              <Ionicons name="close" size={20} color="#000" />
            </TouchableOpacity>
          </View>

          {showSearch && (
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t('common.labels.search')}
              placeholderTextColor="#6B7280"
              style={S.search}
              autoCapitalize="none"
              autoCorrect={false}
            />
          )}

          <ScrollView style={S.list} showsVerticalScrollIndicator={false}>
            {filtered.map(opt => {
              const isSelected = selected === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[S.item, isSelected && S.itemSelected]}
                  onPress={() => onSelect(opt.value)}
                >
                  {opt.icon ? (
                    <View style={S.itemIconWrap}>
                      <Ionicons name={opt.icon as any} size={16} color="#64748B" />
                    </View>
                  ) : (/^[A-Z]{2}$/i.test(opt.value) ? (
                    <View style={S.itemIconWrap}>
                      <Text>{countryCodeToFlag(opt.value)}</Text>
                    </View>
                  ) : null)}
                  <Text style={S.itemText}>{opt.label}</Text>
                  {isSelected && (
                    <View style={S.check}>
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default SelectModal;


