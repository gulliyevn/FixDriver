import React, { useRef, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { OTPModalStyles as styles } from './OTPModal.styles';
import { Button } from '..';

interface OTPModalProps {
  visible: boolean;
  onClose: () => void;
  onVerify: (otp: string) => void;
  title: string;
  subtitle?: string;
  errorMessage?: string;
  showError?: boolean;
  onInputChange?: () => void;
}

const OTPModal: React.FC<OTPModalProps> = ({ visible, onClose, onVerify, title, subtitle, errorMessage, showError, onInputChange }) => {
  const [codes, setCodes] = useState(['', '', '', '']);
  const [error, setError] = useState<boolean>(false);
  const refs = [useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null)];

  const setDigit = (index: number, value: string) => {
    const v = value.replace(/\D/g, '').slice(-1);
    const next = [...codes];
    next[index] = v;
    setCodes(next);
    if (v && index < 3) refs[index + 1].current?.focus();
    if (error) setError(false);
    onInputChange?.();
  };

  const handleVerify = () => {
    const otp = codes.join('');
    if (otp.length !== 4) {
      setError(true);
      return;
    }
    console.log('[OTPModal] Verify pressed with otp=', otp);
    onVerify(otp);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          <View style={styles.inputsRow}>
            {codes.map((c, i) => (
              <TextInput
                key={i}
                ref={refs[i]}
                style={[
                  styles.inputBox,
                  c ? styles.inputBoxFocused : undefined,
                  (error || showError) ? styles.inputBoxError : undefined,
                ]}
                keyboardType="number-pad"
                maxLength={1}
                value={c}
                onChangeText={(v) => setDigit(i, v)}
                returnKeyType={i === 3 ? 'done' : 'next'}
              />
            ))}
          </View>
          <View style={styles.actionsRow}>
            <Button title="Cancel" onPress={onClose} style={{ flex: 1 }} />
            <Button title="Verify" onPress={handleVerify} style={{ flex: 1 }} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default OTPModal;


